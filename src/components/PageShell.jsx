import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/page-shell.css'

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

export default function PageShell({ children, section = 'default' }) {
  const navigate = useNavigate()
  const puffRefs = useRef([])
  const expandRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
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
      el.style.opacity = '1'
      el.style.transform = 'translate(-50%, -50%) scale(1)'
    })

    const t1 = setTimeout(() => setVisible(true), 50)
    const t2 = setTimeout(() => setContentVisible(true), 200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  function handleBack() {
    setContentVisible(false)
    setTimeout(() => {
      setVisible(false)
      puffRefs.current.forEach((el, i) => {
        if (!el) return
        el.style.transition = 'transform 550ms cubic-bezier(0.64,0,0.78,0), opacity 350ms ease 200ms'
        el.style.transform = 'translate(-50%, -50%) scale(0.04)'
        el.style.opacity = '0'
      })
      setTimeout(() => navigate('/'), 560)
    }, 300)
  }

  return (
    <>
      <div className={`page-shell__sky page-shell__sky--${section}`} />

      <div ref={expandRef} className="page-shell__expand">
        {PUFF_CFG.map((_, i) => (
          <div key={i} ref={(el) => { puffRefs.current[i] = el }} className="page-shell__expand-puff" />
        ))}
      </div>

      <div className={`page-shell__overlay page-shell__overlay--${section} ${visible ? 'page-shell__overlay--visible' : 'page-shell__overlay--hidden'}`}>
        <div className="page-shell__wisps" />

        <button onClick={handleBack} className="page-shell__back">
          ☁ ← Back to sky
        </button>

        <div className={`page-shell__content ${contentVisible ? 'page-shell__content--visible' : 'page-shell__content--hidden'}`}>
          {children}
        </div>
      </div>
    </>
  )
}
