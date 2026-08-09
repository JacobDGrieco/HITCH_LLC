# API

All API routes are public unless noted otherwise. There is no authentication layer in the current repository.

## Portfolio Content

### `GET /api/projects`

Implemented by `api/projects.js`. Reads `projects` rows from Postgres and returns:

```json
{ "projects": [] }
```

Rows are deduped by normalized title and returned in display order. The endpoint sets `Cache-Control: s-maxage=60, stale-while-revalidate=300`.

### `GET /api/skills`

Implemented by `api/skills.js`. Reads `skills` rows and returns:

```json
{ "skills": [] }
```

Each skill includes `name`, `category`, and `level`.

### `GET /api/education`

Implemented by `api/education.js`. Reads `education_items` rows and returns:

```json
{ "education": [] }
```

### `GET /api/experience`

Implemented by `api/experience.js`. Reads `experience` rows and returns:

```json
{ "experience": [] }
```

## Music

### `GET /api/music/playlist`

Implemented by `api/music/playlist.js`. Returns:

```json
{ "tracks": [] }
```

When any metadata row points to SoundCloud, the endpoint returns SoundCloud tracks and skips Blob listing. This is an operational convenience for swapping music without requesting MP3 assets, not a permanent business rule.

When no SoundCloud rows exist, the endpoint lists private Vercel Blob audio under `music/` and cover art under `arts/`.

### `GET /api/music/stream?pathname=...`

Implemented by `api/music/stream.js`. Streams private Vercel Blob objects whose path starts with `music/` or `arts/`. Requires `BLOB_READ_WRITE_TOKEN`.

Invalid pathnames return `400`; missing content returns `404`.

## Contact

### `GET /api/contact`

Implemented by `api/contact.py`. Health check endpoint returning a small JSON success response.

### `POST /api/contact`

Implemented by `api/contact.py`. Accepts:

```json
{
	"name": "Example",
	"email": "person@example.com",
	"subject": "Project inquiry",
	"message": "Message text",
	"company": ""
}
```

`company` is a honeypot field. If populated, the endpoint returns success without sending email.

The endpoint uses minimal email validation and sends mail through SMTP. Detailed SMTP/configuration errors should be hardened in a future pass.
