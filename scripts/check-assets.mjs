#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'assets/catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const allowedStatuses = new Set(Object.keys(catalog.statusDefinitions || {}));
const errors = [];
const warnings = [];

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [toPosix(path.relative(root, absolute))];
  });
}

const groups = Array.isArray(catalog.groups) ? catalog.groups : [];
const groupIds = new Set();
const catalogFiles = new Map();
const externalResources = new Map();
const allowedExternalTypes = new Set(['remote_html', 'remote_image']);

for (const group of groups) {
  if (!group.id) errors.push('A catalog group is missing id.');
  if (groupIds.has(group.id)) errors.push(`Duplicate group id: ${group.id}`);
  groupIds.add(group.id);

  for (const file of group.files || []) {
    if (!file.path?.startsWith('assets/')) {
      errors.push(`${group.id}: invalid asset path ${file.path || '(missing)'}`);
      continue;
    }
    if (!allowedStatuses.has(file.status)) {
      errors.push(`${file.path}: unknown status ${file.status || '(missing)'}`);
    }
    if (!file.role) errors.push(`${file.path}: missing role`);
    if (catalogFiles.has(file.path)) {
      errors.push(`${file.path}: catalogued more than once (${catalogFiles.get(file.path)} and ${group.id})`);
    }
    catalogFiles.set(file.path, group.id);
    if (!fs.existsSync(path.join(root, file.path))) errors.push(`${file.path}: catalogued file is missing`);
  }

  for (const resource of group.externalResources || []) {
    let parsedUrl;
    try {
      parsedUrl = new URL(resource.url);
    } catch {
      errors.push(`${group.id}: invalid external resource URL ${resource.url || '(missing)'}`);
      continue;
    }
    if (parsedUrl.protocol !== 'https:') errors.push(`${resource.url}: external resources must use HTTPS`);
    if (!resource.role) errors.push(`${resource.url}: missing role`);
    if (!allowedExternalTypes.has(resource.type)) {
      errors.push(`${resource.url}: unknown external resource type ${resource.type || '(missing)'}`);
    }
    if (!allowedStatuses.has(resource.status)) {
      errors.push(`${resource.url}: unknown status ${resource.status || '(missing)'}`);
    }
    if (externalResources.has(resource.url)) {
      errors.push(`${resource.url}: external resource catalogued more than once (${externalResources.get(resource.url)} and ${group.id})`);
    }
    externalResources.set(resource.url, group.id);
  }
}

const diskFiles = walk(path.join(root, 'assets'))
  .filter((file) => file !== 'assets/catalog.json')
  .sort();

for (const file of diskFiles) {
  if (!catalogFiles.has(file)) errors.push(`${file}: exists on disk but is not catalogued`);
}

for (const file of catalogFiles.keys()) {
  if (!diskFiles.includes(file)) errors.push(`${file}: catalogued but not found on disk`);
}

const runtimeFiles = [...groups]
  .flatMap((group) => group.files || [])
  .filter((file) => file.status === 'runtime')
  .map((file) => file.path);
const searchableFiles = ['index.html', ...diskFiles.filter((file) => /\.(?:html|md|js|json|txt)$/.test(file))];

for (const asset of runtimeFiles) {
  const referenced = searchableFiles.some((source) => {
    if (source === asset || source === 'assets/catalog.json') return false;
    const absolute = path.join(root, source);
    if (!fs.existsSync(absolute)) return false;
    const content = fs.readFileSync(absolute, 'utf8');
    const relative = toPosix(path.relative(path.dirname(source), asset));
    return content.includes(asset) || content.includes(relative);
  });
  if (!referenced) errors.push(`${asset}: marked runtime but no source file references it`);
}

const runtimeExternalResources = [...groups]
  .flatMap((group) => group.externalResources || [])
  .filter((resource) => resource.status === 'runtime');

for (const resource of runtimeExternalResources) {
  const referenced = searchableFiles.some((source) => {
    if (source === 'assets/catalog.json') return false;
    const absolute = path.join(root, source);
    return fs.existsSync(absolute) && fs.readFileSync(absolute, 'utf8').includes(resource.url);
  });
  if (!referenced) errors.push(`${resource.url}: marked runtime but no source file references it`);
}

let tracked = new Set();
try {
  tracked = new Set(execFileSync('git', ['ls-files', 'assets'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean));
} catch {
  warnings.push('Could not read the Git index; upload status was not checked.');
}

for (const asset of catalogFiles.keys()) {
  if (!tracked.has(asset)) warnings.push(`${asset}: present locally but not tracked by Git`);
}

try {
  const upstream = execFileSync('git', ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], { cwd: root, encoding: 'utf8' }).trim();
  const upstreamFiles = new Set(execFileSync('git', ['ls-tree', '-r', '--name-only', upstream, '--', 'assets'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean));
  for (const asset of catalogFiles.keys()) {
    if (!upstreamFiles.has(asset)) warnings.push(`${asset}: not present on upstream ${upstream}`);
  }
} catch {
  warnings.push('Could not read the upstream branch; remote upload status was not checked.');
}

console.log(`Asset catalog: ${catalogFiles.size} files in ${groups.length} groups`);
console.log(`Status counts: ${[...allowedStatuses].map((status) => `${status}=${[...groups].flatMap((group) => group.files || []).filter((file) => file.status === status).length}`).join(', ')}`);
console.log(`External resource catalog: ${externalResources.size} references (${[...allowedExternalTypes].map((type) => `${type}=${[...groups].flatMap((group) => group.externalResources || []).filter((resource) => resource.type === type).length}`).join(', ')})`);

if (warnings.length) {
  console.log('\nWarnings:');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('\nErrors:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nAsset catalog is complete and all runtime references resolve.');
