import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import '../styles/shared.css'
import '../styles/education-page.css'

const COURSEWORK = [
  'Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks',
  'Database Systems', 'Software Engineering', 'Cybersecurity Fundamentals',
  'Machine Learning', 'Linear Algebra', 'Discrete Math',
]

const CERTIFICATIONS = [
  { title: 'AI Fundamentals', issuer: 'Certificate Program', accent: 'rgba(80,130,200,0.8)', icon: '✦' },
  { title: 'Cybersecurity', issuer: 'Certificate Program', accent: 'rgba(150,80,190,0.8)', icon: '⬡' },
]

function softAccent(accent) {
  return accent.replace('0.8', '0.1')
}

function borderAccent(accent) {
  return accent.replace('0.8', '0.3')
}

export default function EducationPage() {
  const degreeRef = useRef(null)
  const certsRef = useRef(null)
  const courseRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(degreeRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    gsap.fromTo(certsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' })
    gsap.fromTo(courseRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.28, ease: 'power2.out' })
  }, [])

  return (
    <div className="page-section page-section--narrow">
      <div className="page-header">
        <div className="page-title">Education</div>
        <div className="page-subtitle">academic background</div>
      </div>

      <div ref={degreeRef} className="education-page__degree glass-card">
        <div className="education-page__degree-top">
          <div>
            <div className="education-page__school">University of Kentucky</div>
            <div className="education-page__degree-name">B.S. Computer Science</div>
            <div className="education-page__minor">Minor: Mathematics</div>
          </div>
          <div className="education-page__date">May 2026</div>
        </div>
      </div>

      <div ref={certsRef} className="education-page__certs">
        {CERTIFICATIONS.map((cert) => (
          <div key={cert.title} className="education-page__cert glass-card">
            <div
              className="education-page__cert-icon"
              style={{ '--accent': cert.accent, '--accent-soft-bg': softAccent(cert.accent), '--accent-border': borderAccent(cert.accent) }}
            >
              {cert.icon}
            </div>
            <div>
              <div className="education-page__cert-title">{cert.title}</div>
              <div className="education-page__cert-issuer">{cert.issuer}</div>
            </div>
          </div>
        ))}
      </div>

      <div ref={courseRef} className="education-page__coursework">
        <div className="education-page__coursework-title">Relevant Coursework</div>
        <div className="education-page__coursework-list">
          {COURSEWORK.map((course) => (
            <span key={course} className="education-page__coursework-chip">{course}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
