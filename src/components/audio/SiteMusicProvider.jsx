import { useCallback, useEffect, useRef, useState } from 'react';
import { SiteMusicContext } from './SiteMusicContext';

const SOUNDCLOUD_WIDGET_API_URL = 'https://w.soundcloud.com/player/api.js';
const SOUNDCLOUD_WIDGET_FRAME_STYLE = {
	position: 'fixed',
	left: '-9999px',
	bottom: 0,
	width: 1,
	height: 1,
	border: 0,
	opacity: 0,
	pointerEvents: 'none',
};
const DEFAULT_MUSIC_VOLUME = 0.6;
const SOUNDCLOUD_VOLUME_SCALE = 100;

let soundCloudWidgetApiPromise = null;

function isSoundCloudTrack(track) {
	return track?.source === 'soundcloud' || Boolean(track?.soundCloudUrl);
}

function getSoundCloudTrackUrl(track) {
	return track?.soundCloudUrl || track?.streamUrl || track?.pathname || '';
}

function getSoundCloudEmbedUrl(track) {
	const soundCloudUrl = getSoundCloudTrackUrl(track);
	const params = new URLSearchParams({
		auto_play: 'false',
		hide_related: 'true',
		show_comments: 'false',
		show_reposts: 'false',
		show_teaser: 'false',
		visual: 'false',
		url: soundCloudUrl,
	});

	return `https://w.soundcloud.com/player/?${params.toString()}`;
}

function loadSoundCloudWidgetApi() {
	if (typeof window === 'undefined') {
		return Promise.reject(new Error('SoundCloud playback is unavailable outside the browser.'));
	}

	if (window.SC?.Widget) {
		return Promise.resolve(window.SC);
	}

	if (!soundCloudWidgetApiPromise) {
		soundCloudWidgetApiPromise = new Promise((resolve, reject) => {
			const existingScript = document.querySelector(`script[src="${SOUNDCLOUD_WIDGET_API_URL}"]`);

			function handleLoad() {
				if (window.SC?.Widget) {
					resolve(window.SC);
				} else {
					reject(new Error('SoundCloud widget API did not initialize.'));
				}
			}

			if (existingScript) {
				existingScript.addEventListener('load', handleLoad, { once: true });
				existingScript.addEventListener('error', () => reject(new Error('Unable to load SoundCloud widget API.')), { once: true });
				return;
			}

			const script = document.createElement('script');
			script.src = SOUNDCLOUD_WIDGET_API_URL;
			script.async = true;
			script.addEventListener('load', handleLoad, { once: true });
			script.addEventListener('error', () => reject(new Error('Unable to load SoundCloud widget API.')), { once: true });
			document.head.appendChild(script);
		});
	}

	return soundCloudWidgetApiPromise;
}

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

function scheduleIdleTask(callback) {
	if (typeof window === 'undefined') return () => {};

	if ('requestIdleCallback' in window) {
		const idleId = window.requestIdleCallback(callback, { timeout: 5000 });
		return () => window.cancelIdleCallback(idleId);
	}

	const timerId = window.setTimeout(callback, 2500);
	return () => window.clearTimeout(timerId);
}

