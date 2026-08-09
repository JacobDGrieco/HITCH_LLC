// Public playlist route that builds music metadata from SoundCloud rows or Vercel Blob assets.
import { list } from '@vercel/blob';
import { getMusicMetadataRows } from '../../lib/musicMetadataStore.js';

// These extension lists decide which Blob objects can become playable tracks or cover art.
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac']);
const ART_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const DEFAULT_ARTIST = 'Head In The Clouds Haven';

function hasAudioExtension(pathname) {
	return [...AUDIO_EXTENSIONS].some((extension) => pathname.toLowerCase().endsWith(extension));
}

function hasArtExtension(pathname) {
	return [...ART_EXTENSIONS].some((extension) => pathname.toLowerCase().endsWith(extension));
}

function isHttpUrl(value) {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

function isSoundCloudUrl(value) {
	if (!isHttpUrl(value)) return false;

	const { hostname } = new URL(value);
	return hostname === 'soundcloud.com' || hostname.endsWith('.soundcloud.com');
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

function formatSoundCloudTitle(soundCloudUrl) {
	const { pathname } = new URL(soundCloudUrl);
	const slug = pathname.split('/').filter(Boolean).pop() ?? '';

	return slug
		.split(/[-_]+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ') || 'SoundCloud Track';
}

function formatArtUrl(artPathname) {
	if (!artPathname) return null;
	if (isHttpUrl(artPathname)) return artPathname;

	return `/api/music/stream?pathname=${encodeURIComponent(artPathname)}`;
}

export default async function handler(request, response) {
	try {
		const metadataRows = await getMusicMetadataRows();
		const metadataByPath = Object.fromEntries(metadataRows.map((metadata) => [metadata.pathname, metadata]));
		const soundCloudMetadataRows = metadataRows.filter((metadata) => isSoundCloudUrl(metadata.pathname));
		const hasBlobToken = Boolean(globalThis.process?.env?.BLOB_READ_WRITE_TOKEN);
		const { blobs = [] } = hasBlobToken
			? await list({
				limit: 1000,
			})
			: {};

		const artByStem = new Map(
			blobs
				.filter((blob) => blob.pathname.startsWith('arts/') && hasArtExtension(blob.pathname))
				.map((blob) => [getStem(blob.pathname), blob.pathname]),
		);

		// SoundCloud rows are an operator-controlled switch that avoids needing MP3 files in Blob.
		const blobTracks = soundCloudMetadataRows.length
			? []
			: blobs
				.filter((blob) => blob.pathname.startsWith('music/') && hasAudioExtension(blob.pathname))
				.map((blob) => {
					const metadata = metadataByPath[blob.pathname] ?? {};
					const artPathname = metadata.artPathname ?? artByStem.get(getStem(blob.pathname)) ?? null;

					return {
						artUrl: formatArtUrl(artPathname),
						id: blob.pathname,
						title: metadata.title ?? formatTrackTitle(blob.pathname),
						artist: metadata.artist ?? DEFAULT_ARTIST,
						copyrightLine: metadata.copyrightLine ?? '',
						licenseLabel: metadata.licenseLabel ?? '',
						licenseUrl: metadata.licenseUrl ?? '',
						pathname: blob.pathname,
						sortOrder: inferSortOrder(blob.pathname),
						source: 'blob',
						streamUrl: `/api/music/stream?pathname=${encodeURIComponent(blob.pathname)}`,
					};
				});

		const soundCloudTracks = soundCloudMetadataRows
			.map((metadata, index) => ({
				artUrl: formatArtUrl(metadata.artPathname),
				id: metadata.pathname,
				title: metadata.title || formatSoundCloudTitle(metadata.pathname),
				artist: metadata.artist || 'SoundCloud',
				copyrightLine: metadata.copyrightLine || '',
				licenseLabel: metadata.licenseLabel || 'SoundCloud',
				licenseUrl: metadata.licenseUrl || metadata.pathname,
				pathname: metadata.pathname,
				sortOrder: inferSortOrder(metadata.pathname) + index,
				soundCloudUrl: metadata.pathname,
				source: 'soundcloud',
				streamUrl: metadata.pathname,
			}));

		const tracks = [...blobTracks, ...soundCloudTracks]
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
			soundCloudUrl: track.soundCloudUrl,
			source: track.source,
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
