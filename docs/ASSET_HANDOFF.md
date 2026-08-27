# Asset handoff index

Use [`assets/catalog.json`](../assets/catalog.json) as the source of truth for every local file and external runtime resource in this prototype. `files` contains the 65 repository files; `externalResources` contains 3 remote HTML references. Both map resources to a product surface, example scenario, implementation anchor, role, and lifecycle status.

For the product-requirement explanation of all 19 groups, 65 local files, and 3 external runtime references, see [`PRD_ASSET_CATALOG.md`](PRD_ASSET_CATALOG.md).

## How developers should wire a case

1. Find the case below or search its `id` in `assets/catalog.json`.
2. Start from the listed `implementation` anchor in `src/features/home/initHomeExperience.js` or `src/views/HomeView.vue`.
3. Use only files marked `runtime` for the current prototype.
4. Treat `externalResources` marked `runtime` as required detail content, not optional links; provide a loading failure and retry state for remote HTML.
5. Keep `source` files editable, but do not load them directly when a compiled or cropped runtime asset is listed.
6. Do not wire `phase_2` files into phase 1. Exam Prep and Diagnostic require a separate phase-2 flow decision.

## Page-to-asset map

| Product surface | Case / content | Code anchor | Local asset relationship |
| --- | --- | --- | --- |
| Global header | Mobile app download | `.app-download` / `.app-store-link` | App Store badge + cropped Google Play badge + QR are runtime; uncropped Google Play badge is source |
| Study · Solver | Parabola & Linear Intersection | `capabilityData.solver.examples[0]` | Preview PNG opens the local interactive simulator HTML |
| Study · Solver | Parallelogram LMNO step-by-step solution | `capabilityData.solver.examples[1]` | Problem image and video thumbnail are bundled with a reusable local HTML answer document |
| Study · Solver | Chemistry structure visualization | `capabilityData.solver.examples[2]` | Cover PNG identifies the example; a local HTML document switches among three bundled structure images |
| Study · Solver | Financial / Vertical Analysis | `capabilityData.solver.examples[3]` | WEBP is the example preview; a local HTML document owns the table and metric-highlighting interaction |
| Study · Graph | Reflection over y-axis | `capabilityData.graph.examples[0]` | Preview PNG opens the matching local simulator HTML |
| Study · Graph | Negative Externality & Pigouvian Tax | `capabilityData.graph.examples[1]` | Preview PNG opens the matching local simulator HTML |
| Study · Graph | Limits at infinity | `capabilityData.graph.examples[2]` | Preview PNG opens the matching local simulator HTML |
| Study · Video | Physics, statistics, geometry | `capabilityData.video` / `videoPreview()` | Three preview PNGs each open their remote video-player URL |
| Study · Flashcards | Anatomy, gravitational field, psychology | `capabilityData.flashcards` | Each WEBP belongs to the named card in its deck |
| Study · Quiz | Biology, physics, chemistry questions | `capabilityData.quiz` | Each WEBP belongs to the matching quiz question and dialog |
| Study · Study Guide | Mitochondrial DNA, prehistoric art, law & crime | `capabilityData.guide` | `study_guide.md` is the full guide; top-level images are section cards; nested `images/` files are markdown illustrations |
| Study · Podcast | Three podcast episodes | `capabilityData.podcast` | MP3 is runtime audio; TXT is editable transcript source; `transcripts.js` is the runtime timestamp bundle; host WEBPs are shared avatars |
| Exam Prep / Diagnostic | Exam results reference | Phase 2 only | Exam progress screenshot is retained as `phase_2`; do not treat it as a phase-1 UI asset |

## Status meanings

- `runtime`: loaded by the current prototype.
- `source`: original or editable file retained to regenerate a runtime asset.
- `phase_2`: retained for Exam Prep or Diagnostic phase 2; intentionally not wired into phase 1.

## Validation

Run this before committing asset changes:

```bash
node scripts/check-assets.mjs
```

The check fails when an asset is missing from the catalog, a catalogued file is missing, a status is invalid, or a `runtime` file has no code/content reference. It also warns when a local asset has not been added to Git or does not exist on the configured upstream branch.

When adding or replacing an asset:

- Put it in the feature folder under `assets/`.
- Update the existing catalog group or add one new group.
- Update the relevant `capabilityData` entry or rendering function if the file is `runtime`.
- Run the checker and confirm there are no errors or Git-tracking warnings before pushing.
