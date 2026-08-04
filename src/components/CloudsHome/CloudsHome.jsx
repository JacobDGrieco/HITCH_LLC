import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cloud from './Cloud';
import { useSiteMusic } from '../audio/useSiteMusic';
import { useSiteChrome } from '../chrome/useSiteChrome';
import { loadEducationPageData, loadExperiencePageData, loadProjectsPageData, loadSkillsPageData } from '../../lib/pageDataCache';
import '../../styles/clouds-home.css';

const PAGE_CLOUDS = [
	{ id: 'projects', label: 'Projects', route: '/projects' },
	{ id: 'about', label: 'About', route: '/about' },
	{ id: 'skills', label: 'Skills', route: '/skills' },
	{ id: 'education', label: 'Education', route: '/education' },
	{ id: 'contact', label: 'Contact', route: '/contact' },
	{ id: 'experience', label: 'Experience', route: '/experience' },
];

const CLOUD_IMAGE_SOURCES = [
	{ src: '/home/cloud1.png', width: 537, height: 187 },
	{ src: '/home/cloud2.png', width: 537, height: 187 },
	{ src: '/home/cloud3.png', width: 537, height: 187 },
	{ src: '/home/cloud4.png', width: 537, height: 187 },
	{ src: '/home/cloud5.png', width: 537, height: 187 },
	{ src: '/home/cloud6.png', width: 537, height: 187 },
];

const RETURN_SECTION_STORAGE_KEY = 'cloudsHomeReturnSection';

const LOGO_SPARKLES = [
	{ left: 8, top: 36, size: 12, delay: -0.2, duration: 4.8 },
	{ left: 18, top: 18, size: 5, delay: -2.1, duration: 5.7 },
	{ left: 26, top: 9, size: 7, delay: -1.2, duration: 4.4 },
	{ left: 34, top: 78, size: 11, delay: -3.1, duration: 5.2 },
	{ left: 42, top: 54, size: 6, delay: -0.8, duration: 4.9 },
	{ left: 50, top: 6, size: 5, delay: -2.7, duration: 5.6 },
	{ left: 60, top: 62, size: 13, delay: -1.6, duration: 4.7 },
	{ left: 68, top: 18, size: 16, delay: -3.8, duration: 5.3 },
	{ left: 76, top: 44, size: 6, delay: -2.4, duration: 4.6 },
	{ left: 88, top: 24, size: 9, delay: -1.1, duration: 5.8 },
	{ left: 92, top: 74, size: 5, delay: -3.4, duration: 4.5 },
	{ left: 15, top: 86, size: 7, delay: -0.6, duration: 5.4 },
];

const STATIC_PAGE_IMAGE_SOURCES = [
	'/headshot.jpg',
	'/contact/resume.png',
	'/contact/linkedin.png',
	'/contact/github.png',
];

function preloadStaticPageImages() {
	if (typeof Image === 'undefined') return;

	STATIC_PAGE_IMAGE_SOURCES.forEach((src) => {
		const image = new Image();
		image.src = src;
	});
}

function scheduleBackgroundPreload(callback) {
	if ('requestIdleCallback' in window) {
		const idleId = window.requestIdleCallback(callback, { timeout: 5000 });
		return () => window.cancelIdleCallback(idleId);
	}

	const preloadTimer = window.setTimeout(callback, 2200);
	return () => window.clearTimeout(preloadTimer);
}

function shuffleCloudImages() {
	const images = [...CLOUD_IMAGE_SOURCES];

	for (let i = images.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[images[i], images[j]] = [images[j], images[i]];
	}

	return PAGE_CLOUDS.map((cloud, index) => ({
		...cloud,
		imageSrc: images[index].src,
		imageWidth: images[index].width,
		imageHeight: images[index].height,
	}));
}

