import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cloud from './Cloud';
import JacobBalloon from './JacobBalloon';
import '../../styles/clouds-home.css';

const PAGE_CLOUDS = [
	{ id: 'projects', label: 'Projects', route: '/projects', style: { top: '9%', left: '13%', animation: 'cloudFloatA 7.5s ease-in-out infinite' } },
	{ id: 'about', label: 'About', route: '/about', style: { top: '38%', left: '10%', animation: 'cloudFloatF 8.5s ease-in-out infinite' } },
	{ id: 'skills', label: 'Skills', route: '/skills', style: { top: '9%', right: '14%', animation: 'cloudFloatB 9s ease-in-out infinite' } },
	{ id: 'education', label: 'Education', route: '/education', style: { top: '66%', left: '13%', animation: 'cloudFloatC 6.5s ease-in-out infinite' } },
	{ id: 'contact', label: 'Contact', route: '/contact', style: { top: '38%', right: '10%', animation: 'cloudFloatE 8s ease-in-out infinite' } },
	{ id: 'experience', label: 'Experience', route: '/experience', style: { top: '66%', right: '14%', animation: 'cloudFloatD 10s ease-in-out infinite' } },
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

const BG_CLOUDS = [
	{ w: '155px', h: '52px', top: '18%', left: '1%', opacity: 0.65 },
	{ w: '105px', h: '36px', top: '14%', left: '24%', opacity: 0.5 },
	{ w: '180px', h: '62px', top: '12%', right: '14%', opacity: 0.6 },
	{ w: '92px', h: '31px', top: '24%', right: '2%', opacity: 0.48 },
	{ w: '70px', h: '24px', top: '8%', left: '50%', opacity: 0.38 },
	{ w: '120px', h: '40px', top: '30%', left: '36%', opacity: 0.3 },
];

const SPARKLES = [
	{ top: '28px', left: '68px', delay: '0s' },
	{ top: '12px', left: '148px', delay: '0.7s' },
	{ top: '32px', right: '72px', delay: '1.3s' },
	{ top: '65px', left: '50px', delay: '1.8s' },
	{ top: '10px', left: '195px', delay: '1.1s' },
	{ top: '55px', right: '55px', delay: '0.4s' },
];

const CLOUD_IMAGE_POOL = Array.from({ length: 8 }, (_, index) => `/cloud${index + 1}.png`);

const FLUID_STOPS = {
	cloudScale: [[900, 0.55], [2400, 1]],
	logoTop: [[1200, 60], [2400, 65]],
	logoWidthRem: [[900, 35], [2400, 100]],
	jacobLeft: [[900, 15], [2400, 31]],
	jacobTop: [[1200, 22], [2400, 15]],
	jacobScale: [[900, 0.3], [2400, 1]],
};

function interpolateStops(width, stops) {
	if (width <= stops[0][0]) return stops[0][1];
	if (width >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];

	for (let i = 0; i < stops.length - 1; i += 1) {
		const [minWidth, minValue] = stops[i];
		const [maxWidth, maxValue] = stops[i + 1];

		if (width >= minWidth && width <= maxWidth) {
			const progress = (width - minWidth) / (maxWidth - minWidth);
			return minValue + (maxValue - minValue) * progress;
		}
	}

	return stops[stops.length - 1][1];
}

export default function CloudsHome() {
	const navigate = useNavigate();
	const puffRefs = useRef([]);
	const expandRef = useRef(null);
	const [transitioning, setTransitioning] = useState(false);
	const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
	const [playIntro, setPlayIntro] = useState(() => {
		try {
			return window.sessionStorage.getItem('homeIntroSeen') !== 'true';
		} catch {
			return true;
		}
	});
	const [sceneReveal, setSceneReveal] = useState(() => !playIntro);

	useEffect(() => {
		function handleResize() {
			setViewportWidth(window.innerWidth);
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (!playIntro) return;

		const revealTimer = window.setTimeout(() => {
			setSceneReveal(true);
		}, 2950);

		const timer = window.setTimeout(() => {
			setPlayIntro(false);
			try {
				window.sessionStorage.setItem('homeIntroSeen', 'true');
			} catch {
				// Ignore storage failures; intro replay is acceptable.
			}
		}, 3900);

		return () => {
			window.clearTimeout(revealTimer);
			window.clearTimeout(timer);
		};
	}, [playIntro]);

	function replayIntro() {
		setSceneReveal(false);
		setPlayIntro(true);
		try {
			window.sessionStorage.removeItem('homeIntroSeen');
		} catch {
			// Ignore storage failures; replay still works for this render cycle.
		}
	}

	const fluidVars = useMemo(() => ({
		'--home-cloud-scale': interpolateStops(viewportWidth, FLUID_STOPS.cloudScale),
		'--home-logo-top': `${interpolateStops(viewportWidth, FLUID_STOPS.logoTop)}%`,
		'--home-logo-width': `${interpolateStops(viewportWidth, FLUID_STOPS.logoWidthRem)}rem`,
		'--home-jacob-left': `${interpolateStops(viewportWidth, FLUID_STOPS.jacobLeft)}%`,
		'--home-jacob-top': `${interpolateStops(viewportWidth, FLUID_STOPS.jacobTop)}%`,
		'--home-jacob-scale': interpolateStops(viewportWidth, FLUID_STOPS.jacobScale),
	}), [viewportWidth]);

	const pageCloudImages = useMemo(
		() => PAGE_CLOUDS.map(() => CLOUD_IMAGE_POOL[Math.floor(Math.random() * CLOUD_IMAGE_POOL.length)]),
		[]
	);

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
		<div className={`clouds-home${playIntro ? ' clouds-home--intro' : ''}${sceneReveal ? ' clouds-home--scene-reveal' : ''}`} style={fluidVars}>
			<div className="clouds-home__intro-ground-scene">
				<img src="/ground.png" alt="" className="clouds-home__intro-ground-image" />
			</div>
			<div className="clouds-home__intro-wash" />

			<div className="clouds-home__sky">
				<img src="/sky.png" alt="" className="clouds-home__sky-image" />
			</div>
			<div className="clouds-home__haze" />

			<div className="clouds-home__sun-wrap">
				<div className="clouds-home__sun" />
			</div>

			<div className="clouds-home__bg-clouds">
				{BG_CLOUDS.map((cloud, i) => (
					<div
						key={i}
						className="clouds-home__bg-cloud"
						style={{
							'--w': cloud.w,
							'--h': cloud.h,
							'--top': cloud.top,
							'--left': cloud.left,
							'--right': cloud.right,
							'--opacity': cloud.opacity,
						}}
					/>
				))}
			</div>

			<div className="clouds-home__horizon" />

			<div className="clouds-home__stage">
				<div className="clouds-home__nav-grid">
					{PAGE_CLOUDS.map((cloud, index) => (
						<Cloud
							key={cloud.id}
							label={cloud.label}
							style={cloud.style}
							imageSrc={pageCloudImages[index]}
							onClick={(e) => handleCloudClick(cloud.route, e)}
						/>
					))}
				</div>

				<div className="clouds-home__logo-cloud">
					{SPARKLES.map((sparkle, i) => (
						<div
							key={i}
							className="clouds-home__sparkle"
							style={{
								'--sparkle-top': sparkle.top,
								'--sparkle-left': sparkle.left,
								'--sparkle-right': sparkle.right,
								'--sparkle-delay': sparkle.delay,
							}}
						>
							<div className="clouds-home__sparkle-shape">
								<div className="clouds-home__sparkle-v" />
								<div className="clouds-home__sparkle-h" />
							</div>
						</div>
					))}

					<img src="/logo.png" alt="HeadInTheCloudsHaven" className="clouds-home__logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
				</div>
			</div>

			<JacobBalloon />

			<div className="clouds-home__header">
				<div className="clouds-home__hint">Click a cloud to explore</div>
				<button type="button" className="clouds-home__replay" onClick={replayIntro}>
					Replay Intro
				</button>
			</div>

			<div className="clouds-home__footer">
				<div className="clouds-home__das" />
			</div>

			<div ref={expandRef} className="clouds-home__expand">
				{PUFF_CFG.map((_, i) => (
					<div key={i} ref={(el) => { puffRefs.current[i] = el; }} className="clouds-home__expand-puff" />
				))}
			</div>
		</div>
	);
}
