# HITCH LLC Portfolio Site

HITCH LLC is a React/Vite portfolio and website-consultation site for HeadInTheCloudsHaven. The frontend presents a cloud-themed visual hub, animated section pages, project windows, contact links, a desktop contact form, and an opt-in music player.

## Features

- Cloud-themed home scene with navigation to about, projects, experience, and education.
- Animated route shell shared by the routed section pages.
- Database-backed portfolio content for projects, skills, education, and experience.
- Three.js project-window scenes for desktop/tablet project presentation.
- About page with contact links and a desktop-only contact form.
- Global "radio" music control backed by Vercel Blob audio or SoundCloud metadata.
- Vercel Analytics and Speed Insights instrumentation.

## Tech Stack

- React 19, React Router, Vite, and Tailwind CSS v4.
- Plain CSS files under `src/styles/` for page and component styling.
- Three.js through `@react-three/fiber` and `@react-three/drei`.
- GSAP for selected entry animation.
- Vercel serverless API routes under `api/`.
- Neon/Postgres through `@neondatabase/serverless`.
- Vercel Blob for private music/art streaming.
- FastAPI contact endpoint with SMTP delivery.

## Requirements

- Node.js and npm compatible with the installed package lock.
- Python dependencies from `requirements.txt` when running the contact endpoint locally through Vercel dev.
- Environment variables documented in [docs/environment-variables.md](docs/environment-variables.md).

## Setup

```bash
npm install
```

Create a local `.env` with only the variables needed by the current code. Do not commit secrets.

## Local Development

Frontend-only Vite development:

```bash
npm run dev
```

Vercel-style local API development:

```bash
npm run dev:vercel
```

The Vite config proxies `/api` to `localhost:3000`, which is the expected Vercel dev server address.

## Build And Checks

```bash
npm run lint
npm run build
npm run preview
```

There is no test script in `package.json` at the time of this documentation pass.

## Current Routes

- `/`: home cloud scene.
- `/about`: about page, contact links, and desktop contact form.
- `/projects`: project list and Three.js project windows.
- `/experience`: experience cards plus the moved skills section.
- `/education`: education cards.

The old `/skills` and `/contact` routes are no longer active. Cleanup work is tracked in [FUTURE_FIXES.md](FUTURE_FIXES.md).

## Documentation

- [Architecture](docs/architecture.md)
- [Project Structure](docs/project-structure.md)
- [Application Flows](docs/application-flows.md)
- [API](docs/api.md)
- [Data Model](docs/data-model.md)
- [Environment Variables](docs/environment-variables.md)
- [External Integrations](docs/external-integrations.md)
- [Development](docs/development.md)
- [Deployment](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

## Known Limitations

- Contact form rendering is intentionally omitted on mobile because the current design does not adapt cleanly to small screens.
- Contact API email validation is intentionally minimal and relies partly on browser validation.
- Contact API error reporting should be hardened before production exposure of detailed SMTP/config errors.
- The music playlist intentionally shuffles; with only a few tracks, repeats can feel frequent.
