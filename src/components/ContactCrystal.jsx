import '../styles/contact-crystal.css';
import { resolveScaledDropSize } from '../lib/dropSizing';
import { renderTextWithDelimiterBreaks } from '../lib/textBreaks.jsx';

const DROP_PATH = 'M50 2 C56 18 76 43 88 67 C101 93 83 128 50 128 C17 128 -1 93 12 67 C24 43 44 18 50 2 Z';
const DROP_INNER_PATH = 'M50 13 C55 27 72 49 82 70 C93 92 78 119 50 120 C22 119 7 92 18 70 C28 49 45 27 50 13 Z';
const DROP_BOTTOM_PATH = 'M19 88 C26 112 73 121 86 91 C84 112 70 128 50 128 C29 128 14 112 12 91 C14 90 16 89 19 88 Z';
const DROP_GLOSS_PATH = 'M38 24 C29 42 20 60 20 77 C20 94 29 105 39 112 C32 92 31 67 36 45 C39 34 44 21 48 12 C45 15 41 19 38 24 Z';
const STANDARD_CONTACT_DROP_SIZE = 180;

export default function ContactCrystal({
	title,
	subtitle,
	href,
	icon,
	iconImage,
	size = 1,
	hue = 'rgba(214, 169, 236, 0.92)',
	delay = 0,
	enterDelay = 0,
}) {
	const external = href?.startsWith('http');
	const resolvedSize = resolveScaledDropSize(size, STANDARD_CONTACT_DROP_SIZE);

	return (
		<a
			className="contact-crystal"
			href={href}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			style={{
				'--contact-crystal-size': `${resolvedSize}px`,
				'--contact-crystal-hue': hue,
				'--contact-crystal-delay': `${delay}s`,
				'--contact-crystal-enter-delay': `${enterDelay}ms`,
			}}
		>
			<div className="contact-crystal__shell">
				<svg className="contact-crystal__vessel" viewBox="0 0 100 132" preserveAspectRatio="none" aria-hidden="true" focusable="false">
					<path className="contact-crystal__body" d={DROP_PATH} />
					<path className="contact-crystal__inner" d={DROP_INNER_PATH} />
					<path className="contact-crystal__bottom" d={DROP_BOTTOM_PATH} />
					<path className="contact-crystal__gloss" d={DROP_GLOSS_PATH} />
					<path className="contact-crystal__rim" d={DROP_PATH} />
				</svg>
				<div className="contact-crystal__content">
					{iconImage ? (
						<img src={iconImage} alt="" width="72" height="72" loading="lazy" className="contact-crystal__icon-image" />
					) : icon ? (
						<div className="contact-crystal__icon">{icon}</div>
					) : null}
					<div className="contact-crystal__title">{renderTextWithDelimiterBreaks(title)}</div>
					<div className="contact-crystal__subtitle">{renderTextWithDelimiterBreaks(subtitle)}</div>
				</div>
			</div>
		</a>
	);
}