function getViewport() {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

function clampScale(scale, min, max) {
	return Math.min(Math.max(scale, min), max);
}

function createCameraTransitionFromRect(rect) {
	const cloudCenterX = rect.left + rect.width / 2;
	const cloudCenterY = rect.top + rect.height / 2;
	const sceneZoomScale = window.innerWidth <= 640 ? 3.7 : 3.35;
	const midSceneZoomScale = 1 + ((sceneZoomScale - 1) * 0.72);

	return {
		shiftX: window.innerWidth / 2 - cloudCenterX * sceneZoomScale,
		shiftY: window.innerHeight / 2 - cloudCenterY * sceneZoomScale,
		midShiftX: window.innerWidth / 2 - cloudCenterX * midSceneZoomScale,
		midShiftY: window.innerHeight / 2 - cloudCenterY * midSceneZoomScale,
		midSceneZoomScale,
		sceneZoomScale,
	};
}

export default function CloudsHome() {
	const navigate = useNavigate();
	const { requestAutoplay } = useSiteMusic();
	const { setDasHidden } = useSiteChrome();
	const cloudRefs = useRef({});
	const isTransitioningRef = useRef(false);
	const [transitioning, setTransitioning] = useState(false);
	const [transitionCloud, setTransitionCloud] = useState(null);
	const [returnTransition, setReturnTransition] = useState(null);
	const [returningActive, setReturningActive] = useState(false);
	const [returnSection] = useState(() => window.sessionStorage.getItem(RETURN_SECTION_STORAGE_KEY));
	const [viewport, setViewport] = useState(getViewport);
	const pageClouds = useMemo(() => shuffleCloudImages(), []);

	useEffect(() => {
		function handleResize() {
			setViewport(getViewport());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		requestAutoplay();
	}, [requestAutoplay]);

	useEffect(() => {
		return scheduleBackgroundPreload(() => {
			if (isTransitioningRef.current) return;

			preloadStaticPageImages();
			void loadProjectsPageData()
				.then(() => loadSkillsPageData())
				.then(() => loadEducationPageData())
				.then(() => loadExperiencePageData());
		});
	}, []);

	useEffect(() => {
		setDasHidden(transitioning);

		return () => {
			setDasHidden(false);
		};
	}, [setDasHidden, transitioning]);

	useLayoutEffect(() => {
		if (!returnSection) return undefined;

		const returnCloud = cloudRefs.current[returnSection];
		if (!returnCloud) return undefined;

		window.sessionStorage.removeItem(RETURN_SECTION_STORAGE_KEY);
		setDasHidden(true);
		isTransitioningRef.current = true;
		setReturnTransition(createCameraTransitionFromRect(returnCloud.getBoundingClientRect()));

		let animationFrameId = window.requestAnimationFrame(() => {
			animationFrameId = window.requestAnimationFrame(() => {
				setReturningActive(true);
			});
		});

		const doneTimer = window.setTimeout(() => {
			setReturnTransition(null);
			setReturningActive(false);
			isTransitioningRef.current = false;
			setDasHidden(false);
		}, 1780);

		return () => {
			window.cancelAnimationFrame(animationFrameId);
			window.clearTimeout(doneTimer);
			setDasHidden(false);
		};
	}, [returnSection, setDasHidden]);

	const scaleVars = useMemo(() => {
		const sceneScale = Math.min(viewport.width / 1440, viewport.height / 900);
		const logoScale = clampScale(sceneScale, 0.50, 1.32);
		const cloudScale = clampScale(sceneScale, 0.48, 1.18) * 0.75;

		return {
			'--home-logo-width': `${860 * logoScale}px`,
			'--home-cloud-scale': cloudScale,
			'--home-cloud-gap': `${20 * cloudScale}px`,
			'--home-cloud-offset-odd': `${28 * cloudScale}px`,
			'--home-cloud-offset-even': `${154 * cloudScale}px`,
		};
	}, [viewport]);

	function handleCloudClick(cloud, e) {
		if (transitioning) return;
		isTransitioningRef.current = true;
		setTransitioning(true);

		const rect = e.currentTarget.getBoundingClientRect();
		e.currentTarget.blur();
		setTransitionCloud(createCameraTransitionFromRect(rect));

		setTimeout(() => navigate(cloud.route), 1780);
	}

	const activeCameraTransition = transitionCloud || returnTransition;
	const homeStyleVars = {
		...scaleVars,
		...(activeCameraTransition ? {
			'--home-zoom-mid-shift-x': `${activeCameraTransition.midShiftX}px`,
			'--home-zoom-mid-shift-y': `${activeCameraTransition.midShiftY}px`,
			'--home-zoom-shift-x': `${activeCameraTransition.shiftX}px`,
			'--home-zoom-shift-y': `${activeCameraTransition.shiftY}px`,
			'--home-scene-zoom-mid-scale': activeCameraTransition.midSceneZoomScale,
			'--home-scene-zoom-scale': activeCameraTransition.sceneZoomScale,
		} : null),
	};

	return (
		<div className={`clouds-home ${transitioning ? 'clouds-home--transitioning' : ''} ${returnTransition ? 'clouds-home--return-ready' : ''} ${returningActive ? 'clouds-home--returning' : ''}`} style={homeStyleVars}>
			<div className="clouds-home__camera">
				<div className="clouds-home__sky" />
				<div className="clouds-home__haze" />
				<div className="clouds-home__horizon" />

				<div className="clouds-home__stage">
					<div className="clouds-home__left-zone">
						<div className="clouds-home__logo-scene">
							<div className="clouds-home__logo-sparkles" aria-hidden="true">
								{LOGO_SPARKLES.map((sparkle, index) => (
									<span
										key={`${sparkle.left}-${sparkle.top}-${index}`}
										className="clouds-home__logo-sparkle"
										style={{
											'--sparkle-left': `${sparkle.left}%`,
											'--sparkle-top': `${sparkle.top}%`,
											'--sparkle-size': `${sparkle.size}px`,
											'--sparkle-delay': `${sparkle.delay}s`,
											'--sparkle-duration': `${sparkle.duration}s`,
										}}
									/>
								))}
							</div>
							<img src="/home/logo_full.png" alt="HeadInTheCloudsHaven" width="1024" height="1024" fetchPriority="high" className="clouds-home__logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
						</div>
					</div>

					<div className="clouds-home__right-zone">
						{pageClouds.map((cloud, index) => (
							<Cloud
								key={cloud.id}
								label={cloud.label}
								imageSrc={cloud.imageSrc}
								imageWidth={cloud.imageWidth}
								imageHeight={cloud.imageHeight}
								scale={scaleVars['--home-cloud-scale']}
								floatIndex={index}
								buttonRef={(node) => {
									cloudRefs.current[cloud.id] = node;
								}}
								onClick={(e) => handleCloudClick(cloud, e)}
							/>
						))}
					</div>
				</div>

				<div className="clouds-home__header">
					<div className="clouds-home__hint">Click to Explore</div>
				</div>
			</div>

			{(transitionCloud || returnTransition) && (
				<div className={`clouds-home__portal ${returnTransition ? 'clouds-home__portal--return' : ''}`} aria-hidden="true">
					<div className="clouds-home__portal-streaks" />
					<div className="clouds-home__portal-wash" />
				</div>
			)}
		</div>
	);
}
