# Solvely Home Experiment — Design Handoff

This is a dependency-free static prototype. All page structure, interactions, and SVG interface graphics are implemented in `index.html`; supporting images are stored in `assets/`.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173) in a browser.

The page can also be opened by double-clicking `index.html`, but using a local server is recommended. Internet access is required for the embedded GeoGebra calculator service and outbound app-store links.

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

- Experiment: https://solvely-home-experiment.vercel.app/
- Control: https://solvely-home-demo.vercel.app/

The experiment is maintained separately from the control so design changes do not overwrite the control group.
