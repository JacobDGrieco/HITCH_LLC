export const MUSIC_METADATA_TABLE = [
	// Fill one row per track you want to override.
	// Example:
	// {
	// 	pathname: 'music/01 E85.mp3',
	// 	title: 'E85',
	// 	artist: 'Artist Name',
	// 	sortOrder: 1,
	// 	licenseLabel: 'CC BY 4.0',
	// 	licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
	// 	copyrightLine: 'Music by Artist Name',
	// 	artPathname: 'arts/01 E85.jpg',
	// },
];

export const MUSIC_METADATA_BY_PATH = Object.fromEntries(
	MUSIC_METADATA_TABLE.map((row) => [row.pathname, row]),
);
