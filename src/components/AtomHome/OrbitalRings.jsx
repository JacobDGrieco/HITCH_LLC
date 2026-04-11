export default function OrbitalRings({ electrons, hoveredId }) {
  return (
    <svg className="atom-home__ring-svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet">
      {electrons.map((e) => {
        const cx = 400
        const cy = 400
        const hovered = hoveredId === e.id
        return (
          <ellipse
            key={e.id}
            className="atom-home__ring"
            cx={cx}
            cy={cy}
            rx={e.rx}
            ry={e.ry}
            fill="none"
            stroke={hovered ? 'rgba(100,200,255,0.55)' : 'rgba(100,200,255,0.12)'}
            strokeWidth={hovered ? 1.5 : 0.8}
            transform={`rotate(${e.tilt} ${cx} ${cy})`}
          />
        )
      })}
    </svg>
  )
}
