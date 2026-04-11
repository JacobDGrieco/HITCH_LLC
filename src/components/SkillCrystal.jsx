import '../styles/skill-crystal.css';

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
				<div className="skill-crystal__inner-glow" />
				<div className="skill-crystal__liquid">
					<div className="skill-crystal__wave skill-crystal__wave--back" />
					<div className="skill-crystal__wave skill-crystal__wave--front" />
					<div className="skill-crystal__bubble skill-crystal__bubble--1" />
					<div className="skill-crystal__bubble skill-crystal__bubble--2" />
					<div className="skill-crystal__bubble skill-crystal__bubble--3" />
				</div>
				<div className="skill-crystal__facets" />
				<div className="skill-crystal__shine" />
				<div className="skill-crystal__content">
					<div className="skill-crystal__name">{name}</div>
					<div className="skill-crystal__value">{normalized}%</div>
				</div>
			</div>
		</div>
	);
}
