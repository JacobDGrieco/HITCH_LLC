import '../styles/shared.css';
import '../styles/projects-page.css';

const PROJECTS = [
	{
		id: 'staffing-tool',
		title: 'UK HealthCare Staffing Tool',
		desc: 'Full-stack scheduling system with week views, Gantt interactions, clinic templates, and PDF export workflows.',
		tags: ['React', 'FastAPI', 'PostgreSQL', 'PrimeReact'],
		iconImage: '/staffingtool.png',
		github: 'https://github.com/Daratheon/Staffing-Tool-UK',
		live: 'https://gaminglegion001.taile3eaea.ts.net/',
		live: null,
		featured: true,
		gemColor: 'rgba(245,175,210,0.92)',
	},
	{
		id: 'pokemon',
		title: 'PokémonPGC',
		desc: 'Post-game checklist & Pokédex tracker across multiple titles. Migrated to React 18 with Prisma-backed sync.',
		tags: ['React 18', 'Vite', 'Prisma ORM', 'Node.js'],
		iconImage: '/ppgc.png',
		github: 'https://github.com/JacobDGrieco/PokemonPGC_v2',
		live: 'https://rela-time-timeline-tool.vercel.app/',
		live: null,
		gemColor: 'rgba(200,185,255,0.92)',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		desc: 'Relationship graph editor with a built-in timeline for tracking how nodes and connections evolve over time.',
		tags: ['React 19', 'Vite', 'Cytoscape.js', 'JSZip'],
		iconImage: '/relatime.png',
		github: 'https://github.com/JacobDGrieco/RelaTime',
		live: 'https://ppgc-delta.vercel.app/',
		live: null,
		featured: true,
		gemColor: 'rgba(175,220,255,0.92)',
	},
];

function CrystalCard({ project, size = 200 }) {
	const faceGradient = project.gemColor
		? `linear-gradient(160deg, rgba(230,248,255,0.98) 0%, rgba(200,235,255,0.95) 18%, ${project.gemColor} 34%, ${project.gemColor} 66%, rgba(200,235,255,0.95) 80%, rgba(230,248,255,0.97) 100%)`
		: 'linear-gradient(160deg, rgba(230,248,255,0.98) 0%, rgba(200,235,255,0.95) 18%, rgba(165,215,250,0.92) 34%, rgba(140,200,245,0.9) 50%, rgba(160,210,250,0.92) 66%, rgba(200,232,255,0.95) 80%, rgba(225,245,255,0.97) 100%)';

	const featured = project.featured;

	return (
		<div
			className="crystal-card"
			style={{
				'--crystal-size': `${size}px`,
				'--face-gradient': faceGradient,
				'--crystal-float-duration': `${featured ? 6 : 5}s`,
				'--crystal-float-delay': featured ? '-1.8s' : '0s',
				'--crystal-filter': `drop-shadow(0 ${featured ? 16 : 12}px ${featured ? 36 : 28}px rgba(160,200,240,${featured ? 0.55 : 0.45})) drop-shadow(0 4px 10px rgba(140,180,230,0.3))`,
				'--glare-duration': `${featured ? 60 : 70}s`,
				'--glare-delay': featured ? '-1s' : '0s',
				'--cap-width': `${Math.round(size * 0.15)}px`,
				'--cap-height': `${Math.round(size * 0.1)}px`,
			}}
		>
			<div className="crystal-card__shape">
				<div className="crystal-card__face" />
				<div className="crystal-card__facets" />
				<div className="crystal-card__depth" />
				<div className="crystal-card__glare" />
				<div className="crystal-card__cap" />

				<div className="crystal-card__content">
					{project.iconImage ? (
						<img src={project.iconImage} alt="" className="crystal-card__icon-image" />
					) : (
						<div className="crystal-card__icon">{project.icon}</div>
					)}
					<div className="crystal-card__title">{project.title}</div>
					<div className="crystal-card__desc">{project.desc}</div>
					<div className="crystal-card__tags">
						{project.tags.map((tag) => (
							<span key={tag} className="crystal-card__tag">{tag}</span>
						))}
					</div>
					<div className="crystal-card__links">
						<a href={project.github} target="_blank" rel="noopener noreferrer" className="crystal-card__link">
							GitHub →
						</a>
						<a href={project.live} target="_blank" rel="noopener noreferrer" className="crystal-card__link">
							Live Site →
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function ProjectsPage() {
	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Projects</div>
				<div className="page-subtitle">things I&apos;ve built</div>
			</div>

			<div className="projects-page__grid">
				<CrystalCard project={PROJECTS[0]} size={300} />
				<CrystalCard project={PROJECTS[1]} size={320} />
				<CrystalCard project={PROJECTS[2]} size={300} />
			</div>
		</div>
	);
}
