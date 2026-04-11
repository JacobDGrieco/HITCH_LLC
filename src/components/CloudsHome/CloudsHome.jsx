import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cloud from './Cloud'
import JacobBalloon from './JacobBalloon'
import '../../styles/clouds-home.css'

const PAGE_CLOUDS = [
  { id: 'projects', label: 'Projects', route: '/projects', style: { top: '9%', left: '13%', animation: 'cloudFloatA 7.5s ease-in-out infinite' } },
  { id: 'skills', label: 'Skills', route: '/skills', style: { top: '9%', right: '14%', animation: 'cloudFloatB 9s ease-in-out infinite' } },
  { id: 'about', label: 'About', route: '/about', style: { top: '38%', left: '10%', animation: 'cloudFloatF 8.5s ease-in-out infinite' } },
  { id: 'contact', label: 'Contact', route: '/contact', style: { top: '38%', right: '10%', animation: 'cloudFloatE 8s ease-in-out infinite' } },
  { id: 'education', label: 'Education', route: '/education', style: { top: '66%', left: '13%', animation: 'cloudFloatC 6.5s ease-in-out infinite' } },
  { id: 'experience', label: 'Experience', route: '/experience', style: { top: '66%', right: '14%', animation: 'cloudFloatD 10s ease-in-out infinite' } },
]

const PUFF_CFG = [
  { ox: 0, oy: 0, size: 70, delay: 0, dur: 600 },
  { ox: -25, oy: -10, size: 65, delay: 40, dur: 620 },
  { ox: 25, oy: -10, size: 65, delay: 40, dur: 620 },
  { ox: -45, oy: 15, size: 60, delay: 80, dur: 640 },
  { ox: 45, oy: 15, size: 60, delay: 80, dur: 640 },
  { ox: -20, oy: 30, size: 68, delay: 60, dur: 630 },
  { ox: 20, oy: 30, size: 68, delay: 60, dur: 630 },
  { ox: 0, oy: -28, size: 58, delay: 100, dur: 650 },
]

const BG_CLOUDS = [
  { w: '155px', h: '52px', top: '18%', left: '1%', opacity: 0.65 },
  { w: '105px', h: '36px', top: '14%', left: '24%', opacity: 0.5 },
  { w: '180px', h: '62px', top: '12%', right: '14%', opacity: 0.6 },
  { w: '92px', h: '31px', top: '24%', right: '2%', opacity: 0.48 },
  { w: '70px', h: '24px', top: '8%', left: '50%', opacity: 0.38 },
  { w: '120px', h: '40px', top: '30%', left: '36%', opacity: 0.3 },
]

const SPARKLES = [
  { top: '28px', left: '68px', delay: '0s' },
  { top: '12px', left: '148px', delay: '0.7s' },
  { top: '32px', right: '72px', delay: '1.3s' },
  { top: '65px', left: '50px', delay: '1.8s' },
  { top: '10px', left: '195px', delay: '1.1s' },
  { top: '55px', right: '55px', delay: '0.4s' },
]

export default function CloudsHome() {
  const navigate = useNavigate()
  const puffRefs = useRef([])
  const expandRef = useRef(null)
  const [transitioning, setTransitioning] = useState(false)

  function handleCloudClick(route, e) {
    if (transitioning) return
    setTransitioning(true)

    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    e.currentTarget.style.opacity = '0'
    e.currentTarget.style.transition = 'opacity 0.2s'

    const stage = expandRef.current
    stage.style.left = `${cx}px`
    stage.style.top = `${cy}px`

    const vw = window.innerWidth

    puffRefs.current.forEach((el, i) => {
      if (!el) return
      const cfg = PUFF_CFG[i]
      const sizePx = (cfg.size / 100) * vw * 2.2
      el.style.width = `${sizePx}px`
      el.style.height = `${sizePx}px`
      el.style.left = `${(cfg.ox / 100) * vw}px`
      el.style.top = `${(cfg.oy / 100) * vw}px`
      el.style.opacity = '0'
      el.style.transform = 'translate(-50%, -50%) scale(0.04)'
      el.style.transition = 'none'

      setTimeout(() => {
        el.style.transition = `transform ${cfg.dur}ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease`
        el.style.transform = 'translate(-50%, -50%) scale(1)'
        el.style.opacity = '1'
      }, cfg.delay)
    })

    setTimeout(() => navigate(route), 740)
  }

  return (
    <>
      <div className="clouds-home__sky" />
      <div className="clouds-home__haze" />

      <div className="clouds-home__sun-wrap">
        <div className="clouds-home__sun" />
      </div>

      <div className="clouds-home__bg-clouds">
        {BG_CLOUDS.map((cloud, i) => (
          <div
            key={i}
            className="clouds-home__bg-cloud"
            style={{
              '--w': cloud.w,
              '--h': cloud.h,
              '--top': cloud.top,
              '--left': cloud.left,
              '--right': cloud.right,
              '--opacity': cloud.opacity,
            }}
          />
        ))}
      </div>

      <div className="clouds-home__horizon" />

      <div className="clouds-home__stage">
        {PAGE_CLOUDS.map((cloud) => (
          <Cloud key={cloud.id} label={cloud.label} style={cloud.style} onClick={(e) => handleCloudClick(cloud.route, e)} />
        ))}

        <div className="clouds-home__logo-cloud">
          {SPARKLES.map((sparkle, i) => (
            <div
              key={i}
              className="clouds-home__sparkle"
              style={{
                '--sparkle-top': sparkle.top,
                '--sparkle-left': sparkle.left,
                '--sparkle-right': sparkle.right,
                '--sparkle-delay': sparkle.delay,
              }}
            >
              <div className="clouds-home__sparkle-shape">
                <div className="clouds-home__sparkle-v" />
                <div className="clouds-home__sparkle-h" />
              </div>
            </div>
          ))}

          <img src="/logo.png" alt="HeadInTheCloudsHaven" className="clouds-home__logo" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>

        <JacobBalloon />
      </div>

      <div ref={expandRef} className="clouds-home__expand">
        {PUFF_CFG.map((_, i) => (
          <div key={i} ref={(el) => { puffRefs.current[i] = el }} className="clouds-home__expand-puff" />
        ))}
      </div>

      <div className="clouds-home__hint">✦ Click a cloud to explore ✦</div>
    </>
  )
}
