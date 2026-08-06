import '../styles/skill-crystal.css';
import { getStandardSkillDropSize, resolveScaledDropSize } from '../lib/dropSizing';
import { renderTextWithDelimiterBreaks } from '../lib/textBreaks.jsx';

const REFERENCE_RAIN_SHELL = '/assets/raindrop.webp';

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

function getSkillNameTypography(name, dropSize) {
	const text = String(name ?? '');
	const compactLength = text.replace(/\s/g, '').length;
	const longestWordLength = Math.max(...text.split(/[\s/&]+/).filter(Boolean).map((part) => part.length), 1);
	const textBoxWidth = dropSize * 0.68;
	const readableMaxSize = clamp(dropSize * 0.1, 9.4, 15);
	const wordFitSize = textBoxWidth / (longestWordLength * 0.74);
	const phraseFitSize = compactLength > 13 ? readableMaxSize - (compactLength - 13) * 0.34 : readableMaxSize;
	const estimatedLineCount = Math.max(1, Math.ceil((compactLength * readableMaxSize * 0.56) / textBoxWidth));
	const heightFitSize = (dropSize * 0.32) / (estimatedLineCount * 1.08);
	const fontSize = clamp(Math.min(readableMaxSize, wordFitSize, phraseFitSize, heightFitSize), 10, readableMaxSize);

	return {
		'--skill-name-font-size': `${fontSize.toFixed(2)}px`,
		'--skill-name-line-height': fontSize < 10 ? 1.02 : 1.06,
		'--skill-name-max-width': `${Math.round(textBoxWidth)}px`,
	};
}

export default function SkillCrystal({
	name,
	level,
	hue = 'rgba(175,220,255,0.94)',
	size,
	delay = 0,
	enterDelay = 0,
	animateEntry = true,
}) {
	const normalized = clamp(level, 0, 100);
	const standardSize = getStandardSkillDropSize(normalized);
	const computedSize = resolveScaledDropSize(size, standardSize);
	const floatDuration = `${5.6 + (100 - normalized) * 0.02}s`;
	const nameTypography = getSkillNameTypography(name, computedSize);

	return (
		<div
			className={`skill-crystal${animateEntry ? ' skill-crystal--entering' : ''}`}
			style={{
				'--skill-crystal-size': `${computedSize}px`,
				'--skill-level': normalized / 100,
				'--skill-hue': hue,
				'--skill-delay': `${delay}s`,
				'--skill-enter-delay': `${enterDelay}ms`,
				'--skill-float-duration': floatDuration,
				...nameTypography,
			}}
		>
			<div className="skill-crystal__shell">
				<img src={REFERENCE_RAIN_SHELL} alt="" aria-hidden="true" loading="lazy" className="skill-crystal__shell-image" />
				<div className="skill-crystal__content">
					<div className="skill-crystal__name">{renderTextWithDelimiterBreaks(name)}</div>
				</div>
			</div>
		</div>
	);
}
