import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cloud from './Cloud';
import JacobBalloon from './JacobBalloon';
import SpeechBubble from './SpeechBubble';
import SkyScene from './SkyScene';
import { useSiteMusic } from '../audio/useSiteMusic';
import { useSiteChrome } from '../chrome/useSiteChrome';
import '../../styles/clouds-home.css';

const PAGE_CLOUDS = [
  { id: 'projects',   label: 'Projects',   route: '/projects'   },
  { id: 'about',      label: 'About',      route: '/about'      },
  { id: 'skills',     label: 'Skills',     route: '/skills'     },
  { id: 'education',  label: 'Education',  route: '/education'  },
  { id: 'contact',    label: 'Contact',    route: '/contact'    },
  { id: 'experience', label: 'Experience', route: '/experience' },
];

const PUFF_CFG = [
  { ox: 0, oy: 0, size: 70, delay: 0, dur: 600 },
  { ox: -25, oy: -10, size: 65, delay: 40, dur: 620 },
  { ox: 25, oy: -10, size: 65, delay: 40, dur: 620 },
  { ox: -45, oy: 15, size: 60, delay: 80, dur: 640 },
  { ox: 45, oy: 15, size: 60, delay: 80, dur: 640 },
  { ox: -20, oy: 30, size: 68, delay: 60, dur: 630 },
  { ox: 20, oy: 30, size: 68, delay: 60, dur: 630 },
  { ox: 0, oy: -28, size: 58, delay: 100, dur: 650 },
];

const SPARKLES = [
  { top: '28px', left: '68px', delay: '0s' },
  { top: '12px', left: '148px', delay: '0.7s' },
  { top: '32px', right: '72px', delay: '1.3s' },
  { top: '65px', left: '50px', delay: '1.8s' },
  { top: '10px', left: '195px', delay: '1.1s' },
  { top: '55px', right: '55px', delay: '0.4s' },
];

const FLUID_STOPS = {
  cloudScale: [[900, 0.55], [2400, 1]],
  heroScale: [[375, 0.45], [768, 0.7], [1600, 0.7], [2400, 1.25]],
  heroBottom: [[375, -4], [480, 0], [640, 2], [768, 4], [1600, 6], [2400, 8]],
};

function interpolateStops(width, stops) {
  if (width <= stops[0][0]) return stops[0][1];
  if (width >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];

  for (let i = 0; i < stops.length - 1; i += 1) {
    const [minWidth, minValue] = stops[i];
    const [maxWidth, maxValue] = stops[i + 1];

    if (width >= minWidth && width <= maxWidth) {
      const progress = (width - minWidth) / (maxWidth - minWidth);
      return minValue + (maxValue - minValue) * progress;
    }
  }

  return stops[stops.length - 1][1];
}

