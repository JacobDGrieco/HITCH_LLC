import { list } from '@vercel/blob';
import { getMusicMetadataByPath } from '../../lib/musicMetadataStore.js';

const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac']);
const ART_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const DEFAULT_ARTIST = 'Head In The Clouds Haven';

function hasAudioExtension(pathname) {
	return [...AUDIO_EXTENSIONS].some((extension) => pathname.toLowerCase().endsWith(extension));
}

function hasArtExtension(pathname) {
	return [...ART_EXTENSIONS].some((extension) => pathname.toLowerCase().endsWith(extension));
}

function getStem(pathname) {
	const filename = pathname.split('/').pop() ?? pathname;
	return filename.replace(/\.[^.]+$/, '').toLowerCase();
}

function inferSortOrder(pathname) {
	const filename = pathname.split('/').pop() ?? pathname;
	const match = filename.match(/^(\d+)/);

	return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function formatTrackTitle(pathname) {
	const filename = pathname.split('/').pop() ?? pathname;
	const stem = filename.replace(/\.[^.]+$/, '').replace(/^[\d\-_ ]+/, '');

	return stem
		.split(/[-_]+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ') || 'Untitled Track';
}

export default async function handler(request, response) {
	if (!globalThis.process?.env?.BLOB_READ_WRITE_TOKEN) {
		return response.status(500).json({ error: 'Missing BLOB_READ_WRITE_TOKEN' });
	}

	try {
		const metadataByPath = await getMusicMetadataByPath();
		const { blobs } = await list({
			limit: 1000,
		});

		const artByStem = new Map(
			blobs
				.filter((blob) => blob.pathname.startsWith('arts/') && hasArtExtension(blob.pathname))
				.map((blob) => [getStem(blob.pathname), blob.pathname]),
		);

		const tracks = blobs
			.filter((blob) => blob.pathname.startsWith('music/') && hasAudioExtension(blob.pathname))
			.map((blob) => {
				const metadata = metadataByPath[blob.pathname] ?? {};
				const artPathname = metadata.artPathname ?? artByStem.get(getStem(blob.pathname)) ?? null;

				return {
					artUrl: artPathname ? `/api/music/stream?pathname=${encodeURIComponent(artPathname)}` : null,
					id: blob.pathname,
					title: metadata.title ?? formatTrackTitle(blob.pathname),
					artist: metadata.artist ?? DEFAULT_ARTIST,
					copyrightLine: metadata.copyrightLine ?? '',
					licenseLabel: metadata.licenseLabel ?? '',
					licenseUrl: metadata.licenseUrl ?? '',
					pathname: blob.pathname,
					streamUrl: `/api/music/stream?pathname=${encodeURIComponent(blob.pathname)}`,
				};
			})
			.sort((a, b) => {
				if (a.sortOrder !== b.sortOrder) {
					return a.sortOrder - b.sortOrder;
				}

				return a.pathname.localeCompare(b.pathname);
			});

		const responseTracks = tracks.map((track) => ({
			artUrl: track.artUrl,
			copyrightLine: track.copyrightLine,
			id: track.id,
			title: track.title,
			artist: track.artist,
			licenseLabel: track.licenseLabel,
			licenseUrl: track.licenseUrl,
			pathname: track.pathname,
			streamUrl: track.streamUrl,
		}));

		response.setHeader('Cache-Control', 'no-store');
		return response.status(200).json({ tracks: responseTracks });
	} catch (error) {
		return response.status(500).json({
			error: error instanceof Error ? error.message : 'Unable to load playlist',
		});
	}
}
