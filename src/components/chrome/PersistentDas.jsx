import { useSiteMusic } from '../audio/useSiteMusic';
import { useSiteChrome } from './useSiteChrome';
import '../../styles/site-das.css';

export default function PersistentDas() {
	const {
		currentArtUrl,
		currentTrack,
		copyrightLine,
		enableSound,
		hasTracks,
		isPlaying,
		licenseLabel,
		licenseUrl,
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

					<div className="site-das__art" aria-hidden="true">
						{currentArtUrl ? (
							<img src={currentArtUrl} alt="" className="site-das__art-image" />
						) : (
							<div className="site-das__art-fallback" />
						)}
					</div>

					<div className="site-das__copy">
						<div className="site-das__title-group">
							<div className="site-das__title">
								{trackDisplay || currentTrack?.title || 'Untitled Track'}
							</div>
							{copyrightLine || licenseLabel ? (
								<div className="site-das__license">
									{copyrightLine ? <span>{copyrightLine}</span> : null}
									{licenseLabel && licenseUrl ? (
										<a
											className="site-das__license-link"
											href={licenseUrl}
											target="_blank"
											rel="noreferrer"
										>
											{licenseLabel}
										</a>
									) : licenseLabel ? (
										<span>{licenseLabel}</span>
									) : null}
								</div>
							) : null}
						</div>
					</div>

					<div className="site-das__side">
						<div className="site-das__bars" aria-hidden="true">
							<div className="site-das__bar" />
							<div className="site-das__bar" />
							<div className="site-das__bar" />
							<div className="site-das__bar" />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
