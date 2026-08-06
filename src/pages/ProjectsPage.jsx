import { useEffect, useMemo, useState } from 'react';
import '../styles/shared.css';
import '../styles/projects-page.css';
import ProjectsWindowStage from '../components/ProjectsWindowStage';
import { getCachedProjectsPageData, loadProjectsPageData } from '../lib/pageDataCache';
import { getProjectLane } from '../lib/projectWindowLanes';
import { renderTextWithDelimiterBreaks } from '../lib/textBreaks.jsx';

function getViewport() {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

function clampScale(scale, min, max) {
	return Math.min(Math.max(scale, min), max);
}

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

function MobileProjectWindow({ project, index, totalProjects }) {
	const lane = getProjectLane(index, totalProjects);
	const content = (
		<>
			<span className="projects-page__mobile-cloud" aria-hidden="true" />
			<span className="projects-page__mobile-window">
				<span className="projects-page__mobile-chrome" aria-hidden="true">
					<span />
					<span />
					<span />
				</span>
				<span className="projects-page__mobile-content">
					{project.iconImage ? <img src={project.iconImage} alt="" className="projects-page__mobile-icon" loading="lazy" /> : null}
					<span className="projects-page__mobile-copy">
						<strong>{renderTextWithDelimiterBreaks(project.title)}</strong>
						<small>{renderTextWithDelimiterBreaks(project.desc)}</small>
					</span>
					{Array.isArray(project.tags) && project.tags.length ? (
						<span className="projects-page__mobile-tags">
							{project.tags.slice(0, 4).map((tag) => (
								<span key={tag}>{renderTextWithDelimiterBreaks(tag)}</span>
							))}
						</span>
					) : null}
					<span className="projects-page__mobile-link-label">{project.link ? 'Open Project' : 'View Details'}</span>
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
		if (viewport.width <= 760) return 1;

		return clampScale(Math.min(viewport.width / 1366, viewport.height / 780), 0.98, 1);
	}, [viewport.height, viewport.width]);

	function openProjectLink(url) {
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	return (
		<div className="page-section projects-page">
			<div className="page-header">
				<div className="page-title">Projects</div>
				<div className="page-subtitle">things I&apos;ve built</div>
			</div>

			<div className="projects-page__stage-wrap">
				{projects === null ? (
					<div className="projects-page__skeleton-grid" aria-label="Loading projects">
						{[0, 1, 2, 3, 4, 5].map((item, index) => (
							<ProjectWindowSkeleton key={item} lane={getProjectLane(index, 6)} enterDelay={index * 90} />
						))}
					</div>
				) : projects.length ? (
					<>
						<ProjectsWindowStage
							projects={projects}
							reducedMotion={reducedMotion}
							sceneScale={sceneScale}
							onOpenProject={openProjectLink}
						/>
						<div className="projects-page__mobile-list" aria-label="Project links">
							{projects.map((project, index) => (
								<MobileProjectWindow key={project.id} project={project} index={index} totalProjects={projects.length} />
							))}
						</div>
					</>
				) : (
					<div className="projects-page__empty glass-card">Projects are loading from the portfolio API.</div>
				)}
			</div>
		</div>
	);
}
