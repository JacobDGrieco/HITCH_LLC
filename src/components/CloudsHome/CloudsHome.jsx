import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadEducationPageData, loadExperiencePageData, loadProjectsPageData, loadSkillsPageData } from '../../lib/pageDataCache';
import '../../styles/clouds-home.css';

const CloudPortalStage = lazy(() => import('./CloudPortalStage'));

const TOP_NAV_ITEMS = [
	{ id: 'projects', label: 'Projects', route: '/projects', isPrimary: true },
	{ id: 'about', label: 'About', route: '/about' },
	{ id: 'skills', label: 'Skills / Experience', route: '/skills' },
	{ id: 'contact', label: 'Contact', route: '/contact' },
];

const FLOATING_NAV_ITEMS = [
	{
		id: 'about',
		label: 'About',
		route: '/about',
		className: 'home-route-button--about',
		cloudImage: '/home/3d/route-about.png',
		icon: 'person',
	},
	{
		id: 'contact',
		label: 'Contact',
		route: '/contact',
		className: 'home-route-button--contact',
		cloudImage: '/home/3d/route-contact.png',
		icon: 'mail',
	},
	{
		id: 'skills',
		label: 'Skills / Experience',
		route: '/skills',
		className: 'home-route-button--skills',
		cloudImage: '/home/3d/route-skills.png',
		icon: 'spark',
	},
];

const PROJECT_PORTALS = [
	{
		id: 'asd',
		title: 'A.S.D.',
		kicker: 'music + fashion platform',
		description: 'Stage-led music, fashion, player, and CMS experience.',
		previewImage: '/home/windows/asd.png',
		liveUrl: 'https://www.asdrecords.net/',
		route: '/projects',
		className: 'project-portal--asd',
	},
	{
		id: 'halomed',
		title: 'HaloMed',
		kicker: 'healthcare brand site',
		description: 'Warm service hierarchy with animated care-path sections.',
		previewImage: '/home/windows/halomed.png',
		liveUrl: 'https://www.halomed.org/',
		route: '/projects',
		className: 'project-portal--halomed',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		kicker: 'product interface',
		description: 'Graph and timeline editor for structured relationships.',
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
	'/home/3d/v2/logo-cloud-v2.png',
	'/home/3d/v2/logo-wordmark-v2.png',
	'/home/3d/cta-cloud.png',
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
				.then(() => loadSkillsPageData())
				.then(() => loadEducationPageData())
				.then(() => loadExperiencePageData());
		});
	}, []);

	useEffect(() => {
		window.sessionStorage.removeItem('cloudsHomeReturnSection');
	}, []);

	const scaleVars = useMemo(() => {
		const sceneScale = Math.min(viewport.width / 1440, viewport.height / 900);
		const brandScale = clampScale(sceneScale, 0.50, 1.08);

		return {
			'--home-logo-width': `${900 * brandScale}px`,
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

				<header className="clouds-home__topbar">
					<Link to="/" className="clouds-home__mark" aria-label="HeadInTheCloudsHaven home">
						<span className="clouds-home__mark-cloud" aria-hidden="true" />
						<span>HeadInTheCloudsHaven</span>
					</Link>
					<nav className="clouds-home__nav" aria-label="Portfolio sections">
						{TOP_NAV_ITEMS.map((item) => (
							<Link
								key={item.id}
								to={item.route}
								className={`clouds-home__nav-link${item.isPrimary ? ' clouds-home__nav-link--primary' : ''}`}
							>
								{item.isPrimary ? <img src="/home/3d/cta-cloud.png" alt="" className="clouds-home__nav-cloud" aria-hidden="true" /> : null}
								{item.label}
							</Link>
						))}
					</nav>
				</header>

				<main className="clouds-home__stage">
					<section className="clouds-home__brand-panel" aria-labelledby="home-brand-title">
						<div className="clouds-home__eyebrow">Web Dev LLC + Portfolio</div>
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
							<img src="/home/3d/v2/logo-cloud-v2.png" alt="" width="1489" height="895" fetchPriority="high" className="clouds-home__logo-cloud" />
							<img src="/home/3d/v2/logo-wordmark-v2.png" alt="" width="1457" height="345" fetchPriority="high" className="clouds-home__logo-wordmark" />
						</div>
						<h1 id="home-brand-title" className="clouds-home__sr-title">HeadInTheCloudsHaven LLC</h1>
						<h2 className="clouds-home__headline">Cloud Portal Gallery</h2>
						<p className="clouds-home__intro">
							Web experiences crafted with imagination and code.
						</p>
						<div className="clouds-home__actions">
							<button type="button" className="clouds-home__primary-action" onClick={(e) => openSceneRoute('/projects', e)}>
								<img src="/home/3d/cta-cloud.png" alt="" className="clouds-home__button-cloud" aria-hidden="true" />
								<span>Enter Projects</span>
							</button>
						</div>
					</section>

					<section className="clouds-home__portal-field" aria-label="Selected project portals">
						<Suspense fallback={null}>
							<CloudPortalStage onOpenProject={openLiveProject} reducedMotion={reducedMotion} />
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
						{FLOATING_NAV_ITEMS.map((item, index) => (
							<button
								key={item.id}
								type="button"
								className={`home-route-button ${item.className}`}
								style={{ '--float-index': index }}
								onClick={(e) => openSceneRoute(item.route, e)}
								aria-label={`Open ${item.label}`}
							>
								<img src={item.cloudImage} alt="" className="home-route-button__cloud-art" aria-hidden="true" />
								<span className={`home-route-button__icon home-route-button__icon--${item.icon}`} aria-hidden="true" />
								<span>{item.label}</span>
							</button>
						))}
					</div>
				</main>
			</div>
		</div>
	);
}
