import '../styles/shared.css';
import '../styles/projects-page.css';
import CrystalCard from '../components/CrystalCard';

const PROJECTS = [
	{
		id: 'staffing-tool',
		title: 'UK HealthCare Staffing Tool',
		desc: 'Full-stack scheduling system with week views, Gantt interactions, clinic templates, and PDF export workflows.',
		tags: ['React', 'FastAPI', 'PostgreSQL', 'PrimeReact'],
		iconImage: '/staffingtool.png',
		github: 'https://github.com/Daratheon/Staffing-Tool-UK',
		live: 'https://gaminglegion001.taile3eaea.ts.net/',
		featured: true,
		gemColor: 'rgba(245,175,210,0.92)',
		size: 334,
		className: 'projects-page__crystal',
	},
	{
		id: 'pokemon',
		title: 'PokémonPGC',
		desc: 'Post-game checklist & Pokédex tracker across multiple titles. Migrated to React 18 with Prisma-backed sync.',
		tags: ['React 18', 'Vite', 'Prisma ORM', 'Node.js'],
		iconImage: '/ppgc.png',
		github: 'https://github.com/JacobDGrieco/PokemonPGC_v2',
		live: 'https://ppgc-delta.vercel.app/',
		gemColor: 'rgba(200,185,255,0.92)',
		size: 320,
		className: 'projects-page__crystal',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		desc: 'Relationship graph editor with a built-in timeline for tracking how nodes and connections evolve over time.',
		tags: ['React 19', 'Vite', 'Cytoscape.js', 'JSZip'],
		iconImage: '/relatime.png',
		github: 'https://github.com/JacobDGrieco/RelaTime',
		live: 'https://rela-time-timeline-tool.vercel.app/',
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
					<CrystalCard
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
