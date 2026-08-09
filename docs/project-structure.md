# Project Structure

## Root Files

- `package.json`: npm scripts and dependency declarations.
- `vite.config.js`: Vite plugins, Tailwind integration, local `/api` proxy, and a development-only HTML import fallback.
- `vercel.json`: Vercel build, output directory, SPA rewrites, and deployment ignore behavior.
- `README.md`: developer-facing project overview.
- `DOCUMENTATION_AUDIT.md`: repository-wide documentation audit.
- `FUTURE_FIXES.md`: deferred cleanup and hardening tasks.

## `src/`

Frontend application code.

- `src/main.jsx`: mounts React and analytics.
- `src/App.jsx`: route tree, lazy route loading, app providers, and persistent chrome.
- `src/index.css`: global reset, Tailwind import, shared CSS variables, and keyframes.
- `src/App.css`: dead template/demo stylesheet tracked for later removal.

## `src/pages/`

Route-level and embedded page sections.

- `AboutPage.jsx`: about content, contact links, responsive scene scaling, and desktop contact form embedding.
- `ProjectsPage.jsx`: project API loading, responsive project presentation, and Three.js stage selection.
- `ExperiencePage.jsx`: experience API loading and embedded skills section.
- `EducationPage.jsx`: education API loading and GSAP entry animation.
- `SkillsPage.jsx`: moved skills section, now used inside `ExperiencePage`.
- `ContactPage.jsx`: desktop contact form and transformed hit-target handling, used inside `AboutPage`.

## `src/components/`

Reusable UI and scene components.

- `CloudsHome/CloudsHome.jsx`: home navigation scene and background preloading.
- `CloudsHome/CloudPortalStage.jsx`: Three.js project portal scene.
- `ProjectsWindowStage.jsx`: Three.js project card/window renderer.
- `AboutContactFormStage.jsx`: Three.js/Drei wrapper for the contact form.
- `DropCard.jsx`: shared droplet card used by education and experience.
- `SkillCrystal.jsx`: droplet-style skill indicator used by `SkillsPage`.
- `PageShell.jsx`: shared route wrapper and return-home transition.
- `SectionNav.jsx`: section navigation used on home and route pages.
- `audio/`: site music context, provider, and hook.
- `chrome/`: persistent music-control chrome and its visibility context.

## `src/styles/`

Plain CSS files grouped by page or component. Large files such as `clouds-home.css`, `about-page.css`, `projects-page.css`, and `contact-page.css` carry most responsive layout behavior.

## `api/`

Vercel API routes and database scripts.

- `projects.js`, `skills.js`, `education.js`, `experience.js`: public read-only portfolio data endpoints.
- `music/playlist.js`: playlist endpoint backed by metadata, Vercel Blob, or SoundCloud.
- `music/stream.js`: private Blob streaming endpoint for `music/` and `arts/` files.
- `contact.py`: FastAPI SMTP contact endpoint.
- `db/music_track_metadata.sql`: current music metadata table setup.
- `db/page_content_tables.sql`: old page-content schema script retained only until cleanup.

## `lib/`

Server-side helper modules used by API routes.

- `db.js`: Neon client factory.
- `contentDedupe.js`: legacy duplicate-title normalization.
- `musicMetadataStore.js`: music metadata reader with legacy table fallback.
- `optimizedAssetPath.js`: local asset path remapping from legacy PNGs to WebP files.

## `public/`

Static images, project previews, icons, resume assets, and favicon served directly by Vite/Vercel.
