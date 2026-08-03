import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cloud from './Cloud';
import SkyScene from './SkyScene';
import { useSiteMusic } from '../audio/useSiteMusic';
import { useSiteChrome } from '../chrome/useSiteChrome';
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
	{ src: '/cloud1.png', width: 537, height: 187 },
	{ src: '/cloud2.png', width: 537, height: 187 },
	{ src: '/cloud3.png', width: 537, height: 187 },
	{ src: '/cloud4.png', width: 537, height: 187 },
	{ src: '/cloud5.png', width: 537, height: 187 },
	{ src: '/cloud6.png', width: 537, height: 187 },
	{ src: '/cloud7.png', width: 537, height: 187 },
	{ src: '/cloud8.png', width: 537, height: 187 },
];

const PUFF_CFG = [
	{ ox: 0, oy: 0, size: 70, delay: 0, dur: 600 },
	{ ox: -25, oy: -10, size: 65, delay: 40, dur: 620 },
	{ ox: 25, oy: -10, size: 65, delay: 40, dur: 620 },
	{ ox: -45, oy: 15, size: 60, delay: 80, dur: 640 },
	{ ox: 45, oy: 15, size: 60, delay: 80, dur: 640 },
	{ ox: -20, oy: 30, size: 68, delay: 60, dur: 630 },
	{ ox: 20, oy: 30, size: 68, delay: 60, dur: 630 },
	{ ox: 0, oy: -28, size: 58, delay: 100, dur: 650 },
];

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

export default function CloudsHome() {
	const navigate = useNavigate();
	const { requestAutoplay } = useSiteMusic();
	const { setDasHidden } = useSiteChrome();
	const puffRefs = useRef([]);
	const expandRef = useRef(null);
	const [transitioning, setTransitioning] = useState(false);
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
		setDasHidden(transitioning);

		return () => {
			setDasHidden(false);
		};
	}, [setDasHidden, transitioning]);

	const scaleVars = useMemo(() => {
		const sceneScale = Math.min(viewport.width / 1440, viewport.height / 900);
		const logoScale = clampScale(sceneScale, 0.50, 1.32);
		const cloudScale = clampScale(sceneScale, 0.48, 1.18) * 0.75;

		return {
			'--home-logo-width': `${860 * logoScale}px`,
			'--home-cloud-scale': cloudScale,
			'--home-cloud-gap': `${20 * cloudScale}px`,
			'--home-cloud-offset-odd': `${8 * cloudScale}px`,
			'--home-cloud-offset-even': `${124 * cloudScale}px`,
		};
	}, [viewport]);

	function handleCloudClick(route, e) {
		if (transitioning) return;
		setTransitioning(true);

		const rect = e.currentTarget.getBoundingClientRect();
		const isMobile = window.innerWidth <= 640;
		const cx = isMobile ? window.innerWidth / 2 : rect.left + rect.width / 2;
		const cy = isMobile ? window.innerHeight * 0.46 : rect.top + rect.height / 2;

		e.currentTarget.style.opacity = '0';
		e.currentTarget.style.transition = 'opacity 0.2s';

		const stage = expandRef.current;
		stage.style.left = `${cx}px`;
		stage.style.top = `${cy}px`;

		const vw = window.innerWidth;

		puffRefs.current.forEach((el, i) => {
			if (!el) return;
			const cfg = PUFF_CFG[i];
			const sizePx = (cfg.size / 100) * vw * 2.2;
			el.style.width = `${sizePx}px`;
			el.style.height = `${sizePx}px`;
			el.style.left = `${(cfg.ox / 100) * vw}px`;
			el.style.top = `${(cfg.oy / 100) * vw}px`;
			el.style.opacity = '0';
			el.style.transform = 'translate(-50%, -50%) scale(0.04)';
			el.style.transition = 'none';

			setTimeout(() => {
				el.style.transition = `transform ${cfg.dur}ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease`;
				el.style.transform = 'translate(-50%, -50%) scale(1)';
				el.style.opacity = '1';
			}, cfg.delay);
		});

		setTimeout(() => navigate(route), 740);
	}

	return (
		<div className="clouds-home" style={scaleVars}>
			<div className="clouds-home__sky" />
			<SkyScene />
			<div className="clouds-home__haze" />
			<div className="clouds-home__horizon" />

			<div className="clouds-home__stage">
				<div className="clouds-home__left-zone">
					<img src="/logo_full.png" alt="HeadInTheCloudsHaven" width="1024" height="1024" fetchPriority="high" className="clouds-home__logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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
							onClick={(e) => handleCloudClick(cloud.route, e)}
						/>
					))}
				</div>
			</div>

			<div className="clouds-home__header">
				<div className="clouds-home__hint">Click to Explore</div>
			</div>

			<div ref={expandRef} className="clouds-home__expand">
				{PUFF_CFG.map((_, i) => (
					<div key={i} ref={(el) => { puffRefs.current[i] = el; }} className="clouds-home__expand-puff" />
				))}
			</div>
		</div>
	);
}
