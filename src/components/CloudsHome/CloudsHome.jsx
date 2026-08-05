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
		cloudImage: '/home/route1.png',
		icon: 'person',
	},
	{
		id: 'experience',
		label: 'Experience',
		route: '/experience',
		className: 'home-route-button--contact',
		cloudImage: '/home/route2.png',
		icon: 'tool',
	},
	{
		id: 'education',
		label: 'Education',
		route: '/education',
		className: 'home-route-button--skills',
		cloudImage: '/home/route3.png',
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
		previewImage: '/home/windows/asd.png',
		liveUrl: 'https://www.asdrecords.net/',
		route: '/projects',
		className: 'project-portal--asd',
	},
	{
		id: 'halomed',
		title: 'HaloMed',
		previewImage: '/home/windows/halomed.png',
		liveUrl: 'https://www.halomed.org/',
		route: '/projects',
		className: 'project-portal--halomed',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		previewImage: '/projects/relatime.png',
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

const STATIC_PAGE_IMAGE_SOURCES = [
	'/headshot.jpg',
	'/contact/resume.png',
	'/contact/linkedin.png',
	'/contact/github.png',
	'/home/logo-cloud.png',
	'/home/logo-wordmark.png',
	'/home/cta-cloud.png',
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

function ProjectPortal({ project, onOpen }) {
	return (
		<button
			type="button"
			className={`project-portal ${project.className}`}
			onClick={onOpen}
			aria-label={`Open ${project.title} project details`}
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

export default function CloudsHome() {
	const navigate = useNavigate();
	const [viewport, setViewport] = useState(getViewport);
	const [reducedMotion, setReducedMotion] = useState(false);

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

	const { portalSceneScale, scaleVars } = useMemo(() => {
		const isCompactLayout = viewport.width <= 820;
		const sceneFitScale = isCompactLayout
			? 1
			: clampScale(Math.min(viewport.width / 1680, viewport.height / 920), 0.72, 1);
		const logoFitScale = isCompactLayout
			? clampScale(Math.min(viewport.width / 1440, viewport.height / 900), 0.50, 1.08)
			: sceneFitScale;

		return {
			portalSceneScale: sceneFitScale,
			scaleVars: {
				'--home-logo-width': `${900 * logoFitScale}px`,
				'--home-copy-scale': sceneFitScale,
				'--home-route-scale': sceneFitScale,
			},
		};
	}, [viewport]);

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
				<div className="clouds-home__sun" aria-hidden="true" />

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
							<img src="/home/logo-cloud.png" alt="" width="1489" height="895" fetchPriority="high" className="clouds-home__logo-cloud" />
							<img src="/home/logo-wordmark.png" alt="" width="1108" height="214" fetchPriority="high" className="clouds-home__logo-wordmark" />
						</div>
						<h1 id="home-brand-title" className="clouds-home__sr-title">HeadInTheCloudsHaven LLC</h1>
						<div className="clouds-home__copy-panel">
							<h2 className="clouds-home__headline">Website Development Consultation & Portfolio</h2>
							<p className="clouds-home__intro">
								Websites crafted with care, blending design and functionality to create memorable digital experiences.
							</p>
							<div className="clouds-home__actions">
								<button type="button" className="clouds-home__primary-action" onClick={(e) => openSceneRoute('/projects', e)}>
									<img src="/home/cta-cloud.png" alt="" className="clouds-home__button-cloud" aria-hidden="true" />
									<span>Enter Projects</span>
								</button>
							</div>
						</div>
					</section>

					<section className="clouds-home__portal-field" aria-label="Selected project portals">
						<Suspense fallback={null}>
							<CloudPortalStage onOpenProject={openLiveProject} reducedMotion={reducedMotion} sceneScale={portalSceneScale} />
						</Suspense>
						<div className="clouds-home__mobile-portals">
							{PROJECT_PORTALS.map((project) => (
								<ProjectPortal
									key={project.id}
									project={project}
									onOpen={(e) => {
										e.currentTarget.blur();
										openLiveProject(project.liveUrl);
									}}
								/>
							))}
						</div>
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
