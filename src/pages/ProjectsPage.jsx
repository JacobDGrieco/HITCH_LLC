import { useEffect, useState } from 'react';
import '../styles/shared.css';
import '../styles/projects-page.css';
import DropCard from '../components/DropCard';

const FALLBACK = [
	{
		id: 'a.s.d',
		title: 'A.S.D',
		desc: 'Music promo platform with artist pages, album and song routes, admin tools, and Prisma-backed media workflows.',
		tags: ['React', 'Vercel', 'Prisma', 'REST APIs'],
		iconImage: '/projects/asd.png',
		live: 'https://www.asdrecords.net',
		gemColor: 'rgba(120,210,255,0.92)',
		size: 370,
		className: 'projects-page__crystal',
	},
	{
		id: 'staffing-tool',
		title: 'UK HealthCare Staffing Tool',
		desc: 'Full-stack scheduling system with week views, Gantt interactions, clinic templates, and PDF export workflows.',
		tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'SQLAlchemy'],
		iconImage: '/projects/staffingtool.png',
		github: 'https://github.com/Daratheon/Staffing-Tool-UK',
		live: 'https://staffing-tool-uk.onrender.com/',
		featured: true,
		gemColor: 'rgba(245,175,210,0.92)',
		size: 378,
		className: 'projects-page__crystal',
	},
	{
		id: 'pokemon',
		title: 'PokémonPGC',
		desc: 'Post-game checklist & Pokédex tracker across multiple titles. Migrated to React 18 with Prisma-backed sync.',
		tags: ['React', 'Node.js', 'Prisma', 'SQL'],
		iconImage: '/projects/ppgc.png',
		live: 'https://www.pokemonpgc.com/',
		gemColor: 'rgba(200,185,255,0.92)',
		size: 362,
		className: 'projects-page__crystal',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		desc: 'Relationship graph editor with a built-in timeline for tracking how nodes and connections evolve over time.',
		tags: ['React', 'JavaScript', 'Cytoscape.js', 'JSZip'],
		iconImage: '/projects/relatime.png',
		live: 'https://www.relatime.org/',
		featured: true,
		gemColor: 'rgba(175,220,255,0.92)',
		size: 340,
		className: 'projects-page__crystal',
	},
];

function DropCardSkeleton({ size = 340 }) {
	return (
		<div
			className="drop-card drop-card--skeleton"
			style={{
				'--drop-w': `${size}px`,
			}}
		/>
	);
}

export default function ProjectsPage() {
	const [projects, setProjects] = useState(null);

	useEffect(() => {
		fetch('/api/projects')
			.then((r) => {
				if (!r.ok) throw new Error(`Projects request failed with status ${r.status}`);
				return r.json();
			})
			.then(({ projects: data }) => setProjects(Array.isArray(data) && data.length ? data : FALLBACK))
			.catch(() => setProjects(FALLBACK));
	}, []);

	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Projects</div>
				<div className="page-subtitle">things I&apos;ve built</div>
			</div>

			<div className="projects-page__grid">
				{projects === null ? (
					[362, 378, 340, 362].map((size, i) => <DropCardSkeleton key={i} size={size} />)
				) : (
					projects.map((project) => (
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
							links={[
								...(project.github ? [{ label: 'GitHub →', href: project.github }] : []),
								...(project.live ? [{ label: 'Live Site →', href: project.live }] : []),
							]}
						/>
					))
				)}
			</div>
		</div>
	);
}
