import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cloud from './Cloud';
import { loadEducationPageData, loadExperiencePageData, loadProjectsPageData, loadSkillsPageData } from '../../lib/pageDataCache';
import '../../styles/clouds-home.css';

const TOP_NAV_ITEMS = [
	{ id: 'projects', label: 'Projects', route: '/projects' },
	{ id: 'about', label: 'About', route: '/about' },
	{ id: 'skills', label: 'Skills / Experience', route: '/skills' },
	{ id: 'contact', label: 'Contact', route: '/contact' },
];

const SCENE_CLOUDS = [
	{
		id: 'projects',
		label: 'Projects',
		route: '/projects',
		className: 'page-cloud--projects',
		scaleMultiplier: 1.18,
	},
	{
		id: 'about',
		label: 'About',
		route: '/about',
		className: 'page-cloud--about',
		scaleMultiplier: 0.76,
	},
	{
		id: 'contact',
		label: 'Contact',
		route: '/contact',
		className: 'page-cloud--contact',
		scaleMultiplier: 0.82,
	},
	{
		id: 'experience',
		label: 'Experience',
		route: '/experience',
		className: 'page-cloud--distant page-cloud--experience',
		scaleMultiplier: 0.56,
	},
];

const CLOUD_IMAGE_SOURCES = [
	{ src: '/home/cloud1.png', width: 412, height: 231 },
	{ src: '/home/cloud2.png', width: 484, height: 218 },
	{ src: '/home/cloud3.png', width: 471, height: 271 },
	{ src: '/home/cloud4.png', width: 498, height: 262 },
	{ src: '/home/cloud5.png', width: 432, height: 257 },
	{ src: '/home/cloud6.png', width: 471, height: 228 },
];

// Swap these paths for curated screenshots when the final samples are ready.
const PROJECT_PORTALS = [
	{
		id: 'asd',
		title: 'A.S.D.',
		kicker: 'music + fashion platform',
		description: 'Stage-led music, fashion, player, and CMS experience.',
		previewImage: '/projects/asd.png',
		route: '/projects',
		className: 'project-portal--asd',
	},
	{
		id: 'halomed',
		title: 'HaloMed',
		kicker: 'healthcare brand site',
		description: 'Warm service hierarchy with animated care-path sections.',
		previewImage: '/projects/halomed.png',
		route: '/projects',
		className: 'project-portal--halomed',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		kicker: 'product interface',
		description: 'Graph and timeline editor for structured relationships.',
		previewImage: '/projects/relatime.png',
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
	'/home/logo-cloud-layer.png',
	'/home/logo-wordmark-layer.png',
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

function shuffleCloudImages() {
	const images = [...CLOUD_IMAGE_SOURCES];

	for (let i = images.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[images[i], images[j]] = [images[j], images[i]];
	}

	return SCENE_CLOUDS.map((cloud, index) => ({
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
	const sceneClouds = useMemo(() => shuffleCloudImages(), []);

	useEffect(() => {
		function handleResize() {
			setViewport(getViewport());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
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
		const cloudScale = clampScale(sceneScale, 0.50, 1.08) * 0.66;

		return {
			'--home-logo-width': `${900 * brandScale}px`,
			'--home-cloud-scale': cloudScale,
		};
	}, [viewport]);

	function openSceneRoute(route, e) {
		e.currentTarget.blur();
		navigate(route);
	}

	return (
		<div className="clouds-home" style={scaleVars}>
			<div className="clouds-home__camera">
				<div className="clouds-home__sky" />
				<div className="clouds-home__haze" />
				<div className="clouds-home__horizon" />

				<header className="clouds-home__topbar">
					<Link to="/" className="clouds-home__mark" aria-label="HeadInTheCloudsHaven home">
						<span className="clouds-home__mark-cloud" aria-hidden="true" />
						<span>HeadInTheCloudsHaven</span>
					</Link>
					<nav className="clouds-home__nav" aria-label="Portfolio sections">
						{TOP_NAV_ITEMS.map((item) => (
							<Link key={item.id} to={item.route} className="clouds-home__nav-link">
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
							<img src="/home/logo-cloud-layer.png" alt="" width="1198" height="720" fetchPriority="high" className="clouds-home__logo-cloud" />
							<img src="/home/logo-wordmark-layer.png" alt="" width="1108" height="214" fetchPriority="high" className="clouds-home__logo-wordmark" />
						</div>
						<h1 id="home-brand-title" className="clouds-home__sr-title">HeadInTheCloudsHaven LLC</h1>
						<h2 className="clouds-home__headline">Cloud Portal Gallery</h2>
						<p className="clouds-home__intro">
							Web experiences crafted with imagination and code.
						</p>
						<div className="clouds-home__actions">
							<button type="button" className="clouds-home__primary-action" onClick={(e) => openSceneRoute('/projects', e)}>
								<span className="clouds-home__button-cloud" aria-hidden="true" />
								<span>Enter Projects</span>
							</button>
						</div>
					</section>

					<section className="clouds-home__portal-field" aria-label="Selected project portals">
						{PROJECT_PORTALS.map((project) => (
							<ProjectPortal
								key={project.id}
								project={project}
								onOpen={(e) => openSceneRoute(project.route, e)}
							/>
						))}
					</section>

					<div className="clouds-home__cloud-field" aria-label="Cloud navigation">
						{sceneClouds.map((cloud, index) => (
							<Cloud
								key={cloud.id}
								label={cloud.label}
								imageSrc={cloud.imageSrc}
								imageWidth={cloud.imageWidth}
								imageHeight={cloud.imageHeight}
								scale={scaleVars['--home-cloud-scale'] * cloud.scaleMultiplier}
								floatIndex={index}
								className={cloud.className}
								onClick={(e) => openSceneRoute(cloud.route, e)}
							/>
						))}
					</div>
				</main>
			</div>
		</div>
	);
}
