// About route content, contact links, and desktop-only contact form placement.
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import { FileText, Mail } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import '../styles/shared.css';
import ContactPage from './ContactPage';
import '../styles/about-page.css';

const CONTACT_LINKS = [
	{
		title: 'Email',
		subtitle: 'contact@headinthe\ncloudshaven.com',
		href: 'mailto:contact@headinthecloudshaven.com',
		Icon: Mail,
	},
	{
		title: 'Resume',
		subtitle: 'Download PDF',
		href: '/contact/resume.pdf',
		Icon: FileText,
		external: true,
	},
	{
		title: 'LinkedIn',
		subtitle: 'Professional Profile',
		href: 'https://linkedin.com/in/jacob-grieco',
		iconImage: '/contact/linkedin.png',
		external: true,
	},
	{
		title: 'GitHub',
		subtitle: 'Code Profile',
		href: 'https://github.com/JacobDGrieco',
		iconImage: '/contact/github.png',
		external: true,
	},
];

const ABOUT_DESKTOP_CANVAS = {
	width: 2560,
	height: 1440,
	shellTopReserve: 92,
};

function getViewport() {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

function clampScale(scale, min, max) {
	return Math.min(Math.max(scale, min), max);
}

function isMobileAboutViewport(viewport) {
	return viewport.width <= 820 || (viewport.width <= 960 && viewport.height <= 520);
}

export default function AboutPage() {
	const [viewport, setViewport] = useState(getViewport);

	useEffect(() => {
		function handleResize() {
			setViewport(getViewport());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const aboutScaleVars = useMemo(() => {
		const usableHeight = Math.max(1, viewport.height - ABOUT_DESKTOP_CANVAS.shellTopReserve);
		// The about scene is tuned against a fixed design canvas and emitted as CSS variables.
		const stageScale = clampScale(Math.min(viewport.width / ABOUT_DESKTOP_CANVAS.width, usableHeight / (ABOUT_DESKTOP_CANVAS.height - ABOUT_DESKTOP_CANVAS.shellTopReserve)), 0.42, 1);
		const shortDesktopAdjustment = clampScale((0.62 - stageScale) / 0.2, 0, 1);
		const sceneOffsetY = -92 * shortDesktopAdjustment;
		const contactFormOffsetX = -shortDesktopAdjustment * 74;
		const contactFormOffsetY = -shortDesktopAdjustment * 34;

		return {
			'--about-stage-scale': stageScale,
			'--about-header-offset-y': `${Number((-25 * shortDesktopAdjustment).toFixed(2))}px`,
			'--about-stage-offset-y': `${Number(sceneOffsetY.toFixed(2))}px`,
			'--about-contact-form-offset-x': `${Number(contactFormOffsetX.toFixed(2))}px`,
			'--about-contact-form-offset-y': `${Number(contactFormOffsetY.toFixed(2))}px`,
		};
	}, [viewport]);
	// The transformed contact form is omitted on mobile because its current styling does not adapt cleanly.
	const shouldShowContactForm = !isMobileAboutViewport(viewport);
	const contactFormSceneScale = shouldShowContactForm ? clampScale(0.98 / Number(aboutScaleVars['--about-stage-scale']), 1, 1.58) : 1;

	return (
		<main className="about-page" style={aboutScaleVars} aria-labelledby="about-contact-title">
			<div className="about-page__stars" aria-hidden="true" />
			<header className="about-page__header">
				<h1 id="about-contact-title" className="about-page__title">About &amp; Contact</h1>
				<p className="about-page__subtitle">Let&apos;s build something meaningful.</p>
			</header>

			<div className="about-page__scene">
				<section className="about-page__portrait-stage" aria-label="Portrait of Jacob Grieco">
					<div className="about-page__portrait-orbit">
						<div className="about-page__portrait-cloud" aria-hidden="true">
							<img src="/assets/portrait-wreath.webp" alt="" width="1254" height="1254" className="about-page__portrait-cloud-art" />
						</div>
						<div className="about-page__portrait-ring">
							<img src="/headshot.webp" alt="Jacob Grieco" width="1400" height="1129" loading="eager" className="about-page__portrait-image" />
						</div>
					</div>
					<div className="about-page__contact-links contact-page__cloud-links" aria-label="Contact links">
						{CONTACT_LINKS.map(({ title, subtitle, href, Icon, iconImage, external }) => (
							<a
								key={title}
								href={href}
								target={external ? '_blank' : undefined}
								rel={external ? 'noopener noreferrer' : undefined}
								className="contact-page__cloud-link"
							>
								<img src="/assets/route1.webp" alt="" className="contact-page__cloud-art" aria-hidden="true" />
								<span className="contact-page__cloud-content">
									{Icon ? (
										<Icon className="contact-page__cloud-icon" strokeWidth={1.8} aria-hidden="true" />
									) : (
										<img src={iconImage} alt="" width="32" height="32" loading="lazy" className="contact-page__cloud-icon-image" />
									)}
									<span className="contact-page__cloud-title">{title}</span>
									<span className="contact-page__cloud-subtitle">{subtitle}</span>
								</span>
							</a>
						))}
					</div>
				</section>

				<section className="about-page__copy-panel" aria-label="About Jacob Grieco">
					<h2 className="about-page__name">Jacob Grieco</h2>
					<p className="about-page__lead">
						Building websites made just for you.
					</p>
					<p className="about-page__copy">
						I enjoy helping people create the promotion and services they need. A portfolio site, a Content Management System, whatever. I welcome the challenge.
					</p>
					<p className="about-page__copy">
						On the off chance I'm not coding something, I'm reading and keeping up on topics like gaming, TV, and movies.
					</p>
					<div className="about-page__divider" aria-hidden="true" />
				</section>

				{shouldShowContactForm && <ContactPage formSceneScale={contactFormSceneScale} />}
			</div>
		</main>
	);
}
