import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import OrbitalRings from './OrbitalRings'
import Nucleus from './Nucleus'
import Electron from './Electron'
import '../../styles/atom-home.css'

const ELECTRONS = [
  { id: 'projects', label: 'Projects', route: '/projects', rx: 230, ry: 70, tilt: -20, speed: 35, glowDelay: '0s' },
  { id: 'skills', label: 'Skills', route: '/skills', rx: 180, ry: 110, tilt: 45, speed: 42, glowDelay: '-0.8s' },
  { id: 'education', label: 'Education', route: '/education', rx: 250, ry: 55, tilt: 15, speed: 28, glowDelay: '-1.6s' },
  { id: 'experience', label: 'Experience', route: '/experience', rx: 140, ry: 130, tilt: -50, speed: 50, glowDelay: '-2.4s' },
  { id: 'contact', label: 'Contact', route: '/contact', rx: 200, ry: 90, tilt: 70, speed: 38, glowDelay: '-3.2s' },
]

function ellipsePos(rx, ry, tiltDeg, theta) {
  const tilt = (tiltDeg * Math.PI) / 180
  const localX = rx * Math.cos(theta)
  const localY = ry * Math.sin(theta)
  const x = localX * Math.cos(tilt) - localY * Math.sin(tilt)
  const y = localX * Math.sin(tilt) + localY * Math.cos(tilt)
  return { x, y, behind: y > 0 }
}

export default function AtomHome() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const anglesRef = useRef(ELECTRONS.map((_, i) => (i * Math.PI * 2) / ELECTRONS.length))
  const rafRef = useRef(null)
  const runningRef = useRef(true)
  const [positions, setPositions] = useState(() => ELECTRONS.map((e, i) => ellipsePos(e.rx, e.ry, e.tilt, anglesRef.current[i])))
  const [hoveredId, setHoveredId] = useState(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    runningRef.current = true
    let last = performance.now()

    function tick(now) {
      if (!runningRef.current) return
      const dt = (now - last) / 1000
      last = now
      anglesRef.current = anglesRef.current.map((a, i) => a + (Math.PI * 2) / ELECTRONS[i].speed * dt)
      setPositions(anglesRef.current.map((a, i) => ellipsePos(ELECTRONS[i].rx, ELECTRONS[i].ry, ELECTRONS[i].tilt, a)))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    const hintTimer = setTimeout(() => setShowHint(true), 1800)

    return () => {
      runningRef.current = false
      cancelAnimationFrame(rafRef.current)
      clearTimeout(hintTimer)
    }
  }, [])

  const handleElectronClick = useCallback((electron, posIndex) => {
    runningRef.current = false
    cancelAnimationFrame(rafRef.current)

    const pos = positions[posIndex]
    const container = containerRef.current
    if (!container) {
      navigate(electron.route)
      return
    }

    const rect = container.getBoundingClientRect()
    const cx = rect.width / 2 + pos.x
    const cy = rect.height / 2 + pos.y

    const circle = document.createElement('div')
    circle.style.cssText = `
      position:fixed; border-radius:50%; pointer-events:none; z-index:50;
      background: radial-gradient(circle, rgba(42,111,255,0.9) 0%, rgba(10,10,20,1) 70%);
      width:60px; height:60px;
      left:${cx + rect.left - 30}px; top:${cy + rect.top - 30}px;
      transform:scale(1);
    `
    document.body.appendChild(circle)

    gsap.to(circle, {
      duration: 0.7,
      scale: 60,
      ease: 'power2.in',
      onComplete: () => {
        navigate(electron.route)
        circle.remove()
      },
    })

    gsap.to(container, { opacity: 0, duration: 0.4, delay: 0.3 })
  }, [positions, navigate])

  return (
    <div ref={containerRef} className="atom-home">
      <div className="atom-home__wordmark">
        <img src="/logo.png" alt="HITCHLLC" />
      </div>

      <div className="atom-home__stage">
        <OrbitalRings electrons={ELECTRONS} hoveredId={hoveredId} />
        <Nucleus />
        {ELECTRONS.map((e, i) => (
          <Electron
            key={e.id}
            electron={e}
            pos={positions[i]}
            hovered={hoveredId === e.id}
            anyHovered={hoveredId !== null}
            onClick={() => handleElectronClick(e, i)}
            onEnter={() => setHoveredId(e.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>

      <div className="atom-home__hint" style={{ opacity: showHint ? 1 : 0 }}>
        click an electron to explore
      </div>
    </div>
  )
}
