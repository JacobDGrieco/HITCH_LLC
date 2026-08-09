# Environment Variables

Only variables read by the current code are documented here. Provider-generated Neon/Vercel aliases may exist in local `.env` files, but they are not required unless the code reads them.

| Name | Required | Client Safe | Used By | Purpose | Example |
| --- | --- | --- | --- | --- | --- |
| `DATABASE_URL` | Required for content APIs unless `POSTGRES_URL` is set | No | `lib/db.js`, `lib/musicMetadataStore.js` | Primary Neon/Postgres connection URL. | `postgres://user:password@host/db?sslmode=require` |
| `POSTGRES_URL` | Fallback for `DATABASE_URL` | No | `lib/db.js`, `lib/musicMetadataStore.js` | Alternate Postgres connection URL, often provided by hosting integrations. | `postgres://user:password@host/db?sslmode=require` |
| `BLOB_READ_WRITE_TOKEN` | Required for private Blob streaming; optional for playlist fallback | No | `api/music/playlist.js`, `api/music/stream.js` | Allows server-side listing and reading of Vercel Blob music/art assets. | `vercel_blob_rw_...` |
| `SMTP_HOST` | Required for contact send | No | `api/contact.py` | SMTP server hostname. | `smtp.example.com` |
| `SMTP_PORT` | Optional | No | `api/contact.py` | SMTP port. Defaults to `587`. | `587` |
| `SMTP_USE_TLS` | Optional | No | `api/contact.py` | Enables STARTTLS unless set to a false-like value. Defaults to true. | `true` |
| `SMTP_USERNAME` | Required for contact send | No | `api/contact.py` | SMTP login username and default sender email. | `contact@example.com` |
| `SMTP_PASSWORD` | Required for contact send | No | `api/contact.py` | SMTP login password or app password. | `replace-with-secret` |
| `SMTP_FROM_EMAIL` | Optional | No | `api/contact.py` | Sender address for contact emails. Defaults to `SMTP_USERNAME`. | `noreply@example.com` |
| `SMTP_FROM_NAME` | Optional | No | `api/contact.py` | Sender display name. Defaults to `HITCH Contact Form`. | `HITCH Contact Form` |
| `SMTP_TO_EMAIL` | Required for contact send | No | `api/contact.py` | Destination inbox for contact submissions. | `owner@example.com` |

Never expose these values to client code or commit them to source control.
