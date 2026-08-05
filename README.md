# HITCH LLC Portfolio Site

This project is a personal portfolio site built with React and Vite. It presents the site as a navigable cloud scene: the landing page acts as a visual hub, and each floating cloud routes to a dedicated section for projects, skills, education, experience, contact, and about content.

## What It Does

- Renders an animated home scene with cloud-based navigation.
- Uses route-specific page shells and transitions for each portfolio section.
- Displays portfolio content through reusable crystal-style cards.
- Includes a persistent `das` music control with manual opt-in playback.
- Loads music metadata from API routes and streams tracks from the backend.
- Includes a contact API endpoint and supporting music metadata storage utilities.

## Tech Stack

- React 19
- Vite
- React Router
- GSAP
- Tailwind CSS v4
- Vercel-oriented API routes

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
.
├─ api/
|  ├─ db/
│     ├─ music_track_metadata.sql
│     └─ page_content_tables.sql
│  ├─ contact.py
│  └─ music/
│     ├─ playlist.js
│     └─ stream.js
├─ lib/
│  └─ musicMetadataStore.js
├─ public/
│  └─ static images, logos, clouds, and media assets
├─ src/
│  ├─ components/
│  │  ├─ CloudsHome/
│  │  ├─ audio/
│  │  ├─ chrome/
│  │  ├─ CrystalCard.jsx
│  │  └─ PageShell.jsx
│  ├─ pages/
│  │  ├─ AboutPage.jsx
│  │  ├─ ContactPage.jsx
│  │  ├─ EducationPage.jsx
│  │  ├─ ExperiencePage.jsx
│  │  ├─ ProjectsPage.jsx
│  │  └─ SkillsPage.jsx
│  ├─ styles/
│  ├─ App.jsx
│  ├─ App.css
│  ├─ index.css
│  └─ main.jsx
├─ vercel.json
├─ vite.config.js
└─ package.json
```

## Frontend Organization

- `src/components/CloudsHome/`: landing page scene, floating cloud navigation, and intro animation.
- `src/components/audio/`: site-wide music state and playback control.
- `src/components/chrome/`: persistent UI chrome such as the `das` element.
- `src/components/CrystalCard.jsx`: shared crystal card primitive used across portfolio sections.
- `src/components/PageShell.jsx`: shared routed-page wrapper with animated transition behavior.
- `src/pages/`: top-level route content for each portfolio section.
- `src/styles/`: page-specific and shared styling.

## Backend and Data

- `api/music/playlist.js`: returns playlist data for the site music player.
- `api/music/stream.js`: handles music streaming access.
- `api/contact.py`: contact endpoint.
- `lib/musicMetadataStore.js`: music metadata access layer.
- `db/music_track_metadata.sql`: schema/setup for music track metadata.

## Notes

- Environment variables are loaded from `.env`.
- Static visual assets are expected in `public/`.
- The repo is structured for a frontend-first portfolio site with a small API surface for music and contact functionality.
