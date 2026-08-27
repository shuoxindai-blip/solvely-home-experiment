# Solvely Home Experiment — Design Handoff

This is a dependency-free static prototype. All page structure, interactions, and SVG interface graphics are implemented in `index.html`; supporting images are stored in `assets/`.

## Developer handoff

- Product behavior and example data live in `index.html`, primarily under `capabilityData`.
- The complete page-to-source mapping is documented in [`docs/ASSET_HANDOFF.md`](docs/ASSET_HANDOFF.md).
- The PRD appendix that explains all 19 asset groups, 59 local files, and 6 external runtime references is documented in [`docs/PRD_ASSET_CATALOG.md`](docs/PRD_ASSET_CATALOG.md).
- [`assets/catalog.json`](assets/catalog.json) is the machine-readable source of truth for local files and external runtime resources, including source and phase-2 resources.
- Before committing asset changes, run `node scripts/check-assets.mjs` to catch missing files, unindexed files, broken runtime references, and assets not yet tracked by Git or uploaded upstream.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173) in a browser.

The page can also be opened by double-clicking `index.html`, but using a local server is recommended. Internet access is required for the embedded GeoGebra calculator service and outbound app-store links.

Uploaded image attachments include working hover controls for removal and cropping. The crop editor supports switching across every uploaded image, moving or resizing the crop selection, and saving the cropped previews back into the composer.

## Deploy to Vercel

No build step is required:

```bash
npx vercel deploy
```

To deploy directly to production after connecting a Vercel project:

```bash
npx vercel deploy --prod
```

## Links

- GitHub template: https://github.com/shuoxindai-blip/solvely-home-experiment
- Experiment: https://solvely-home-experiment.vercel.app/

Use the GitHub repository’s **Use this template** button to create an independent copy for further design iteration or deployment.
