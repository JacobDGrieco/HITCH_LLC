import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { GraduationCap, UserRound, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionNav from '../SectionNav';
import { loadEducationPageData, loadExperiencePageData, loadProjectsPageData, loadSkillsPageData } from '../../lib/pageDataCache';
import '../../styles/clouds-home.css';

const CloudPortalStage = lazy(() => import('./CloudPortalStage'));

const FLOATING_NAV_ITEMS = [
	{
		id: 'about',
		label: 'About',
		route: '/about',
		className: 'home-route-button--about',
		cloudImage: '/assets/route1.webp',
		icon: 'person',
	},
	{
		id: 'experience',
		label: 'Experience',
		route: '/experience',
		className: 'home-route-button--contact',
		cloudImage: '/assets/route2.webp',
		icon: 'tool',
	},
	{
		id: 'education',
		label: 'Education',
		route: '/education',
		className: 'home-route-button--skills',
		cloudImage: '/assets/route3.webp',
		icon: 'graduation',
	},
];

const ROUTE_ICONS = {
	person: UserRound,
	tool: Wrench,
	graduation: GraduationCap,
};

const PROJECT_PORTALS = [
	{
		id: 'asd',
		title: 'A.S.D.',
		previewImage: '/projects/window1.webp',
		liveUrl: 'https://www.asdrecords.net/',
		route: '/projects',
		className: 'project-portal--asd',
	},
	{
		id: 'halomed',
		title: 'HaloMed',
		previewImage: '/projects/window2.webp',
		liveUrl: 'https://www.halomed.org/',
		route: '/projects',
		className: 'project-portal--halomed',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		previewImage: '/projects/window3.webp',
		liveUrl: 'https://www.relatime.org/',
		route: '/projects',
		className: 'project-portal--relatime',
	},
];

const LOGO_SPARKLES = [
	{ left: 9, top: 30, size: 7, delay: -0.4, duration: 4.8 },
	{ left: 16, top: 68, size: 11, delay: -2.1, duration: 5.4 },
	{ left: 28, top: 18, size: 6, delay: -1.2, duration: 4.5 },
	{ left: 39, top: 78, size: 13, delay: -3.1, duration: 5.2 },
	{ left: 51, top: 8, size: 5, delay: -0.8, duration: 4.9 },
	{ left: 63, top: 58, size: 12, delay: -2.7, duration: 5.6 },
	{ left: 74, top: 22, size: 15, delay: -1.6, duration: 4.7 },
	{ left: 86, top: 64, size: 6, delay: -3.8, duration: 5.3 },
];

const MOBILE_HOME_CANVAS = {
	width: 820,
	height: 1180,
	brandTop: 104,
	brandInset: 49,
	brandHeight: 661,
	logoTop: 38,
	logoWidth: 590,
	copyTop: 389,
	copyWidth: 640,
	copyGap: 16,
	headlineSize: 43,
	introSize: 20,
	actionMinWidth: 214,
	actionMinHeight: 46,
	actionFontSize: 16,
	buttonCloudWidth: 31,
	buttonCloudHeight: 21,
	portalBottom: 90,
	portalHeight: 284,
	portalCardWidth: 414,
	portalGap: 4,
	portalPadTop: 18,
	portalPadBottom: 20,
	portalTitleBottom: 40,
	portalTitleSize: 18,
	portalMediaMargin: 8,
	portalRadius: 16,
};

const LANDSCAPE_HOME_CANVAS = {
	width: 850,
	height: 400,
	brandTop: 48,
	brandBottom: 50,
	brandWidth: 553,
	logoTop: 190,
	logoLeft: 153,
	logoWidth: 264,
	copyTop: 160,
	copyLeft: 400,
	copyWidth: 264,
	copyGap: 9,
	headlineSize: 18.4,
	introSize: 9,
	actionMinWidth: 170,
	actionMinHeight: 31,
	actionFontSize: 8.8,
	buttonCloudWidth: 22,
	buttonCloudHeight: 15,
	portalTop: 200,
	portalRight: 20,
	portalWidth: 306,
	portalHeight: 276,
	carouselGap: 7,
	windowRadius: 14,
	windowInset: 6,
	titleBottom: 17,
	titleSize: 13.6,
	dotSize: 10,
	dotGap: 8,
};

const STATIC_PAGE_IMAGE_SOURCES = [
	'/headshot.webp',
	'/contact/resume.png',
	'/contact/linkedin.png',
	'/contact/github.png',
	'/assets/logo-cloud.webp',
	'/assets/logo-wordmark.webp',
	'/assets/cta-cloud.webp',
	...FLOATING_NAV_ITEMS.map((item) => item.cloudImage),
	...PROJECT_PORTALS.map((project) => project.previewImage),
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

function getViewport() {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

function clampScale(scale, min, max) {
	return Math.min(Math.max(scale, min), max);
}

function toPixelValue(value) {
	return `${Number(value.toFixed(2))}px`;
}

function ProjectPortal({ project, onOpen, isClone = false }) {
	return (
		<button
			type="button"
			className={`project-portal ${project.className}`}
			onClick={onOpen}
			tabIndex={isClone ? -1 : undefined}
			aria-hidden={isClone ? true : undefined}
			aria-label={isClone ? undefined : `Open ${project.title} project details`}
		>
			<span className="project-portal__cloud" aria-hidden="true" />
			<span className="project-portal__window">
				<span className="project-portal__chrome" aria-hidden="true">
					<span />
					<span />
					<span />
				</span>
				<span className="project-portal__media">
					<img src={project.previewImage} alt="" loading="eager" className="project-portal__image" />
					<span className="project-portal__placeholder">
						<span>{project.title}</span>
						<small>sample image</small>
					</span>
				</span>
				<span className="project-portal__copy">
					<span>
						<strong>{project.title}</strong>
						<small>{project.kicker}</small>
					</span>
					<em>{project.description}</em>
				</span>
			</span>
		</button>
	);
}

function LandscapeProjectCarousel({ projects, activeIndex, onSelect, onOpen }) {
	const activeProject = projects[activeIndex] || projects[0];

	if (!activeProject) return null;

	return (
		<div className="clouds-home__landscape-carousel" aria-label="Featured project carousel">
			<button
				type="button"
				className="clouds-home__landscape-window"
				onClick={(e) => onOpen(activeProject, e)}
				aria-label={`Open ${activeProject.title} project`}
			>
				<img src={activeProject.previewImage} alt="" loading="eager" className="clouds-home__landscape-image" />
				<span className="clouds-home__landscape-title">{activeProject.title}</span>
			</button>
			<div className="clouds-home__landscape-dots" aria-label="Choose featured project">
				{projects.map((project, index) => (
					<button
						key={project.id}
						type="button"
						className={`clouds-home__landscape-dot${index === activeIndex ? ' clouds-home__landscape-dot--active' : ''}`}
						onClick={() => onSelect(index)}
						aria-label={`Show ${project.title}`}
						aria-pressed={index === activeIndex}
					/>
				))}
			</div>
		</div>
	);
}

export default function CloudsHome() {
	const navigate = useNavigate();
	const [viewport, setViewport] = useState(getViewport);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [landscapeProjectIndex, setLandscapeProjectIndex] = useState(0);
	const isMobileLandscape = viewport.width <= 960 && viewport.height <= 520 && viewport.width > viewport.height;

	useEffect(() => {
		function handleResize() {
			setViewport(getViewport());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		function handleMotionChange() {
			setReducedMotion(motionQuery.matches);
		}

		handleMotionChange();
		motionQuery.addEventListener('change', handleMotionChange);
		return () => motionQuery.removeEventListener('change', handleMotionChange);
	}, []);

	useEffect(() => {
		if (!isMobileLandscape || reducedMotion) return undefined;

		const carouselTimer = window.setInterval(() => {
			setLandscapeProjectIndex((currentIndex) => (currentIndex + 1) % PROJECT_PORTALS.length);
		}, 4200);

		return () => window.clearInterval(carouselTimer);
	}, [isMobileLandscape, reducedMotion]);

	useEffect(() => {
		return scheduleBackgroundPreload(() => {
			preloadStaticPageImages();
			void loadProjectsPageData()
				.then(() => loadExperiencePageData())
				.then(() => loadSkillsPageData())
				.then(() => loadEducationPageData());
		});
	}, []);

	useEffect(() => {
		window.sessionStorage.removeItem('cloudsHomeReturnSection');
	}, []);

	const isPortraitTablet = viewport.width >= 768 && viewport.width <= 1024 && viewport.height > viewport.width;
	const shouldRenderPortalStage = viewport.width >= 1024 && viewport.height >= 620 && !isPortraitTablet;

	const { portalSceneScale, scaleVars } = useMemo(() => {
		const isPhoneLayout = viewport.width < 768;
		const isPortraitMobileLayout = viewport.width <= 820 && viewport.height > viewport.width;
		const isLandscapeMobileLayout = viewport.width <= 960 && viewport.height <= 520 && viewport.width > viewport.height;
		const isCardPortalLayout = !shouldRenderPortalStage;
		const desktopStageScale = shouldRenderPortalStage
			? clampScale(Math.min(viewport.width / 2560, viewport.height / 1440), 0.32, 1)
			: 1;
		const mobileStageScale = isPortraitMobileLayout
			? clampScale(Math.min(viewport.width / MOBILE_HOME_CANVAS.width, viewport.height / MOBILE_HOME_CANVAS.height), 0.38, 1)
			: 1;
		const mobileWidthScale = isPortraitMobileLayout
			? clampScale(viewport.width / MOBILE_HOME_CANVAS.width, 0.38, 1)
			: 1;
		const mobileHeightScale = isPortraitMobileLayout
			? clampScale(viewport.height / MOBILE_HOME_CANVAS.height, 0.44, 1)
			: 1;
		const landscapeStageScale = isLandscapeMobileLayout
			? clampScale(Math.min(viewport.width / LANDSCAPE_HOME_CANVAS.width, viewport.height / LANDSCAPE_HOME_CANVAS.height), 0.62, 1)
			: 1;
		const landscapeWidthScale = isLandscapeMobileLayout
			? clampScale(viewport.width / LANDSCAPE_HOME_CANVAS.width, 0.62, 1)
			: 1;
		const landscapeHeightScale = isLandscapeMobileLayout
			? clampScale(viewport.height / LANDSCAPE_HOME_CANVAS.height, 0.62, 1)
			: 1;
		const sceneFitScale = shouldRenderPortalStage ? 1 : desktopStageScale;
		const logoFitScale = isPhoneLayout
			? clampScale(Math.min(viewport.width / 430, viewport.height / 820), 0.62, 0.86)
			: isCardPortalLayout
				? clampScale(Math.min(viewport.width / 1180, viewport.height / 1060), 0.68, 0.92)
				: 1;

		return {
			portalSceneScale: sceneFitScale,
			scaleVars: {
				'--home-stage-scale': desktopStageScale,
				'--home-logo-width': `${900 * logoFitScale}px`,
				'--home-copy-scale': sceneFitScale,
				'--home-route-scale': sceneFitScale,
				'--home-mobile-brand-top': toPixelValue(MOBILE_HOME_CANVAS.brandTop * mobileHeightScale),
				'--home-mobile-brand-inset': toPixelValue(MOBILE_HOME_CANVAS.brandInset * mobileWidthScale),
				'--home-mobile-brand-height': toPixelValue(MOBILE_HOME_CANVAS.brandHeight * mobileHeightScale),
				'--home-mobile-logo-top': toPixelValue(MOBILE_HOME_CANVAS.logoTop * mobileHeightScale),
				'--home-mobile-logo-width': toPixelValue(MOBILE_HOME_CANVAS.logoWidth * mobileWidthScale),
				'--home-mobile-copy-top': toPixelValue(MOBILE_HOME_CANVAS.copyTop * mobileHeightScale),
				'--home-mobile-copy-width': toPixelValue(MOBILE_HOME_CANVAS.copyWidth * mobileWidthScale),
				'--home-mobile-copy-gap': toPixelValue(Math.max(7, MOBILE_HOME_CANVAS.copyGap * mobileStageScale)),
				'--home-mobile-headline-size': toPixelValue(Math.max(20, MOBILE_HOME_CANVAS.headlineSize * mobileStageScale)),
				'--home-mobile-intro-size': toPixelValue(Math.max(11.5, MOBILE_HOME_CANVAS.introSize * mobileStageScale)),
				'--home-mobile-action-min-width': toPixelValue(Math.max(154, MOBILE_HOME_CANVAS.actionMinWidth * mobileWidthScale)),
				'--home-mobile-action-min-height': toPixelValue(Math.max(40, MOBILE_HOME_CANVAS.actionMinHeight * mobileStageScale)),
				'--home-mobile-action-font-size': toPixelValue(Math.max(12, MOBILE_HOME_CANVAS.actionFontSize * mobileStageScale)),
				'--home-mobile-button-cloud-width': toPixelValue(Math.max(26, MOBILE_HOME_CANVAS.buttonCloudWidth * mobileStageScale)),
				'--home-mobile-button-cloud-height': toPixelValue(Math.max(18, MOBILE_HOME_CANVAS.buttonCloudHeight * mobileStageScale)),
				'--home-mobile-portal-bottom': toPixelValue(MOBILE_HOME_CANVAS.portalBottom * mobileHeightScale),
				'--home-mobile-portal-height': toPixelValue(MOBILE_HOME_CANVAS.portalHeight * mobileStageScale),
				'--home-mobile-portal-card-width': toPixelValue(MOBILE_HOME_CANVAS.portalCardWidth * mobileWidthScale),
				'--home-mobile-portal-gap': toPixelValue(Math.max(2, MOBILE_HOME_CANVAS.portalGap * mobileStageScale)),
				'--home-mobile-portal-pad-top': toPixelValue(MOBILE_HOME_CANVAS.portalPadTop * mobileStageScale),
				'--home-mobile-portal-pad-bottom': toPixelValue(MOBILE_HOME_CANVAS.portalPadBottom * mobileStageScale),
				'--home-mobile-portal-title-bottom': toPixelValue(Math.max(16, MOBILE_HOME_CANVAS.portalTitleBottom * mobileStageScale)),
				'--home-mobile-portal-title-size': toPixelValue(Math.max(11, MOBILE_HOME_CANVAS.portalTitleSize * mobileStageScale)),
				'--home-mobile-portal-media-margin': toPixelValue(Math.max(4, MOBILE_HOME_CANVAS.portalMediaMargin * mobileStageScale)),
				'--home-mobile-portal-radius': toPixelValue(Math.max(10, MOBILE_HOME_CANVAS.portalRadius * mobileStageScale)),
				'--home-landscape-brand-top': toPixelValue(LANDSCAPE_HOME_CANVAS.brandTop * landscapeHeightScale),
				'--home-landscape-brand-bottom': toPixelValue(LANDSCAPE_HOME_CANVAS.brandBottom * landscapeHeightScale),
				'--home-landscape-brand-width': toPixelValue(LANDSCAPE_HOME_CANVAS.brandWidth * landscapeWidthScale),
				'--home-landscape-logo-top': toPixelValue(LANDSCAPE_HOME_CANVAS.logoTop * landscapeHeightScale),
				'--home-landscape-logo-left': toPixelValue(LANDSCAPE_HOME_CANVAS.logoLeft * landscapeWidthScale),
				'--home-landscape-logo-width': toPixelValue(LANDSCAPE_HOME_CANVAS.logoWidth * landscapeStageScale),
				'--home-landscape-copy-top': toPixelValue(LANDSCAPE_HOME_CANVAS.copyTop * landscapeHeightScale),
				'--home-landscape-copy-left': toPixelValue(LANDSCAPE_HOME_CANVAS.copyLeft * landscapeWidthScale),
				'--home-landscape-copy-width': toPixelValue(LANDSCAPE_HOME_CANVAS.copyWidth * landscapeWidthScale),
				'--home-landscape-copy-gap': toPixelValue(Math.max(5, LANDSCAPE_HOME_CANVAS.copyGap * landscapeStageScale)),
				'--home-landscape-headline-size': toPixelValue(Math.max(16, LANDSCAPE_HOME_CANVAS.headlineSize * landscapeStageScale)),
				'--home-landscape-intro-size': toPixelValue(Math.max(8.2, LANDSCAPE_HOME_CANVAS.introSize * landscapeStageScale)),
				'--home-landscape-action-min-width': toPixelValue(Math.max(128, LANDSCAPE_HOME_CANVAS.actionMinWidth * landscapeWidthScale)),
				'--home-landscape-action-min-height': toPixelValue(Math.max(30, LANDSCAPE_HOME_CANVAS.actionMinHeight * landscapeStageScale)),
				'--home-landscape-action-font-size': toPixelValue(Math.max(8.6, LANDSCAPE_HOME_CANVAS.actionFontSize * landscapeStageScale)),
				'--home-landscape-button-cloud-width': toPixelValue(Math.max(18, LANDSCAPE_HOME_CANVAS.buttonCloudWidth * landscapeStageScale)),
				'--home-landscape-button-cloud-height': toPixelValue(Math.max(13, LANDSCAPE_HOME_CANVAS.buttonCloudHeight * landscapeStageScale)),
				'--home-landscape-portal-top': toPixelValue(LANDSCAPE_HOME_CANVAS.portalTop * landscapeHeightScale),
				'--home-landscape-portal-right': toPixelValue(LANDSCAPE_HOME_CANVAS.portalRight * landscapeWidthScale),
				'--home-landscape-portal-width': toPixelValue(LANDSCAPE_HOME_CANVAS.portalWidth * landscapeWidthScale),
				'--home-landscape-portal-height': toPixelValue(LANDSCAPE_HOME_CANVAS.portalHeight * landscapeStageScale),
				'--home-landscape-carousel-gap': toPixelValue(Math.max(5, LANDSCAPE_HOME_CANVAS.carouselGap * landscapeStageScale)),
				'--home-landscape-window-radius': toPixelValue(Math.max(10, LANDSCAPE_HOME_CANVAS.windowRadius * landscapeStageScale)),
				'--home-landscape-window-inset': toPixelValue(Math.max(4, LANDSCAPE_HOME_CANVAS.windowInset * landscapeStageScale)),
				'--home-landscape-window-double-inset': toPixelValue(Math.max(8, LANDSCAPE_HOME_CANVAS.windowInset * landscapeStageScale * 2)),
				'--home-landscape-title-bottom': toPixelValue(Math.max(12, LANDSCAPE_HOME_CANVAS.titleBottom * landscapeStageScale)),
				'--home-landscape-title-size': toPixelValue(Math.max(11, LANDSCAPE_HOME_CANVAS.titleSize * landscapeStageScale)),
				'--home-landscape-dot-size': toPixelValue(Math.max(8, LANDSCAPE_HOME_CANVAS.dotSize * landscapeStageScale)),
				'--home-landscape-dot-gap': toPixelValue(Math.max(6, LANDSCAPE_HOME_CANVAS.dotGap * landscapeStageScale)),
			},
		};
	}, [shouldRenderPortalStage, viewport]);

	function openSceneRoute(route, e) {
		e.currentTarget.blur();
		navigate(route);
	}

	function openLiveProject(url) {
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	return (
		<div className="clouds-home" style={scaleVars}>
			<div className="clouds-home__camera">
				<div className="clouds-home__sky" />
				<div className="clouds-home__haze" />
				<div className="clouds-home__horizon" />

				<SectionNav ariaLabel="Portfolio sections" />

				<main className="clouds-home__stage">
					<section className="clouds-home__brand-panel" aria-labelledby="home-brand-title">
						<div className="clouds-home__logo-scene" aria-hidden="true">
							<div className="clouds-home__logo-sparkles">
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
							<img src="/assets/logo-cloud.webp" alt="" width="1489" height="895" fetchPriority="high" className="clouds-home__logo-cloud" />
							<img src="/assets/logo-wordmark.webp" alt="" width="1108" height="214" fetchPriority="high" className="clouds-home__logo-wordmark" />
						</div>
						<h1 id="home-brand-title" className="clouds-home__sr-title">HeadInTheCloudsHaven LLC</h1>
						<div className="clouds-home__copy-panel">
							<h2 className="clouds-home__headline">Website Development Consultation & Portfolio</h2>
							<p className="clouds-home__intro">
								Websites crafted with care, blending design and functionality to create memorable digital experiences.
							</p>
							<div className="clouds-home__actions">
								<button type="button" className="clouds-home__primary-action" onClick={(e) => openSceneRoute('/projects', e)}>
									<img src="/assets/cta-cloud.webp" alt="" className="clouds-home__button-cloud" aria-hidden="true" />
									<span>Enter Projects</span>
								</button>
							</div>
						</div>
					</section>

					<section className="clouds-home__portal-field" aria-label="Selected project portals">
						{shouldRenderPortalStage ? (
							<Suspense fallback={null}>
								<CloudPortalStage onOpenProject={openLiveProject} reducedMotion={reducedMotion} sceneScale={portalSceneScale} />
							</Suspense>
						) : null}
						<div className="clouds-home__mobile-portals">
							{[...PROJECT_PORTALS, ...PROJECT_PORTALS, ...PROJECT_PORTALS, ...PROJECT_PORTALS].map((project, index) => (
								<ProjectPortal
									key={`${project.id}-${index}`}
									project={project}
									isClone={index >= PROJECT_PORTALS.length}
									onOpen={(e) => {
										e.currentTarget.blur();
										openLiveProject(project.liveUrl);
									}}
								/>
							))}
						</div>
						<LandscapeProjectCarousel
							projects={PROJECT_PORTALS}
							activeIndex={landscapeProjectIndex}
							onSelect={setLandscapeProjectIndex}
							onOpen={(project, e) => {
								e.currentTarget.blur();
								openLiveProject(project.liveUrl);
							}}
						/>
					</section>

					<div className="clouds-home__route-field" aria-label="Cloud navigation">
						{FLOATING_NAV_ITEMS.map((item, index) => {
							const RouteIcon = ROUTE_ICONS[item.icon];

							return (
								<button
									key={item.id}
									type="button"
									className={`home-route-button ${item.className}`}
									style={{ '--float-index': index }}
									onClick={(e) => openSceneRoute(item.route, e)}
									aria-label={`Open ${item.label}`}
								>
									<img src={item.cloudImage} alt="" className="home-route-button__cloud-art" aria-hidden="true" />
									<RouteIcon className="home-route-button__icon" strokeWidth={1.85} aria-hidden="true" />
									<span className="home-route-button__label">
										{(item.labelLines ?? [item.label]).map((line) => (
											<span key={line}>{line}</span>
										))}
									</span>
								</button>
							);
						})}
					</div>
				</main>
			</div>
		</div>
	);
}
