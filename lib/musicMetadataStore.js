// Reads music track metadata from Neon/Postgres for the playlist API.
import { neon } from '@neondatabase/serverless';

// Keep the legacy table first so old deployments still serve metadata until cleanup is complete.
const MUSIC_METADATA_TABLES = ['metadata', 'music_track_metadata'];
const SELECT_METADATA_COLUMNS = `
	SELECT
		pathname,
		title,
		artist,
		license_label,
		license_url,
		copyright_line,
		art_pathname
`;

function getDatabaseUrl() {
	const env = globalThis.process?.env ?? {};
	return env.DATABASE_URL || env.POSTGRES_URL || '';
}

function normalizeText(value) {
	return typeof value === 'string' ? value.trim() : '';
}

export async function getMusicMetadataByPath() {
	const rows = await getMusicMetadataRows();

	return Object.fromEntries(
		rows
			.map((row) => [
				row.pathname,
				{
					title: row.title,
					artist: row.artist,
					licenseLabel: row.licenseLabel,
					licenseUrl: row.licenseUrl,
					copyrightLine: row.copyrightLine,
					artPathname: row.artPathname,
				},
			])
			.filter(([pathname]) => pathname),
	);
}

export async function getMusicMetadataRows() {
	const databaseUrl = getDatabaseUrl();

	if (!databaseUrl) {
		return [];
	}

	const sql = neon(databaseUrl);
	const rowsByPath = new Map();

	for (const tableName of MUSIC_METADATA_TABLES) {
		try {
			const rows = await sql.query(`${SELECT_METADATA_COLUMNS} FROM ${tableName}`);

			for (const row of rows) {
				const pathname = normalizeText(row.pathname);
				if (!pathname || rowsByPath.has(pathname)) continue;

				rowsByPath.set(pathname, {
					pathname,
					title: normalizeText(row.title),
					artist: normalizeText(row.artist),
					licenseLabel: normalizeText(row.license_label),
					licenseUrl: normalizeText(row.license_url),
					copyrightLine: normalizeText(row.copyright_line),
					artPathname: normalizeText(row.art_pathname),
				});
			}
		} catch (error) {
			// Allow the site to keep serving inferred metadata until either supported metadata table exists.
			if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
				continue;
			}

			throw error;
		}
	}

	return [...rowsByPath.values()];
}
