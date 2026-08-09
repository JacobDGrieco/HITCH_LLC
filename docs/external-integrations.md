# External Integrations

## Neon/Postgres

Portfolio content and music metadata are read from Postgres through `@neondatabase/serverless`. The helper is `lib/db.js`, and music metadata uses `lib/musicMetadataStore.js`.

## Vercel Blob

`api/music/playlist.js` lists private Blob files when Blob music is active. `api/music/stream.js` streams private files from `music/` and `arts/` path prefixes.

## SoundCloud

SoundCloud metadata rows let the site swap music without MP3 assets. The frontend loads the SoundCloud widget API in `src/components/audio/SiteMusicProvider.jsx` and controls a hidden iframe.

## SMTP

`api/contact.py` sends contact submissions through SMTP. The `company` field is a honeypot and should stay hidden from users.

## Vercel Analytics And Speed Insights

`src/main.jsx` renders `Analytics` and `SpeedInsights` alongside the React app.
