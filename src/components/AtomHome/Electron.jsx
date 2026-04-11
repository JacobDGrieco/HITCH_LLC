export default function Electron({ electron, pos, hovered, anyHovered, onClick, onEnter, onLeave }) {
  const opacity = anyHovered ? (hovered ? 1.0 : 0.35) : (pos.behind ? 0.65 : 1.0)
  const scale = hovered ? 1.18 : 1.0

  return (
    <div
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="atom-electron"
      style={{
        '--x': `${pos.x}px`,
        '--y': `${pos.y}px`,
        '--scale': scale,
        '--z': pos.behind ? 3 : 7,
        '--opacity': opacity,
        '--label-color': hovered ? 'var(--accent-blue, rgba(100,200,255,0.95))' : 'var(--text-secondary, rgba(255,255,255,0.8))',
        '--label-shadow': hovered ? '0 0 12px rgba(100,200,255,0.8)' : 'none',
        '--sphere-shadow': hovered ? '0 0 24px rgba(100,200,255,0.9), 0 0 56px rgba(42,111,255,0.6)' : 'none',
        '--glow-delay': electron.glowDelay || '0s',
      }}
    >
      <div className="atom-electron__sphere" />
      <div className="atom-electron__label">{electron.label}</div>
    </div>
  )
}
