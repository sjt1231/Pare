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

## Analytics

PostHog project 646987 (US Cloud) tracks only `pare-taupe.vercel.app`; localhost and Vercel preview hostnames are excluded. Update the hostname allowlist in `src/analytics.js` when changing the production domain. The project token is public and write-only.

Events: `$pageview`, `$pageleave`, `cta_clicked` (location), `form_started` (first field edit per page), and `form_submitted` (only after Formspree confirms success). Submissions include monthly spend band and scope, never email, company name or free-text services. Autocapture is disabled. Session replay is enabled in the client with all input values masked, form error text masked, and network headers, bodies and console recording disabled. Enable web session recording in PostHog project settings to collect future sessions. Browser local storage maintains anonymous visitor IDs; Do Not Track is respected.

For conversion, use a production-host-filtered `$pageview` → `form_submitted` funnel. CTA clicks are optional, since visitors can scroll directly to the form. Exclude team activity separately in PostHog. Existing Manus annual-spend data must not be conflated with this monthly cloud/software enquiry.

After deployment, verify events in PostHog Activity using one clearly labelled team test and confirm its enquiry in Formspree. This repository does not provision dashboards or change PostHog project settings.
