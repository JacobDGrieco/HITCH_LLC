import '../styles/shared.css'
import '../styles/projects-page.css'

const PROJECTS = [
  {
    id: 'staffing-tool',
    title: 'UK HealthCare Staffing Tool',
    desc: 'Full-stack scheduling system with week views, Gantt interactions, clinic templates, and PDF export workflows.',
    tags: ['React', 'FastAPI', 'PostgreSQL', 'PrimeReact'],
    icon: '☁',
    github: 'https://github.com/JacobDGrieco',
    live: null,
    featured: true,
    gemColor: 'rgba(245,175,210,0.92)',
  },
  {
    id: 'nimbus-player',
    title: 'NimbusPlayer',
    desc: 'Personal media app with entity tagging, modal playback, metadata tools, and Cloudflare-hosted asset support.',
    tags: ['React', 'Node.js', 'Vite', 'Media Tooling'],
    icon: '✦',
    github: 'https://github.com/JacobDGrieco',
    live: null,
    featured: true,
    gemColor: 'rgba(175,220,255,0.92)',
  },
  {
    id: 'pokemon',
    title: 'PokémonPGC',
    desc: 'Post-game checklist & Pokédex tracker across multiple titles. Migrated to React 18 with Prisma-backed sync.',
    tags: ['React 18', 'Vite', 'Prisma ORM', 'Node.js'],
    icon: '🎮',
    github: 'https://github.com/JacobDGrieco',
    live: null,
    gemColor: 'rgba(200,185,255,0.92)',
  },
]

function CrystalCard({ project, size = 200 }) {
  const faceGradient = project.gemColor
    ? `linear-gradient(160deg, rgba(230,248,255,0.98) 0%, rgba(200,235,255,0.95) 18%, ${project.gemColor} 34%, ${project.gemColor} 66%, rgba(200,235,255,0.95) 80%, rgba(230,248,255,0.97) 100%)`
    : 'linear-gradient(160deg, rgba(230,248,255,0.98) 0%, rgba(200,235,255,0.95) 18%, rgba(165,215,250,0.92) 34%, rgba(140,200,245,0.9) 50%, rgba(160,210,250,0.92) 66%, rgba(200,232,255,0.95) 80%, rgba(225,245,255,0.97) 100%)'

  const featured = project.featured

  return (
    <div
      className="crystal-card"
      style={{
        '--crystal-size': `${size}px`,
        '--face-gradient': faceGradient,
        '--crystal-float-duration': `${featured ? 6 : 5}s`,
        '--crystal-float-delay': featured ? '-1.8s' : '0s',
        '--crystal-filter': `drop-shadow(0 ${featured ? 16 : 12}px ${featured ? 36 : 28}px rgba(160,200,240,${featured ? 0.55 : 0.45})) drop-shadow(0 4px 10px rgba(140,180,230,0.3))`,
        '--glare-duration': `${featured ? 3 : 4}s`,
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
          <div className="crystal-card__icon">{project.icon}</div>
          <div className="crystal-card__title">{project.title}</div>
          <div className="crystal-card__desc">{project.desc}</div>
          <div className="crystal-card__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="crystal-card__tag">{tag}</span>
            ))}
          </div>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="crystal-card__link">
            View →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="page-section">
      <div className="page-header">
        <div className="page-title">Projects</div>
        <div className="page-subtitle">things I&apos;ve built</div>
      </div>

      <div className="projects-page__grid">
        <CrystalCard project={PROJECTS[0]} size={200} />
        <CrystalCard project={PROJECTS[1]} size={220} />
        <CrystalCard project={PROJECTS[2]} size={200} />
      </div>
    </div>
  )
}
