// Projects route that loads project API data and chooses mobile HTML cards or desktop Three.js windows.
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import '../styles/shared.css';
import '../styles/projects-page.css';
import { getCachedProjectsPageData, loadProjectsPageData } from '../lib/pageDataCache';
import { getProjectLane } from '../lib/projectWindowLanes';
import { renderTextWithDelimiterBreaks } from '../lib/textBreaks.jsx';

const ProjectsWindowStage = lazy(() => import('../components/ProjectsWindowStage'));

function getViewport() {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

function clampScale(scale, min, max) {
	return Math.min(Math.max(scale, min), max);
}

function isMobileProjectsViewport(viewport) {
	const shortSide = Math.min(viewport.width, viewport.height);
	const longSide = Math.max(viewport.width, viewport.height);
	const isLaptopOrDesktop = viewport.width >= 1280 && viewport.height >= 720;
	const fitsTabletWindowLayout = shortSide <= 820 && longSide <= 1180;

	return fitsTabletWindowLayout && !isLaptopOrDesktop;
}

// Desktop values are calibrated against the design target used by the Three.js project cards.
const PROJECTS_DESKTOP_SCALE_BASE = {
	width: 1366,
	height: 900,
};
const PROJECTS_DESKTOP_MIN_LAYOUT_SCALE = 0.8;
const PROJECTS_DESKTOP_CAMERA_BASE_Z = 4.5;
const PROJECTS_DESKTOP_CAMERA_PULLBACK = 2.9;
const PROJECTS_DESKTOP_CARD_LIMITS = {
	width: {
		min: 390,
		max: 560,
	},
	height: {
		min: 360,
		max: 470,
	},
};

function ProjectWindowSkeleton({ lane = 'middle', enterDelay = 0 }) {
	return (
		<div
			className={`projects-page__skeleton projects-page__skeleton--${lane}`}
			style={{
				'--project-window-enter-delay': `${enterDelay}ms`,
			}}
		/>
	);
}

function ProjectWindowSkeletonGrid({ isMobile = false }) {
	return (
		<div className={`projects-page__skeleton-grid${isMobile ? ' projects-page__skeleton-grid--mobile' : ''}`} aria-label="Loading projects">
			{[0, 1, 2, 3, 4, 5].map((item, index) => (
				<ProjectWindowSkeleton key={item} lane={getProjectLane(index, 6)} enterDelay={index * 90} />
			))}
		</div>
	);
}

function MobileProjectWindow({ project, index, totalProjects }) {
	const lane = getProjectLane(index, totalProjects);
	const content = (
		<>
			<span className="projects-page__mobile-window">
				<span className="projects-page__mobile-chrome" aria-hidden="true">
					<span />
					<span />
					<span />
				</span>
				<span className="projects-page__mobile-content">
					<span className="projects-page__mobile-topbar">
						{Array.isArray(project.tags) && project.tags.length ? (
							<span className="projects-page__mobile-tags">
								{project.tags.slice(0, 4).map((tag) => (
									<span key={tag}>{renderTextWithDelimiterBreaks(tag)}</span>
								))}
							</span>
						) : <span />}
						<span className={`projects-page__mobile-open-icon${project.link ? '' : ' projects-page__mobile-open-icon--disabled'}`} aria-hidden="true">
							<ExternalLink size={18} strokeWidth={3} />
						</span>
					</span>
					<span className="projects-page__mobile-body">
						{project.iconImage ? <img src={project.iconImage} alt="" className="projects-page__mobile-icon" loading="lazy" /> : null}
						<span className="projects-page__mobile-copy">
							<strong>{renderTextWithDelimiterBreaks(project.title)}</strong>
							<small>{renderTextWithDelimiterBreaks(project.desc)}</small>
						</span>
					</span>
				</span>
			</span>
		</>
	);

	if (!project.link) {
		return <article className={`projects-page__mobile-card projects-page__mobile-card--${lane}`}>{content}</article>;
	}

	return (
		<a className={`projects-page__mobile-card projects-page__mobile-card--${lane}`} href={project.link} target="_blank" rel="noopener noreferrer">
			{content}
		</a>
	);
}

export default function ProjectsPage() {
	const [cachedAtMount] = useState(() => getCachedProjectsPageData());
	const [projects, setProjects] = useState(cachedAtMount);
	const [viewport, setViewport] = useState(getViewport);
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		let isActive = true;

		loadProjectsPageData().then((loadedProjects) => {
			if (isActive) setProjects(loadedProjects);
		});

		return () => {
			isActive = false;
		};
	}, []);

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

	const sceneScale = useMemo(() => {
		return 1;
	}, []);

	const desktopLayoutScale = useMemo(() => {
		const viewportScale = Math.min(
			viewport.width / PROJECTS_DESKTOP_SCALE_BASE.width,
			viewport.height / PROJECTS_DESKTOP_SCALE_BASE.height,
		);

		return clampScale(viewportScale, PROJECTS_DESKTOP_MIN_LAYOUT_SCALE, 1);
	}, [viewport.height, viewport.width]);

	const desktopCardSize = useMemo(() => {
		const baseCardWidth = clampScale(viewport.width * 0.33, PROJECTS_DESKTOP_CARD_LIMITS.width.min, PROJECTS_DESKTOP_CARD_LIMITS.width.max);
		const baseCardHeight = clampScale(viewport.width * 0.285, PROJECTS_DESKTOP_CARD_LIMITS.height.min, PROJECTS_DESKTOP_CARD_LIMITS.height.max);

		return {
			width: Math.round(baseCardWidth * desktopLayoutScale),
			height: Math.round(baseCardHeight * desktopLayoutScale),
		};
	}, [desktopLayoutScale, viewport.width]);
	const desktopCameraZ = useMemo(() => {
		return PROJECTS_DESKTOP_CAMERA_BASE_Z + ((1 - desktopLayoutScale) * PROJECTS_DESKTOP_CAMERA_PULLBACK);
	}, [desktopLayoutScale]);

	function openProjectLink(url) {
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	const shouldUseMobileWindows = isMobileProjectsViewport(viewport);

	return (
		<div className="page-section projects-page">
			<div className="page-header">
				<div className="page-title">Projects</div>
				<div className="page-subtitle">things I&apos;ve built</div>
			</div>

			<div className="projects-page__stage-wrap">
				{projects === null ? (
					<ProjectWindowSkeletonGrid isMobile={shouldUseMobileWindows} />
				) : projects.length ? (
					shouldUseMobileWindows ? (
						<div className="projects-page__mobile-list" aria-label="Project links">
							{projects.map((project, index) => (
								<MobileProjectWindow key={project.id} project={project} index={index} totalProjects={projects.length} />
							))}
						</div>
					) : (
						<Suspense fallback={<ProjectWindowSkeletonGrid />}>
							<ProjectsWindowStage
								projects={projects}
								reducedMotion={reducedMotion}
								cardSize={desktopCardSize}
								cameraZ={desktopCameraZ}
								sceneScale={sceneScale}
								onOpenProject={openProjectLink}
							/>
						</Suspense>
					)
				) : (
					<div className="projects-page__empty glass-card">Projects are loading from the portfolio API.</div>
				)}
			</div>
		</div>
	);
}
