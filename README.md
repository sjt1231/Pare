# Pare

Pare's monochrome landing page includes an interactive product preview, animated workflow, FAQ, and review-interest form.

## Run locally

Use Node.js 22.12 or later. To start the site:

```sh
npm install
npm run dev
```

Open http://localhost:5173. If the port is occupied, run `PORT=5187 npm run dev`.

## Build and serve

```sh
npm run build
npm run preview
```

Vercel can build and serve the static `dist` directory directly. The form submits to Formspree, so it needs no Vercel serverless route.

## Enquiry storage

The interest form posts to Formspree form `mqpeabgp` and its submissions appear in the Formspree dashboard. No email sender, custom DNS, server-side secret, or Vercel function is required. Configure Formspree notifications and data retention in its dashboard.

## Design and motion

`src/style.css` defines shared color, typography, spacing, and component styles. `src/motion.css` defines the material, chart, and workflow animations. `src/main.js` handles dashboard views, keyboard interaction, viewport reveals, dialogs, and form submission. Reduced-motion preferences disable decorative animation. The preview's pause button pauses background animation.

The dashboard and usage data are illustrative. The FAQ explains the pilot status. The footer omits the NUS project line.
