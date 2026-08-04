import { getDb } from '../../lib/db.js';

const sql = getDb();

await sql`
  CREATE TABLE IF NOT EXISTS projects (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    "desc"      TEXT,
    tags         TEXT[],
    icon_image   TEXT,
    link_url     TEXT,
    color_hex    TEXT,
    size         NUMERIC(8, 2) DEFAULT 1,
    display_order INTEGER DEFAULT 0
  )
`;

await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS link_url TEXT`;
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS color_hex TEXT`;
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS size NUMERIC(8, 2) DEFAULT 1`;
await sql`ALTER TABLE projects ALTER COLUMN size TYPE NUMERIC(8, 2) USING size::numeric`;
await sql`ALTER TABLE projects ALTER COLUMN size SET DEFAULT 1`;

await sql`
  CREATE TABLE IF NOT EXISTS skills (
    id            SERIAL PRIMARY KEY,
    title         TEXT,
    percentage    INTEGER,
    skill_group   TEXT,
    display_order INTEGER DEFAULT 0
  )
`;

await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS title TEXT`;
await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS percentage INTEGER`;
await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS skill_group TEXT`;

await sql`
  CREATE TABLE IF NOT EXISTS experience (
    id            SERIAL PRIMARY KEY,
    title         TEXT NOT NULL,
    role          TEXT,
    date_range    TEXT,
    "desc"       TEXT,
    tags          TEXT[],
    icon_image    TEXT,
    color_hex     TEXT,
    size          NUMERIC(8, 2) DEFAULT 1,
    display_order INTEGER DEFAULT 0
  )
`;

await sql`ALTER TABLE experience ADD COLUMN IF NOT EXISTS color_hex TEXT`;
await sql`ALTER TABLE experience ADD COLUMN IF NOT EXISTS size NUMERIC(8, 2) DEFAULT 1`;
await sql`ALTER TABLE experience ALTER COLUMN size TYPE NUMERIC(8, 2) USING size::numeric`;
await sql`ALTER TABLE experience ALTER COLUMN size SET DEFAULT 1`;

await sql`
  CREATE TABLE IF NOT EXISTS education_items (
    id            SERIAL PRIMARY KEY,
    title         TEXT NOT NULL,
    "desc"       TEXT,
    color_hex     TEXT,
    icon_image    TEXT,
    size          NUMERIC(8, 2) DEFAULT 1,
    display_order INTEGER DEFAULT 0
  )
`;

await sql`ALTER TABLE education_items ADD COLUMN IF NOT EXISTS color_hex TEXT`;
await sql`ALTER TABLE education_items ADD COLUMN IF NOT EXISTS size NUMERIC(8, 2) DEFAULT 1`;
await sql`ALTER TABLE education_items ALTER COLUMN size TYPE NUMERIC(8, 2) USING size::numeric`;
await sql`ALTER TABLE education_items ALTER COLUMN size SET DEFAULT 1`;

await sql`
  UPDATE projects
  SET size = 1
  WHERE size IS NULL OR size = 220
`;

await sql`
  UPDATE experience
  SET size = 1
  WHERE size IS NULL OR size = 220
`;

await sql`
  UPDATE education_items
  SET size = 1
  WHERE size IS NULL OR size = 220
`;

console.log('All tables created.');
