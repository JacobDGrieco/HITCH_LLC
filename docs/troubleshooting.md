# Troubleshooting

## Portfolio APIs Return 500

Likely causes:

- `DATABASE_URL` and `POSTGRES_URL` are both missing.
- The expected page-content tables do not exist.
- The database connection URL is not valid for Neon serverless.

Check `lib/db.js` and the relevant API handler under `api/`.

## Playlist Is Empty

Likely causes:

- No SoundCloud rows exist in `metadata` or `music_track_metadata`.
- `BLOB_READ_WRITE_TOKEN` is missing, so Blob listing is skipped.
- Blob files are not under `music/` or do not have supported audio extensions.

Check `api/music/playlist.js` and `lib/musicMetadataStore.js`.

## Music Stream Returns 400

`api/music/stream.js` only allows `pathname` values starting with `music/` or `arts/`.

## Contact Form Returns 500

Likely causes:

- A required SMTP variable is missing.
- The SMTP server rejects the credentials.

Current client-facing errors may expose too much detail and should be hardened later.

## Contact Form Is Missing On Mobile

This is intentional. The desktop contact form is omitted on mobile because the current transformed form design has styling problems on small screens.

## Vercel Did Not Deploy A Commit

`vercel.json` intentionally ignores commits that do not contain `[deploy]` in the commit message.
