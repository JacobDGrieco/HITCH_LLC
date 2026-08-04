import { useSiteMusic } from '../audio/useSiteMusic';
import { useSiteChrome } from './useSiteChrome';
import '../../styles/site-das.css';

export default function PersistentDas() {
	const {
		currentTrack,
		enableSound,
		hasTracks,
		isPlaying,
		playbackState,
		trackDisplay,
		togglePlayback,
	} = useSiteMusic();
	const { dasHidden } = useSiteChrome();

	if (playbackState === 'loading' || playbackState === 'error' || !hasTracks) {
		return null;
	}

	return (
		<div className={`site-das-shell${dasHidden ? ' site-das-shell--hidden' : ''}`}>
			{playbackState === 'blocked' ? (
				<button type="button" className="site-das__sound-on" onClick={enableSound}>
					<span className="site-das__sound-on-dot" aria-hidden="true" />
					<span className="site-das__sound-on-text">Sound On</span>
				</button>
			) : (
				<div className={`site-das${playbackState === 'playing' ? ' site-das--playing' : ''}`}>
					<button
						type="button"
						className="site-das__mute"
						onClick={togglePlayback}
						aria-label={isPlaying ? 'Pause music' : 'Play music'}
					>
						<span className="site-das__mute-icon" aria-hidden="true">
							{isPlaying ? (
								<>
									<span className="site-das__pause-bar" />
									<span className="site-das__pause-bar" />
								</>
							) : (
								<span className="site-das__play-triangle" />
							)}
						</span>
					</button>

					<div className="site-das__copy">
						<div className="site-das__title-group">
							<div className="site-das__context">A.S.D. radio</div>
							<div className="site-das__title">
								{trackDisplay || currentTrack?.title || 'Untitled Track'}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
