import '../styles/shared.css';
import '../styles/projects-page.css';
import DropCard from '../components/DropCard';

const PROJECTS = [
	// {
	// 	id: 'halomed',
	// 	title: 'HaloMed',
	// 	desc: 'Healthcare brand site for wig consultations, service discovery, insurance support, and polished animated page transitions.',
	// 	tags: ['React', 'JavaScript', 'HTML & CSS', 'GSAP'],
	// 	iconImage: '/halomed.png',
	// 	live: 'https://halo-med.vercel.app/',
	// 	gemColor: 'rgba(245,210,125,0.92)',
	// 	size: 324,
	// 	className: 'projects-page__crystal',
	// },
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
		live: 'https://https://staffing-tool-uk.onrender.com/',
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

export default function ProjectsPage() {
	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Projects</div>
				<div className="page-subtitle">things I&apos;ve built</div>
			</div>

			<div className="projects-page__grid">
				{PROJECTS.map((project) => (
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
							{ label: 'GitHub →', href: project.github },
							...(project.live ? [{ label: 'Live Site →', href: project.live }] : []),
						]}
					/>
				))}
			</div>
		</div>
	);
}
