CREATE TABLE IF NOT EXISTS music_track_metadata (
	pathname TEXT PRIMARY KEY,
	title TEXT,
	artist TEXT,
	license_label TEXT,
	license_url TEXT,
	copyright_line TEXT,
	art_pathname TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
