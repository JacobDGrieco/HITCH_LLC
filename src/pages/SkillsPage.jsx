import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import '../styles/shared.css'
import '../styles/skills-page.css'

const SKILLS = {
  Frontend: {
    accent: 'rgba(80,130,200,0.9)',
    items: [
      { name: 'React / React 19', level: 90 },
      { name: 'JavaScript / ES2024', level: 88 },
      { name: 'HTML & CSS', level: 92 },
      { name: 'Tailwind CSS', level: 82 },
      { name: 'GSAP Animations', level: 78 },
      { name: 'Vite / Webpack', level: 75 },
    ],
  },
  Backend: {
    accent: 'rgba(120,80,200,0.9)',
    items: [
      { name: 'FastAPI / Python', level: 85 },
      { name: 'Node.js / Express', level: 80 },
      { name: 'SQL / PostgreSQL', level: 82 },
      { name: 'SQLAlchemy / Prisma', level: 78 },
      { name: 'REST API Design', level: 85 },
      { name: 'JWT / Auth', level: 75 },
    ],
  },
  Tools: {
    accent: 'rgba(170,80,140,0.9)',
    items: [
      { name: 'Git / GitHub', level: 90 },
      { name: 'Docker', level: 68 },
      { name: 'Vercel / Deployment', level: 80 },
      { name: 'Java', level: 72 },
      { name: 'C / C++', level: 65 },
      { name: 'PHP', level: 60 },
    ],
  },
}

function accentSoft(accent) {
  return accent.replace(/0\.9\)/g, '0.55)')
}

function SkillBar({ skill, accent, delay }) {
  const barRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(barRef.current, { width: '0%' }, { width: `${skill.level}%`, duration: 1.0, delay, ease: 'power2.out' })
  }, [skill.level, delay])

  return (
    <div className="skill-bar">
      <div className="skill-bar__meta">
        <span className="skill-bar__name">{skill.name}</span>
        <span className="skill-bar__value">{skill.level}%</span>
      </div>
      <div className="skill-bar__track">
        <div ref={barRef} className="skill-bar__fill" style={{ '--accent': accent, '--accent-soft': accentSoft(accent) }} />
      </div>
    </div>
  )
}

function SkillColumn({ category, data, colIndex }) {
  const colRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(colRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: colIndex * 0.12, ease: 'power2.out' })
  }, [colIndex])

  return (
    <div
      ref={colRef}
      className="skill-column glass-card"
      style={{ '--accent': data.accent, '--accent-border': `${data.accent.slice(0, -1)}30)`, '--accent-soft': accentSoft(data.accent) }}
    >
      <div className="skill-column__title">{category}</div>
      {data.items.map((skill, i) => (
        <SkillBar key={skill.name} skill={skill} accent={data.accent} delay={colIndex * 0.12 + i * 0.08} />
      ))}
    </div>
  )
}

export default function SkillsPage() {
  return (
    <div className="page-section">
      <div className="page-header">
        <div className="page-title">Skills</div>
        <div className="page-subtitle">what I work with</div>
      </div>
      <div className="skills-page__grid">
        {Object.entries(SKILLS).map(([category, data], i) => (
          <SkillColumn key={category} category={category} data={data} colIndex={i} />
        ))}
      </div>
    </div>
  )
}
