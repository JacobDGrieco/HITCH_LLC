import '../styles/drop-card.css';

export default function DropCard({
  title,
  desc,
  tags = [],
  icon,
  iconImage,
  links = [],
  className = '',
  size = 220,
  gemColor = 'rgba(200, 185, 255, 0.92)',
  featured = false,
}) {
  const fillGradient = gemColor
    ? `linear-gradient(175deg, rgba(240, 252, 255, 0.92) 0%, rgba(215, 240, 255, 0.88) 22%, ${gemColor.replace(/[\d.]+\)$/, '0.7)')} 55%, ${gemColor.replace(/[\d.]+\)$/, '0.88)')} 100%)`
    : 'linear-gradient(175deg, rgba(240, 252, 255, 0.92) 0%, rgba(215, 240, 255, 0.88) 22%, rgba(165, 215, 250, 0.70) 55%, rgba(140, 200, 245, 0.88) 100%)';

  return (
    <div
      className={`drop-card${className ? ` ${className}` : ''}`}
      style={{
        '--drop-w': `${size}px`,
        '--drop-fill-gradient': fillGradient,
        '--drop-float-duration': `${featured ? 6 : 5}s`,
        '--drop-float-delay': featured ? '-1.8s' : '0s',
        '--drop-filter': `drop-shadow(0 ${featured ? 16 : 12}px ${featured ? 36 : 28}px rgba(160, 200, 240, ${featured ? 0.55 : 0.45})) drop-shadow(0 4px 10px rgba(140, 180, 230, 0.3))`,
      }}
    >
      <div className="drop-card__shape">
        <div className="drop-card__fill" />
        <div className="drop-card__gloss" />
        <div className="drop-card__inner-shadow" />

        <div className="drop-card__content">
          {iconImage ? (
            <img src={iconImage} alt="" width="82" height="82" loading="lazy" className="drop-card__icon-image" />
          ) : icon ? (
            <div className="drop-card__icon">{icon}</div>
          ) : null}

          {title ? <div className="drop-card__title">{title}</div> : null}
          {desc ? <div className="drop-card__desc">{desc}</div> : null}

          {tags.length ? (
            <div className="drop-card__tags">
              {tags.map((tag) => (
                <span key={tag} className="drop-card__tag">{tag}</span>
              ))}
            </div>
          ) : null}

          {links.length ? (
            <div className="drop-card__links">
              {links.map((link) => (
                <a
                  key={`${title}-${link.label}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="drop-card__link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