export function SiteMusicProvider({ children }) {
	const audioRef = useRef(null);
	const playbackRequestedRef = useRef(false);
	const playlistRef = useRef([]);
	const currentIndexRef = useRef(0);
	const soundCloudFrameRef = useRef(null);
	const soundCloudWidgetRef = useRef(null);
	const soundCloudReadyRef = useRef(false);
	const soundCloudTrackUrlRef = useRef('');
	const soundCloudLoadIdRef = useRef(0);
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

		const cancelScheduledLoad = scheduleIdleTask(loadPlaylist);

		return () => {
			cancelled = true;
			cancelScheduledLoad();
		};
	}, []);

	useEffect(() => {
		if (!playlist.length) {
			audioRef.current?.pause();
			audioRef.current = null;
			return undefined;
		}

		const audio = new Audio();
		audio.preload = 'none';
		audio.volume = DEFAULT_MUSIC_VOLUME;
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

	const pauseSoundCloudWidget = useCallback(() => {
		try {
			soundCloudWidgetRef.current?.pause();
		} catch {
			// Widget calls are postMessage based and can fail while SoundCloud is changing tracks.
		}
	}, []);

	const bindSoundCloudWidget = useCallback((widget, loadId, resolve, reject) => {
		const events = window.SC.Widget.Events;

		widget.unbind(events.READY);
		widget.unbind(events.PLAY);
		widget.unbind(events.PAUSE);
		widget.unbind(events.FINISH);
		widget.unbind(events.ERROR);

		widget.bind(events.READY, () => {
			if (loadId !== soundCloudLoadIdRef.current) return;

			soundCloudReadyRef.current = true;
			widget.setVolume(DEFAULT_MUSIC_VOLUME * SOUNDCLOUD_VOLUME_SCALE);
			resolve(widget);
		});

		widget.bind(events.PLAY, () => {
			if (loadId !== soundCloudLoadIdRef.current) return;

			setPlaybackState('playing');
			setErrorMessage('');
		});

		widget.bind(events.PAUSE, () => {
			if (loadId !== soundCloudLoadIdRef.current || !playbackRequestedRef.current) return;

			setPlaybackState('paused');
		});

		widget.bind(events.FINISH, () => {
			if (loadId !== soundCloudLoadIdRef.current) return;

			setCurrentIndex((index) => (index + 1) % playlistRef.current.length);
		});

		widget.bind(events.ERROR, () => {
			if (loadId !== soundCloudLoadIdRef.current) return;

			const error = new Error('SoundCloud playback failed for the current track.');
			setPlaybackState('error');
			setErrorMessage(error.message);
			reject(error);
		});
	}, []);

	const prepareSoundCloudWidget = useCallback(async (track) => {
		const iframe = soundCloudFrameRef.current;
		const trackUrl = getSoundCloudTrackUrl(track);

		if (!iframe || !trackUrl) {
			throw new Error('SoundCloud track is missing a playable URL.');
		}

		const soundCloudApi = await loadSoundCloudWidgetApi();
		const embedUrl = getSoundCloudEmbedUrl(track);

		if (soundCloudTrackUrlRef.current !== trackUrl) {
			soundCloudReadyRef.current = false;
			soundCloudTrackUrlRef.current = trackUrl;
			soundCloudLoadIdRef.current += 1;
			iframe.src = embedUrl;
		}

		const loadId = soundCloudLoadIdRef.current;
		const widget = soundCloudApi.Widget(iframe);
		soundCloudWidgetRef.current = widget;

		if (soundCloudReadyRef.current) {
			return widget;
		}

		return new Promise((resolve, reject) => {
			bindSoundCloudWidget(widget, loadId, resolve, reject);
		});
	}, [bindSoundCloudWidget]);

	const startPlayback = useCallback(async ({ userInitiated = false } = {}) => {
		const audio = audioRef.current;
		const track = playlistRef.current[currentIndexRef.current];

		if (!track) {
			return false;
		}

		playbackRequestedRef.current = true;

		if (isSoundCloudTrack(track)) {
			audio?.pause();

			try {
				const widget = await prepareSoundCloudWidget(track);
				widget.play();
				return true;
			} catch (error) {
				if (userInitiated) {
					setPlaybackState('error');
					setErrorMessage(error instanceof Error ? error.message : 'Unable to start SoundCloud playback');
				} else {
					setPlaybackState('blocked');
				}

				return false;
			}
		}

		if (!audio) {
			return false;
		}

		pauseSoundCloudWidget();

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
	}, [pauseSoundCloudWidget, prepareSoundCloudWidget]);

	useEffect(() => {
		const track = playlist[currentIndex];
		const audio = audioRef.current;

		if (!track) {
			return;
		}

		if (isSoundCloudTrack(track)) {
			audio?.pause();

			if (playbackRequestedRef.current && playbackState !== 'paused') {
				void startPlayback();
			}

			return;
		}

		pauseSoundCloudWidget();

		if (!audio) {
			return;
		}

		if (playbackRequestedRef.current && playbackState !== 'paused') {
			void startPlayback();
		}
	}, [currentIndex, pauseSoundCloudWidget, playbackState, playlist, startPlayback]);

	useEffect(() => () => {
		const widget = soundCloudWidgetRef.current;
		const events = window.SC?.Widget?.Events;

		if (!widget || !events) return;

		widget.unbind(events.READY);
		widget.unbind(events.PLAY);
		widget.unbind(events.PAUSE);
		widget.unbind(events.FINISH);
		widget.unbind(events.ERROR);
		pauseSoundCloudWidget();
	}, [pauseSoundCloudWidget]);

	function enableSound() {
		void startPlayback({ userInitiated: true });
	}

	async function togglePlayback() {
		const track = playlistRef.current[currentIndexRef.current];

		if (isSoundCloudTrack(track)) {
			if (playbackState === 'playing') {
				pauseSoundCloudWidget();
				return;
			}

			await startPlayback({ userInitiated: true });
			return;
		}

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
				togglePlayback,
				trackDisplay,
			}}
		>
			{children}
			<iframe
				ref={soundCloudFrameRef}
				allow="autoplay"
				aria-hidden="true"
				style={SOUNDCLOUD_WIDGET_FRAME_STYLE}
				tabIndex={-1}
				title="SoundCloud music player"
			/>
		</SiteMusicContext.Provider>
	);
}
