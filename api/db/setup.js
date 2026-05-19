import { getDb } from '../../lib/db.js';

const sql = getDb();

await sql`
  CREATE TABLE IF NOT EXISTS projects (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    desc         TEXT,
    tags         TEXT[],
    icon_image   TEXT,
    github_url   TEXT,
    live_url     TEXT,
    gem_color    TEXT,
    size         INTEGER DEFAULT 220,
    featured     BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS skills (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    category      TEXT NOT NULL,
    level         INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS experience (
    id            SERIAL PRIMARY KEY,
    title         TEXT NOT NULL,
    role          TEXT,
    date_range    TEXT,
    desc          TEXT,
    tags          TEXT[],
    icon_image    TEXT,
    gem_color     TEXT,
    size          INTEGER DEFAULT 220,
    featured      BOOLEAN DEFAULT FALSE,
    class_name    TEXT,
    display_order INTEGER DEFAULT 0
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS education_items (
    id            SERIAL PRIMARY KEY,
    title         TEXT NOT NULL,
    desc          TEXT,
    gem_color     TEXT,
    icon_image    TEXT,
    size          INTEGER DEFAULT 220,
    featured      BOOLEAN DEFAULT FALSE,
    class_name    TEXT,
    display_order INTEGER DEFAULT 0
  )
`;

console.log('All tables created.');
