import { neon } from '@neondatabase/serverless';

const SELECT_METADATA_SQL = `
	SELECT
		pathname,
		title,
		artist,
		license_label,
		license_url,
		copyright_line,
		art_pathname
	FROM metadata
`;

function getDatabaseUrl() {
	const env = globalThis.process?.env ?? {};
	return env.DATABASE_URL || env.POSTGRES_URL || '';
}

function normalizeText(value) {
	return typeof value === 'string' ? value.trim() : '';
}

export async function getMusicMetadataByPath() {
	const databaseUrl = getDatabaseUrl();

	if (!databaseUrl) {
		return {};
	}

	const sql = neon(databaseUrl);

	try {
		const rows = await sql.query(SELECT_METADATA_SQL);

		return Object.fromEntries(
			rows
				.map((row) => [
					normalizeText(row.pathname),
					{
						title: normalizeText(row.title),
						artist: normalizeText(row.artist),
						licenseLabel: normalizeText(row.license_label),
						licenseUrl: normalizeText(row.license_url),
						copyrightLine: normalizeText(row.copyright_line),
						artPathname: normalizeText(row.art_pathname),
					},
				])
				.filter(([pathname]) => pathname),
		);
	} catch (error) {
		// Allow the site to keep serving inferred metadata until the table exists.
		if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
			return {};
		}

		throw error;
	}
}
