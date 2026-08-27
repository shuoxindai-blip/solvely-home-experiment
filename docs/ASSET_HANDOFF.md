# Asset handoff index

Use [`assets/catalog.json`](../assets/catalog.json) as the source of truth for every local source file in this prototype. It maps each file to a product surface, example scenario, implementation anchor, role, and lifecycle status.

## How developers should wire a case

1. Find the case below or search its `id` in `assets/catalog.json`.
2. Start from the listed `implementation` anchor in `index.html`.
3. Use only files marked `runtime` for the current prototype.
4. Keep `source` files editable, but do not load them directly when a compiled or cropped runtime asset is listed.
5. Do not wire `phase_2` files into phase 1. Exam Prep and Diagnostic require a separate phase-2 flow decision.

## Page-to-asset map

| Product surface | Case / content | Code anchor | Local asset relationship |
| --- | --- | --- | --- |
| Global header | Mobile app download | `.app-download` / `.app-store-link` | App Store badge + cropped Google Play badge + QR are runtime; uncropped Google Play badge is source |
| Study · Solver | Parabola & Linear Intersection | `capabilityData.solver.examples[0]` | Preview PNG opens the local interactive simulator HTML |
| Study · Solver | Intersecting Circles | `capabilityData.solver.examples[1]` | Preview PNG opens the remote video-player URL |
| Study · Solver | Chemistry structure visualization | `capabilityData.solver.examples[2]` | Cover PNG identifies the example; detail structures load from remote Solvely URLs; compact PNG is source only |
| Study · Solver | Financial / Vertical Analysis | `capabilityData.solver.examples[3]` | WEBP is the example preview; detail table is native HTML |
| Study · Graph | Reflection over y-axis | `capabilityData.graph.examples[0]` | Preview PNG opens the matching local simulator HTML |
| Study · Graph | Negative Externality & Pigouvian Tax | `capabilityData.graph.examples[1]` | Preview PNG opens the matching local simulator HTML |
| Study · Graph | Limits at infinity | `capabilityData.graph.examples[2]` | Preview PNG opens the matching local simulator HTML |
| Study · Video | Physics, statistics, geometry | `capabilityData.video` / `videoPreview()` | Three preview PNGs each open their remote video-player URL |
| Study · Flashcards | Anatomy, gravitational field, psychology | `capabilityData.flashcards` | Each WEBP belongs to the named card in its deck; Sankey diagram is an inactive reference |
| Study · Quiz | Biology, physics, chemistry questions | `capabilityData.quiz` | Each WEBP belongs to the matching quiz question and dialog |
| Study · Study Guide | Mitochondrial DNA, prehistoric art, law & crime | `capabilityData.guide` | `study_guide.md` is the full guide; top-level images are section cards; nested `images/` files are markdown illustrations |
| Study · Study Guide | Acids and Bases | Not enabled | Complete retained example; all files are reference-only until the case is added to `capabilityData.guide` |
| Study · Podcast | Three podcast episodes | `capabilityData.podcast` | MP3 is runtime audio; TXT is editable transcript source; `transcripts.js` is the runtime timestamp bundle; host WEBPs are shared avatars |
| Study · Study Set | How the Brain Works | Not enabled | Composite quiz + flashcard image is an inactive `reference`, not a current runtime card |
| Exam Prep / Diagnostic | Exam results reference | Phase 2 only | Exam progress screenshot is retained as `phase_2`; do not treat it as a phase-1 UI asset |

## Status meanings

- `runtime`: loaded by the current prototype.
- `source`: original or editable file retained to regenerate a runtime asset.
- `reference`: approved inactive example or alternative; not currently loaded.
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
