// Exact mapping keeps database-managed image URLs stable while allowing known local assets to use optimized variants.
const OPTIMIZED_ASSET_PATHS = new Map([
	['/projects/asd.png', '/projects/asd.webp'],
	['/projects/halomed.png', '/projects/halomed.webp'],
	['/projects/ppgc.png', '/projects/ppgc.webp'],
	['/projects/relatime.png', '/projects/relatime.webp'],
	['/projects/uky.png', '/projects/uky.webp'],
]);

export function getOptimizedAssetPath(path) {
	return OPTIMIZED_ASSET_PATHS.get(path) ?? path;
}
