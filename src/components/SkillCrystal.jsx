import '../styles/skill-crystal.css';

const DROP_PATH = 'M50 2 C56 18 76 43 88 67 C101 93 83 128 50 128 C17 128 -1 93 12 67 C24 43 44 18 50 2 Z';
const DROP_INNER_PATH = 'M50 13 C55 27 72 49 82 70 C93 92 78 119 50 120 C22 119 7 92 18 70 C28 49 45 27 50 13 Z';
const DROP_BOTTOM_PATH = 'M19 88 C26 112 73 121 86 91 C84 112 70 128 50 128 C29 128 14 112 12 91 C14 90 16 89 19 88 Z';

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

export default function SkillCrystal({
	name,
	level,
	hue = 'rgba(175,220,255,0.94)',
	size,
	delay = 0,
}) {
	const normalized = clamp(level, 0, 100);
	const computedSize = size ?? Math.round(84 + normalized * 0.5);
	const floatDuration = `${5.6 + (100 - normalized) * 0.02}s`;
	const liquidY = 132 - normalized * 1.32;
	const clipId = `skill-drop-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;

	return (
		<div
			className="skill-crystal"
			style={{
				'--skill-crystal-size': `${computedSize}px`,
				'--skill-level': normalized / 100,
				'--skill-hue': hue,
				'--skill-delay': `${delay}s`,
				'--skill-float-duration': floatDuration,
			}}
		>
			<div className="skill-crystal__shell">
				<svg className="skill-crystal__vessel" viewBox="0 0 100 132" preserveAspectRatio="none" aria-hidden="true" focusable="false">
					<defs>
						<clipPath id={clipId} clipPathUnits="userSpaceOnUse">
							<path d={DROP_PATH} />
						</clipPath>
					</defs>
					<path className="skill-crystal__body" d={DROP_PATH} />
					<path className="skill-crystal__inner" d={DROP_INNER_PATH} />
					<g clipPath={`url(#${clipId})`}>
						<g className="skill-crystal__liquid" style={{ '--skill-liquid-y': `${liquidY}px` }}>
							<rect className="skill-crystal__liquid-body" x="-8" y={liquidY} width="116" height={132 - liquidY + 12} />
							<circle className="skill-crystal__bubble skill-crystal__bubble--1" cx="30" cy="112" r="3.4" />
							<circle className="skill-crystal__bubble skill-crystal__bubble--2" cx="56" cy="104" r="2.3" />
							<circle className="skill-crystal__bubble skill-crystal__bubble--3" cx="69" cy="116" r="2.8" />
						</g>
					</g>
					<path className="skill-crystal__bottom" d={DROP_BOTTOM_PATH} />
					<path className="skill-crystal__rim" d={DROP_PATH} />
				</svg>
				<div className="skill-crystal__content">
					<div className="skill-crystal__name">{name}</div>
				</div>
			</div>
		</div>
	);
}
