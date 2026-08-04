# Database Current State

## Stack And Source Of Truth

- Runtime database access uses Neon serverless PostgreSQL through `@neondatabase/serverless`.
- API routes call `getDb()` from `lib/db.js`, which reads `DATABASE_URL` or `POSTGRES_URL`.
- There is no Prisma schema or migration directory in this repo.
- Local setup is currently represented by `api/db/setup.js`, `api/db/seed.js`, and `db/music_track_metadata.sql`.
- The official page-content schema was provided from database screenshots and is treated as the app contract.

## Page Content Tables

- `projects`: `id`, `title`, `desc`, `tags`, `icon_image`, `link_url`, `color_hex`, `size`, `display_order`.
- `skills`: `id`, `title`, `percentage`, `skill_group`, `display_order`.
- `education_items`: `id`, `title`, `desc`, `color_hex`, `icon_image`, `size`, `display_order`.
- `experience`: `id`, `title`, `role`, `date_range`, `desc`, `tags`, `icon_image`, `color_hex`, `size`, `display_order`.

## Application Dependencies

- `api/projects.js` reads `projects` and maps rows into `DropCard` props.
- `api/skills.js` reads `skills` and maps rows into `SkillCrystal` props.
- `api/education.js` reads `education_items` and maps rows into `DropCard` props.
- `api/experience.js` reads `experience` and maps rows into `DropCard` props.
- Frontend page-content fallbacks were removed during this change; page data is expected from backend APIs.
- Backend seed data still contains starter content for initial database population.

## Music Metadata

- Music metadata is read from either `metadata` or `music_track_metadata`.
- `pathname` is used as a track source identifier and now supports both Blob paths and SoundCloud URLs.

## Integrity Risks

- Existing page tables have few constraints beyond primary keys and basic title requirements on most content tables.
- User-facing ordering relies on integer order columns but does not enforce uniqueness.
- `tags` are represented as `TEXT[]`, which is practical for this small portfolio but does not normalize tags.
- Existing setup and API names still map snake_case database fields into frontend prop names such as `iconImage`, `gemColor`, and `dateRange`.

## Performance Risks

- Page-content queries are bounded and ordered. Expected row counts are small.
- No explicit indexes exist for order columns, but table sizes are expected to remain tiny.

## Security And Privacy Risks

- Page APIs expose public portfolio content only.
- There is no admin editing interface in this repo. Database edits are assumed to happen outside the app.
- No authentication or authorization logic was found for content editing.

## Operational Risks

- There is no formal migration runner. Applying table changes requires running SQL manually or extending setup scripts.
- Existing local databases may still contain removed compatibility columns from older setup runs. The application no longer reads those columns.
- Frontend fallbacks were removed, so backend data issues now surface as empty page content.

## Assumptions And Open Questions

- The desired editing workflow is direct database editing, not a new admin UI.
- Hex colors will be stored as strings such as `#78d2ff` and passed through to the frontend as CSS colors.
- A single project link is stored in `projects.link_url`.
- Experience keeps `role` and `date_range`, matching the official table.
