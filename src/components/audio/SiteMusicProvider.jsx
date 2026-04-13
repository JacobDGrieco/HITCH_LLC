import { useCallback, useEffect, useRef, useState } from 'react';
import { SiteMusicContext } from './SiteMusicContext';

function getTrackUrl(track) {
	if (typeof window === 'undefined' || !track?.streamUrl) {
		return '';
	}

	return new URL(track.streamUrl, window.location.origin).toString();
}

function getArtUrl(track) {
	if (typeof window === 'undefined' || !track?.artUrl) {
		return '';
	}

	return new URL(track.artUrl, window.location.origin).toString();
}

function shuffleTracks(tracks) {
	const nextTracks = [...tracks];

	for (let index = nextTracks.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[nextTracks[index], nextTracks[swapIndex]] = [nextTracks[swapIndex], nextTracks[index]];
	}

	return nextTracks;
}

export function SiteMusicProvider({ children }) {
	const audioRef = useRef(null);
	const playbackRequestedRef = useRef(false);
	const playlistRef = useRef([]);
	const currentIndexRef = useRef(0);
	const [playlist, setPlaylist] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [playbackState, setPlaybackState] = useState('loading');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		playlistRef.current = playlist;
	}, [playlist]);

	useEffect(() => {
		currentIndexRef.current = currentIndex;
	}, [currentIndex]);

	useEffect(() => {
		let cancelled = false;

		async function loadPlaylist() {
			try {
				const response = await fetch('/api/music/playlist', {
					headers: {
						Accept: 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error(`Playlist request failed with status ${response.status}`);
				}

				const data = await response.json();

				if (cancelled) {
					return;
				}

				const nextPlaylist = Array.isArray(data.tracks) ? shuffleTracks(data.tracks) : [];
				setPlaylist(nextPlaylist);
				setCurrentIndex(0);
				setPlaybackState(nextPlaylist.length ? 'ready' : 'empty');
				setErrorMessage('');
			} catch (error) {
				if (cancelled) {
					return;
				}

				setPlaylist([]);
				setCurrentIndex(0);
				setPlaybackState('error');
				setErrorMessage(error instanceof Error ? error.message : 'Unable to load music');
			}
		}

		loadPlaylist();

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!playlist.length) {
			audioRef.current?.pause();
			audioRef.current = null;
			return undefined;
		}

		const audio = new Audio();
		audio.preload = 'auto';
		audio.volume = 0.4;
		audioRef.current = audio;

		function handleEnded() {
			setCurrentIndex((index) => (index + 1) % playlist.length);
		}

		function handlePlaying() {
			setPlaybackState('playing');
			setErrorMessage('');
		}

		function handlePause() {
			if (!audio.ended && playbackRequestedRef.current) {
				setPlaybackState('paused');
			}
		}

		function handleError() {
			setPlaybackState('error');
			setErrorMessage('Playback failed for the current track.');
		}

		audio.addEventListener('ended', handleEnded);
		audio.addEventListener('playing', handlePlaying);
		audio.addEventListener('pause', handlePause);
		audio.addEventListener('error', handleError);

		return () => {
			audio.removeEventListener('ended', handleEnded);
			audio.removeEventListener('playing', handlePlaying);
			audio.removeEventListener('pause', handlePause);
			audio.removeEventListener('error', handleError);
			audio.pause();
			audio.src = '';
			audioRef.current = null;
		};
	}, [playlist.length]);

	const startPlayback = useCallback(async ({ userInitiated = false } = {}) => {
		const audio = audioRef.current;
		const track = playlistRef.current[currentIndexRef.current];

		if (!audio || !track) {
			return false;
		}

		playbackRequestedRef.current = true;

		const nextUrl = getTrackUrl(track);
		if (nextUrl && audio.src !== nextUrl) {
			audio.src = nextUrl;
			audio.load();
		}

		try {
			await audio.play();
			setPlaybackState('playing');
			setErrorMessage('');
			return true;
		} catch (error) {
			if (userInitiated) {
				setPlaybackState('error');
				setErrorMessage(error instanceof Error ? error.message : 'Unable to start audio');
			} else {
				setPlaybackState('blocked');
			}

			return false;
		}
	}, []);

	useEffect(() => {
		const track = playlist[currentIndex];
		const audio = audioRef.current;

		if (!track || !audio) {
			return;
		}

		const nextUrl = getTrackUrl(track);
		if (nextUrl && audio.src !== nextUrl) {
			audio.src = nextUrl;
			audio.load();
		}

		if (playbackRequestedRef.current && playbackState !== 'paused') {
			void startPlayback();
		}
	}, [currentIndex, playbackState, playlist, startPlayback]);

	function requestAutoplay() {
		if (playbackRequestedRef.current) {
			return;
		}

		playbackRequestedRef.current = true;
		void startPlayback();
	}

	function enableSound() {
		void startPlayback({ userInitiated: true });
	}

	async function togglePlayback() {
		const audio = audioRef.current;

		if (!audio) {
			return;
		}

		if (playbackState === 'playing') {
			audio.pause();
			return;
		}

		await startPlayback({ userInitiated: true });
	}

	const currentTrack = playlist[currentIndex] ?? null;
	const trackDisplay = currentTrack
		? [currentTrack.title, currentTrack.artist].filter(Boolean).join(' - ')
		: '';
	const currentArtUrl = currentTrack ? getArtUrl(currentTrack) : '';
	const licenseLabel = currentTrack?.licenseLabel || '';
	const licenseUrl = currentTrack?.licenseUrl || '';
	const copyrightLine = currentTrack?.copyrightLine || '';

	return (
		<SiteMusicContext.Provider
			value={{
				copyrightLine,
				currentArtUrl,
				currentTrack,
				enableSound,
				errorMessage,
				hasTracks: playlist.length > 0,
				isPlaying: playbackState === 'playing',
				licenseLabel,
				licenseUrl,
				playbackState,
				requestAutoplay,
				togglePlayback,
				trackDisplay,
			}}
		>
			{children}
		</SiteMusicContext.Provider>
	);
}
