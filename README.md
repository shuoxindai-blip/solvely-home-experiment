# Solvely Home Experiment — Design Handoff

This is a dependency-free static prototype. All page structure, interactions, and SVG interface graphics are implemented in `index.html`; supporting images are stored in `assets/`.

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
