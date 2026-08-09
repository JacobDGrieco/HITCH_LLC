# Application Flows

## Home Navigation

1. `src/main.jsx` renders `App`.
2. `src/App.jsx` routes `/` to `CloudsHome`.
3. `src/components/CloudsHome/CloudsHome.jsx` renders the brand scene, route buttons, and project portals.
4. Route buttons call `navigate()` to `/about`, `/projects`, `/experience`, or `/education`.
5. Project portal buttons open external live URLs with `window.open`.
6. The home page schedules idle preloading of static assets and portfolio API data through `src/lib/pageDataCache.js`.

## Section Page Entry And Return

1. `src/App.jsx` wraps routed section pages in `PageShell`.
2. `src/components/PageShell.jsx` reveals content after a short timeout so CSS transitions can run.
3. The back button hides the placeholder `das` chrome, stores `cloudsHomeReturnSection`, hides content, and returns to `/`.
4. `CloudsHome` currently removes `cloudsHomeReturnSection` on mount.

## Portfolio Data Loading

1. A page reads any module-level cached data from `src/lib/pageDataCache.js`.
2. The page calls its loader, such as `loadProjectsPageData`.
3. The loader reuses an in-flight request if one exists.
4. The matching API route queries Neon/Postgres through `lib/db.js`.
5. Rows are deduped by normalized title through `lib/contentDedupe.js`.
6. The API maps database fields into frontend-friendly JSON and returns it.
7. The page updates local React state if it is still mounted.

## Desktop Contact Form

1. `src/pages/AboutPage.jsx` renders `ContactPage` only when the viewport is not classified as mobile.
2. `src/pages/ContactPage.jsx` renders the form inside `AboutContactFormStage`.
3. Because the form is visually projected into a transformed scene, pointer handlers compute which control the user meant to target.
4. Form submission posts JSON to `/api/contact`.
5. `api/contact.py` silently accepts honeypot submissions, validates the email minimally, loads SMTP configuration, and sends an email.
6. The frontend shows sent or error state based on the response.

## Music Playback

1. `SiteMusicProvider` schedules `/api/music/playlist` loading during idle time.
2. `api/music/playlist.js` reads metadata from Postgres.
3. If metadata contains SoundCloud URLs, SoundCloud tracks are returned so music can be swapped without requesting MP3 files.
4. Otherwise, the API lists Vercel Blob audio under `music/`, pairs cover art under `arts/`, and returns stream URLs.
5. The client shuffles the playlist intentionally on each load.
6. Blob tracks use `HTMLAudioElement`; SoundCloud tracks use a hidden SoundCloud widget iframe.
7. `PersistentDas` renders the current placeholder music control. Future cleanup should rename it to radio.
