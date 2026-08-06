// Exact mapping keeps database-managed image URLs stable while allowing known local assets to use optimized variants.
const OPTIMIZED_ASSET_PATHS = new Map([
	['/projects/asd-icon.png', '/projects/asd-icon.webp'],
	['/projects/halomed-icon.png', '/projects/halomed-icon.webp'],
	['/projects/ppgc-icon.png', '/projects/ppgc-icon.webp'],
	['/projects/relatime-icon.png', '/projects/relatime-icon.webp'],
	['/projects/uky-icon.png', '/projects/uky-icon.webp'],
	['/projects/window1.png', '/projects/window1.webp'],
	['/projects/window2.png', '/projects/window2.webp'],
	['/projects/window3.png', '/projects/window3.webp'],
]);

export function getOptimizedAssetPath(path) {
	return OPTIMIZED_ASSET_PATHS.get(path) ?? path;
}
