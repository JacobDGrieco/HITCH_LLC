import '../styles/contact-crystal.css';

export default function ContactCrystal({
	title,
	subtitle,
	href,
	icon,
	iconImage,
	size = 180,
	hue = 'rgba(214, 169, 236, 0.92)',
	delay = 0,
}) {
	const external = href?.startsWith('http');

	return (
		<a
			className="contact-crystal"
			href={href}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			style={{
				'--contact-crystal-size': `${size}px`,
				'--contact-crystal-hue': hue,
				'--contact-crystal-delay': `${delay}s`,
			}}
		>
			<div className="contact-crystal__shell">
				<div className="contact-crystal__core" />
				<div className="contact-crystal__facets" />
				<div className="contact-crystal__shine" />
				<div className="contact-crystal__content">
					{iconImage ? (
						<img src={iconImage} alt="" width="72" height="72" loading="lazy" className="contact-crystal__icon-image" />
					) : icon ? (
						<div className="contact-crystal__icon">{icon}</div>
					) : null}
					<div className="contact-crystal__title">{title}</div>
					<div className="contact-crystal__subtitle">{subtitle}</div>
				</div>
			</div>
		</a>
	);
}
