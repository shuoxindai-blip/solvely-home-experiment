# Solvely Home Experiment — Design Handoff

This is the production-ready Vue implementation of the Solvely home experiment. It uses Vue 3.3.4, Vite, Vue Router, Pinia, Element Plus, Naive UI, Tailwind CSS, Less, Tiptap, KaTeX, and ECharts; supporting images and reusable sample documents live in `assets/`.

## Developer handoff

- The browser entry is `src/main.js`; the page template is `src/views/HomeView.vue`; current product behavior and example data live in `src/features/home/initHomeExperience.js`, primarily under `capabilityData`.
- The complete page-to-source mapping is documented in [`docs/ASSET_HANDOFF.md`](docs/ASSET_HANDOFF.md).
- The PRD appendix that explains all 19 asset groups, 65 local files, and 3 external runtime references is documented in [`docs/PRD_ASSET_CATALOG.md`](docs/PRD_ASSET_CATALOG.md).
- [`assets/catalog.json`](assets/catalog.json) is the machine-readable source of truth for local files and external runtime resources, including source and phase-2 resources.
- Before committing asset changes, run `node scripts/check-assets.mjs` to catch missing files, unindexed files, broken runtime references, and assets not yet tracked by Git or uploaded upstream.

## Preview locally

From this folder, run:

```bash
npm install
npm run dev
```

Then open the local Vite URL printed in the terminal.

Use `npm run verify` to run Vue/TypeScript checks and a production build. Internet access is required for the embedded GeoGebra calculator service and outbound app-store links.

Uploaded image attachments include working hover controls for removal and cropping. The crop editor supports switching across every uploaded image, moving or resizing the crop selection, and saving the cropped previews back into the composer.

## Deploy to Vercel

Build and deploy a preview:

```bash
npm run build
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
