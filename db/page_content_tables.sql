-- Page content schema contract.
-- This matches the official page-content tables used by the application.

ALTER TABLE IF EXISTS projects
	ADD COLUMN IF NOT EXISTS link_url TEXT,
	ADD COLUMN IF NOT EXISTS color_hex TEXT,
	ADD COLUMN IF NOT EXISTS size NUMERIC(8, 2) DEFAULT 1;

ALTER TABLE IF EXISTS projects
	ALTER COLUMN size TYPE NUMERIC(8, 2) USING size::numeric,
	ALTER COLUMN size SET DEFAULT 1;

ALTER TABLE IF EXISTS skills
	ADD COLUMN IF NOT EXISTS title TEXT,
	ADD COLUMN IF NOT EXISTS percentage INTEGER,
	ADD COLUMN IF NOT EXISTS skill_group TEXT;

ALTER TABLE IF EXISTS education_items
	ADD COLUMN IF NOT EXISTS color_hex TEXT,
	ADD COLUMN IF NOT EXISTS size NUMERIC(8, 2) DEFAULT 1;

ALTER TABLE IF EXISTS education_items
	ALTER COLUMN size TYPE NUMERIC(8, 2) USING size::numeric,
	ALTER COLUMN size SET DEFAULT 1;

ALTER TABLE IF EXISTS experience
	ADD COLUMN IF NOT EXISTS color_hex TEXT,
	ADD COLUMN IF NOT EXISTS size NUMERIC(8, 2) DEFAULT 1;

ALTER TABLE IF EXISTS experience
	ALTER COLUMN size TYPE NUMERIC(8, 2) USING size::numeric,
	ALTER COLUMN size SET DEFAULT 1;

UPDATE projects
SET size = 1
WHERE size IS NULL OR size = 220;

UPDATE education_items
SET size = 1
WHERE size IS NULL OR size = 220;

UPDATE experience
SET size = 1
WHERE size IS NULL OR size = 220;

-- Optional local cleanup after verifying old-column data has been migrated.
ALTER TABLE IF EXISTS projects
	DROP COLUMN IF EXISTS github_url,
	DROP COLUMN IF EXISTS live_url,
	DROP COLUMN IF EXISTS gem_color,
	DROP COLUMN IF EXISTS featured;

ALTER TABLE IF EXISTS skills
	DROP COLUMN IF EXISTS name,
	DROP COLUMN IF EXISTS category,
	DROP COLUMN IF EXISTS level;

ALTER TABLE IF EXISTS education_items
	DROP COLUMN IF EXISTS gem_color,
	DROP COLUMN IF EXISTS featured,
	DROP COLUMN IF EXISTS class_name;

ALTER TABLE IF EXISTS experience
	DROP COLUMN IF EXISTS gem_color,
	DROP COLUMN IF EXISTS featured,
	DROP COLUMN IF EXISTS class_name;
