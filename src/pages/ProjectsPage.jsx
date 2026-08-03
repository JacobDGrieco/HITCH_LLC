import { useEffect, useState } from 'react';
import '../styles/shared.css';
import '../styles/projects-page.css';
import DropCard from '../components/DropCard';

const FALLBACK = [
	{
		id: 'asd',
		title: 'ASD',
		desc: 'Music promo platform with artist pages, album and song routes, admin tools, and Prisma-backed media workflows.',
		tags: ['React', 'Vercel', 'Prisma', 'REST APIs'],
		iconImage: '/asd.png',
		live: 'https://www.asdrecords.net',
		gemColor: 'rgba(120,210,255,0.92)',
		size: 328,
		className: 'projects-page__crystal',
	},
	{
		id: 'staffing-tool',
		title: 'UK HealthCare Staffing Tool',
		desc: 'Full-stack scheduling system with week views, Gantt interactions, clinic templates, and PDF export workflows.',
		tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'SQLAlchemy'],
		iconImage: '/staffingtool.png',
		github: 'https://github.com/Daratheon/Staffing-Tool-UK',
		live: 'https://staffing-tool-uk.onrender.com/',
		featured: true,
		gemColor: 'rgba(245,175,210,0.92)',
		size: 334,
		className: 'projects-page__crystal',
	},
	{
		id: 'pokemon',
		title: 'PokémonPGC',
		desc: 'Post-game checklist & Pokédex tracker across multiple titles. Migrated to React 18 with Prisma-backed sync.',
		tags: ['React', 'Node.js', 'Prisma', 'SQL'],
		iconImage: '/ppgc.png',
		live: 'https://www.pokemonpgc.com/',
		gemColor: 'rgba(200,185,255,0.92)',
		size: 320,
		className: 'projects-page__crystal',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		desc: 'Relationship graph editor with a built-in timeline for tracking how nodes and connections evolve over time.',
		tags: ['React', 'JavaScript', 'Cytoscape.js', 'JSZip'],
		iconImage: '/relatime.png',
		live: 'https://www.relatime.org/',
		featured: true,
		gemColor: 'rgba(175,220,255,0.92)',
		size: 300,
		className: 'projects-page__crystal',
	},
];

function DropCardSkeleton({ size = 300 }) {
	return (
		<div
			style={{
				width: size,
				height: size * 1.3,
				borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
				background: 'rgba(210, 185, 200, 0.18)',
				animation: 'pulse 1.6s ease-in-out infinite',
				flexShrink: 0,
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
					[320, 334, 300, 320].map((size, i) => <DropCardSkeleton key={i} size={size} />)
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
