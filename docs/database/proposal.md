# Database Proposal

## Goal

Move Projects, Skills, Education, and Experience content fully behind backend APIs so content can be edited in the database without redeploying the frontend.

## Existing Design

- The repo already has backend tables and read APIs for all four requested content pages.
- The official database now uses cleaner page-content tables without the previous compatibility columns.
- The local setup, seed, and API handlers still need to follow that official contract.

## Proposed Design

Use the existing table names, because the APIs already depend on them, and add or standardize the requested editable columns:

- `projects`: `id`, `title`, `desc`, `tags`, `icon_image`, `link_url`, `color_hex`, `size`, `display_order`.
- `skills`: `title`, `percentage`, `skill_group`, `display_order`.
- `education_items`: `id`, `title`, `desc`, `color_hex`, `icon_image`, `size`, `display_order`.
- `experience`: `id`, `title`, `role`, `date_range`, `desc`, `tags`, `icon_image`, `color_hex`, `size`, `display_order`.

For raindrop sizing, `size` should store a scale multiplier instead of a pixel width:

- `1` renders the standard drop size.
- `1.5` renders 50% larger than standard.
- `0.5` renders half size.

The application continues to treat larger values, such as `340`, as legacy pixel widths so old local rows remain renderable if a local database has not been cleaned up.

Do not read removed compatibility columns from API handlers. Frontend-only presentation defaults, such as `featured` and page-specific class names, should be assigned in API response mapping or components.

## Evidence

- `api/projects.js`, `api/skills.js`, `api/education.js`, and `api/experience.js` already query database tables.
- The official schema screenshots show that columns such as `gem_color`, `github_url`, `live_url`, `featured`, `class_name`, `name`, `category`, and `level` are no longer present on the page-content tables.

## Expected Benefit

- Content edits can be made in the database without frontend redeploys.
- API contracts match the official database schema.
- Removing frontend content fallbacks prevents stale hardcoded data from masking backend issues.

## Affected Files

- `api/db/setup.js`
- `api/db/seed.js`
- `api/projects.js`
- `api/skills.js`
- `api/education.js`
- `api/experience.js`
- `src/lib/pageDataCache.js`
- New SQL proposal file under `db/`

## Compatibility Impact

- Code changes require the official table shape.
- API responses remain compatible with current React components.
- Existing local databases can keep extra old columns, but the app no longer depends on them.

## Data Transformation

Recommended local backfill:

- Existing `size = 220` rows should become `size = 1`, because `220` was the old pixel default rather than an intentional custom size.
- Any local data still stored only in removed columns should be copied manually into the official columns before dropping old columns.

## Locking, Downtime, Deployment

- `ALTER TABLE ADD COLUMN IF NOT EXISTS` and `ALTER COLUMN size` operations should be fast on small tables.
- Dropping old local-only columns is optional and should be done only after checking local data.

## Rollback

- Application rollback restores previous compatibility reads.
- Any destructive local cleanup should be backed up first.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Import API handlers to verify syntax.
- Run setup SQL only in an approved database environment.
- Query each page API and verify non-empty rows where content exists.

## Classification

- Current application and setup alignment: Requires application coordination.
- Optional local cleanup of removed columns: Potentially destructive, requires explicit approval before running.
