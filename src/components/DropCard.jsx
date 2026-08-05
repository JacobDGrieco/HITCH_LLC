import '../styles/drop-card.css';
import { resolveScaledDropSize } from '../lib/dropSizing';
import { renderTextWithDelimiterBreaks } from '../lib/textBreaks.jsx';

const DROP_PATH = 'M50 2 C56 18 76 43 88 67 C101 93 83 128 50 128 C17 128 -1 93 12 67 C24 43 44 18 50 2 Z';
const DROP_INNER_PATH = 'M50 13 C55 27 72 49 82 70 C93 92 78 119 50 120 C22 119 7 92 18 70 C28 49 45 27 50 13 Z';
const DROP_BOTTOM_PATH = 'M19 88 C26 112 73 121 86 91 C84 112 70 128 50 128 C29 128 14 112 12 91 C14 90 16 89 19 88 Z';
const DROP_GLOSS_PATH = 'M38 24 C29 42 20 60 20 77 C20 94 29 105 39 112 C32 92 31 67 36 45 C39 34 44 21 48 12 C45 15 41 19 38 24 Z';
const STANDARD_DROP_WIDTH = 340;

function parseColorChannels(color) {
	const normalizedColor = String(color ?? '').trim();
	const hexMatch = normalizedColor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

	if (hexMatch) {
		const hex = hexMatch[1].length === 3
			? hexMatch[1].split('').map((char) => `${char}${char}`).join('')
			: hexMatch[1];

		return {
			red: parseInt(hex.slice(0, 2), 16),
			green: parseInt(hex.slice(2, 4), 16),
			blue: parseInt(hex.slice(4, 6), 16),
		};
	}

	const rgbaMatch = normalizedColor.match(/^rgba?\(([^)]+)\)$/i);
	if (!rgbaMatch) return null;

	const [red, green, blue] = rgbaMatch[1]
		.split(',')
		.slice(0, 3)
		.map((part) => Number.parseFloat(part.trim()));

	if (![red, green, blue].every(Number.isFinite)) return null;

	return { red, green, blue };
}

function colorWithAlpha(color, alpha) {
	const channels = parseColorChannels(color);
	if (!channels) return color;

	const { red, green, blue } = channels;
	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function linearizeColorChannel(value) {
	const channel = value / 255;
	return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function getRelativeLuminance({ red, green, blue }) {
	return 0.2126 * linearizeColorChannel(red)
		+ 0.7152 * linearizeColorChannel(green)
		+ 0.0722 * linearizeColorChannel(blue);
}

function getDropTitleStyle(color) {
	const channels = parseColorChannels(color);
	const isDarkDrop = channels ? getRelativeLuminance(channels) < 0.34 : false;

	return {
		'--drop-title-color': isDarkDrop ? 'rgba(255, 234, 216, 0.98)' : 'rgba(255, 226, 206, 0.98)',
		'--drop-title-shadow': '0 1px 12px rgba(255, 163, 118, 0.38), 0 8px 18px rgba(5, 8, 28, 0.46)',
		'--drop-title-stroke-color': 'transparent',
	};
}

export default function DropCard({
	title,
	desc,
	tags = [],
	icon,
	iconImage,
	links = [],
	className = '',
	size = 1,
	gemColor = 'rgba(200, 185, 255, 0.92)',
	featured = false,
	enterDelay = 0,
	animateEntry = true,
}) {
	const dropWidth = resolveScaledDropSize(size, STANDARD_DROP_WIDTH);
	const dropTitleStyle = getDropTitleStyle(gemColor);

	return (
		<div
			className={`drop-card${animateEntry ? ' drop-card--entering' : ''}${className ? ` ${className}` : ''}`}
			style={{
				'--drop-w': `${dropWidth}px`,
				'--drop-color': gemColor,
				'--drop-color-pale': colorWithAlpha(gemColor, 0.28),
				'--drop-color-soft': colorWithAlpha(gemColor, 0.52),
				'--drop-color-deep': colorWithAlpha(gemColor, 0.88),
				'--drop-float-duration': `${featured ? 6 : 5}s`,
				'--drop-float-delay': featured ? '-1.8s' : '0s',
				'--drop-enter-delay': `${enterDelay}ms`,
				'--drop-filter': `drop-shadow(0 ${featured ? 20 : 16}px ${featured ? 42 : 32}px rgba(255, 137, 104, ${featured ? 0.34 : 0.26})) drop-shadow(0 8px 18px rgba(5, 10, 34, 0.42))`,
				...dropTitleStyle,
			}}
		>
			<div className="drop-card__shape">
				<svg className="drop-card__vessel" viewBox="0 0 100 132" preserveAspectRatio="none" aria-hidden="true" focusable="false">
					<path className="drop-card__body" d={DROP_PATH} />
					<path className="drop-card__inner" d={DROP_INNER_PATH} />
					<path className="drop-card__bottom" d={DROP_BOTTOM_PATH} />
					<path className="drop-card__gloss" d={DROP_GLOSS_PATH} />
					<path className="drop-card__rim" d={DROP_PATH} />
				</svg>

				<div className="drop-card__sparkle drop-card__sparkle--one" />
				<div className="drop-card__sparkle drop-card__sparkle--two" />

				<div className="drop-card__content">
					<div className="drop-card__icon-section">
						{iconImage ? (
							<img src={iconImage} alt="" width="82" height="82" loading="lazy" className="drop-card__icon-image" />
						) : icon ? (
							<div className="drop-card__icon">{icon}</div>
						) : null}
					</div>

					<div className="drop-card__title-section">
						{title ? <div className="drop-card__title">{renderTextWithDelimiterBreaks(title)}</div> : null}
					</div>

					<div className="drop-card__desc-section">
						{desc ? <div className="drop-card__desc">{renderTextWithDelimiterBreaks(desc)}</div> : null}
					</div>

					<div className="drop-card__bottom-section">
						{tags.length ? (
							<div className="drop-card__tags">
								{tags.map((tag) => (
									<span key={tag} className="drop-card__tag">{renderTextWithDelimiterBreaks(tag)}</span>
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
										{renderTextWithDelimiterBreaks(link.label)}
									</a>
								))}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
