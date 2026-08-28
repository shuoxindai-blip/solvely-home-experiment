export const WRITING_FILE_ACCEPT = '.pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';
export const WRITING_UNSUPPORTED_FILE_TOAST = 'Unsupported file format. Please upload PDF, Word, or TXT';
export const WRITING_FILE_CAPABILITIES = new Set(['paraphraser', 'plagiarism', 'detector', 'humanizer']);

const writingFileExtensions = ['.pdf', '.doc', '.docx', '.txt'];
const writingFileMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]);

export function isSupportedWritingFile(file) {
  const name = String(file?.name || '').toLowerCase();
  const type = String(file?.type || '').toLowerCase();
  return writingFileExtensions.some(extension => name.endsWith(extension)) || writingFileMimeTypes.has(type);
}

export function selectWritingFiles(files, { enabled = true, hasExistingFile = false } = {}) {
  const incoming = [...files];
  if (!enabled || !incoming.length) return { accepted: [], toast: null };

  const validFiles = incoming.filter(isSupportedWritingFile);
  if (incoming.length > 1) return { accepted: hasExistingFile ? [] : validFiles.slice(0, 1), toast: null };
  if (!validFiles.length) return { accepted: [], toast: WRITING_UNSUPPORTED_FILE_TOAST };
  if (hasExistingFile) return { accepted: [], toast: null };
  return { accepted: [validFiles[0]], toast: null };
}
