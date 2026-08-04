import { useEffect, useState } from 'react';
import '../styles/shared.css';
import '../styles/projects-page.css';
import DropCard from '../components/DropCard';
import { getCachedProjectsPageData, loadProjectsPageData } from '../lib/pageDataCache';

function DropCardSkeleton({ size = 340, enterDelay = 0 }) {
	return (
		<div
			className="drop-card drop-card--skeleton"
			style={{
				'--drop-w': `${size}px`,
				'--drop-enter-delay': `${enterDelay}ms`,
			}}
		/>
	);
}

export default function ProjectsPage() {
	const [cachedAtMount] = useState(() => getCachedProjectsPageData());
	const [projects, setProjects] = useState(cachedAtMount);

	useEffect(() => {
		let isActive = true;

		loadProjectsPageData().then((loadedProjects) => {
			if (isActive) setProjects(loadedProjects);
		});

		return () => {
			isActive = false;
		};
	}, []);

	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Projects</div>
				<div className="page-subtitle">things I&apos;ve built</div>
			</div>

			<div className="projects-page__grid">
				{projects === null ? (
					[362, 378, 340, 362].map((size, i) => <DropCardSkeleton key={i} size={size} enterDelay={i * 90} />)
				) : (
					projects.map((project, index) => (
						<DropCard
							key={project.id}
							title={project.title}
							desc={project.desc}
							tags={project.tags}
							iconImage={project.iconImage}
							size={project.size}
							featured={project.featured}
							gemColor={project.gemColor}
							className={project.className}
							enterDelay={index * 90}
							links={[
								...(project.link ? [{ label: 'Open Link', href: project.link }] : []),
							]}
						/>
					))
				)}
			</div>
		</div>
	);
}