export default function CloudsHome() {
  const navigate = useNavigate();
  const { requestAutoplay } = useSiteMusic();
  const { setDasHidden } = useSiteChrome();
  const puffRefs = useRef([]);
  const expandRef = useRef(null);
  const [transitioning, setTransitioning] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [playIntro, setPlayIntro] = useState(() => {
    try {
      return window.sessionStorage.getItem('homeIntroSeen') !== 'true';
    } catch {
      return true;
    }
  });
  const [sceneReveal, setSceneReveal] = useState(() => !playIntro);

  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!playIntro) return;

    const revealTimer = window.setTimeout(() => {
      setSceneReveal(true);
    }, 2950);

    const timer = window.setTimeout(() => {
      setPlayIntro(false);
      try {
        window.sessionStorage.setItem('homeIntroSeen', 'true');
      } catch {
        // Ignore storage failures; intro replay is acceptable.
      }
    }, 3900);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(timer);
    };
  }, [playIntro]);

  useEffect(() => {
    if (!playIntro) {
      requestAutoplay();
    }
  }, [playIntro, requestAutoplay]);

  useEffect(() => {
    setDasHidden(playIntro || transitioning);

    return () => {
      setDasHidden(false);
    };
  }, [playIntro, setDasHidden, transitioning]);

  function replayIntro() {
    setSceneReveal(false);
    setPlayIntro(true);
    try {
      window.sessionStorage.removeItem('homeIntroSeen');
    } catch {
      // Ignore storage failures; replay still works for this render cycle.
    }
  }

  const fluidVars = useMemo(() => ({
    '--home-cloud-scale': interpolateStops(viewportWidth, FLUID_STOPS.cloudScale),
    '--home-hero-scale': interpolateStops(viewportWidth, FLUID_STOPS.heroScale),
    '--home-hero-bottom': `${interpolateStops(viewportWidth, FLUID_STOPS.heroBottom)}%`,
  }), [viewportWidth]);

  function handleCloudClick(route, e) {
    if (transitioning) return;
    setTransitioning(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const isMobile = window.innerWidth <= 640;
    const cx = isMobile ? window.innerWidth / 2 : rect.left + rect.width / 2;
    const cy = isMobile ? window.innerHeight * 0.46 : rect.top + rect.height / 2;

    e.currentTarget.style.opacity = '0';
    e.currentTarget.style.transition = 'opacity 0.2s';

    const stage = expandRef.current;
    stage.style.left = `${cx}px`;
    stage.style.top = `${cy}px`;

    const vw = window.innerWidth;

    puffRefs.current.forEach((el, i) => {
      if (!el) return;
      const cfg = PUFF_CFG[i];
      const sizePx = (cfg.size / 100) * vw * 2.2;
      el.style.width = `${sizePx}px`;
      el.style.height = `${sizePx}px`;
      el.style.left = `${(cfg.ox / 100) * vw}px`;
      el.style.top = `${(cfg.oy / 100) * vw}px`;
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0.04)';
      el.style.transition = 'none';

      setTimeout(() => {
        el.style.transition = `transform ${cfg.dur}ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease`;
        el.style.transform = 'translate(-50%, -50%) scale(1)';
        el.style.opacity = '1';
      }, cfg.delay);
    });

    setTimeout(() => navigate(route), 740);
  }

  return (
    <div className={`clouds-home${playIntro ? ' clouds-home--intro' : ''}${sceneReveal ? ' clouds-home--scene-reveal' : ''}`} style={fluidVars}>
      <div className="clouds-home__intro-ground-scene">
        <img src="/ground.png" alt="" className="clouds-home__intro-ground-image" />
      </div>
      <div className="clouds-home__intro-wash" />

      <div className="clouds-home__sky" />
      <SkyScene />
      <div className="clouds-home__haze" />
      <div className="clouds-home__horizon" />

      <div className="clouds-home__stage">
        <div className="clouds-home__left-zone">
          <div className="clouds-home__hero-cluster">
            <div className="clouds-home__hero-cluster-inner">
              <SpeechBubble />
              <JacobBalloon />

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

                <img src="/logo.png" alt="HeadInTheCloudsHaven" className="clouds-home__logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </div>
          </div>
        </div>

        <div className="clouds-home__right-zone">
          {PAGE_CLOUDS.map((cloud, index) => (
            <Cloud
              key={cloud.id}
              label={cloud.label}
              uid={cloud.id}
              floatIndex={index}
              onClick={(e) => handleCloudClick(cloud.route, e)}
            />
          ))}
        </div>
      </div>

      <div className="clouds-home__header">
        <div className="clouds-home__hint">Click a cloud to explore</div>
        <button type="button" className="clouds-home__replay" onClick={replayIntro}>
          Replay Intro
        </button>
      </div>

      <div ref={expandRef} className="clouds-home__expand">
        {PUFF_CFG.map((_, i) => (
          <div key={i} ref={(el) => { puffRefs.current[i] = el; }} className="clouds-home__expand-puff" />
        ))}
      </div>
    </div>
  );
}
