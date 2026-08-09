// Legacy crystal card component retained until dead-code cleanup removes the old visual system.
import '../styles/crystal-card.css'

export default function CrystalCard({
  title,
  desc,
  tags = [],
  icon,
  iconImage,
  links = [],
  className = '',
  size = 220,
  gemColor = 'rgba(200,185,255,0.92)',
  featured = false,
}) {
  const faceGradient = gemColor
    ? `linear-gradient(160deg, rgba(230,248,255,0.98) 0%, rgba(200,235,255,0.95) 18%, ${gemColor} 34%, ${gemColor} 66%, rgba(200,235,255,0.95) 80%, rgba(230,248,255,0.97) 100%)`
    : 'linear-gradient(160deg, rgba(230,248,255,0.98) 0%, rgba(200,235,255,0.95) 18%, rgba(165,215,250,0.92) 34%, rgba(140,200,245,0.9) 50%, rgba(160,210,250,0.92) 66%, rgba(200,232,255,0.95) 80%, rgba(225,245,255,0.97) 100%)'

  return (
    <div
      className={`crystal-card${className ? ` ${className}` : ''}`}
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
          {iconImage ? (
            <img src={iconImage} alt="" width="82" height="82" loading="lazy" className="crystal-card__icon-image" />
          ) : icon ? (
            <div className="crystal-card__icon">{icon}</div>
          ) : null}

          {title ? <div className="crystal-card__title">{title}</div> : null}
          {desc ? <div className="crystal-card__desc">{desc}</div> : null}

          {tags.length ? (
            <div className="crystal-card__tags">
              {tags.map((tag) => (
                <span key={tag} className="crystal-card__tag">{tag}</span>
              ))}
            </div>
          ) : null}

          {links.length ? (
            <div className="crystal-card__links">
              {links.map((link) => (
                <a
                  key={`${title}-${link.label}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crystal-card__link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
