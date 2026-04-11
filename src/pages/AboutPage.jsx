import '../styles/shared.css';
import '../styles/about-page.css';

const HIGHLIGHTS = [
	'Computer Science major at the University of Kentucky with a Mathematics minor.',
	'Focused on building full-stack products with React, FastAPI, PostgreSQL, and practical UX.',
	'Currently building a staffing platform for UK HealthCare with scheduling, automation, and role-aware workflows.',
];

const FOCUS = [
	'Turning messy real-world processes into clear software.',
	'Designing interfaces that feel polished but still practical to use every day.',
	'Building tools that connect frontend clarity with reliable backend systems.',
];

export default function AboutPage() {
	return (
		<div className="page-section about-page">
			<div className="page-header">
				<div className="page-title">About</div>
				<div className="page-subtitle">the person behind the clouds</div>
			</div>

			<div className="about-page__hero">
				<section className="about-page__portrait-stage" aria-label="Portrait">
					<div className="about-page__portrait-cloud">
						<div className="about-page__portrait-mist about-page__portrait-mist--one" />
						<div className="about-page__portrait-mist about-page__portrait-mist--two" />
						<div className="about-page__portrait-mist about-page__portrait-mist--three" />
						<div className="about-page__portrait-core">
							<div className="about-page__portrait-ring">
								<img src="/headshot.jpg" alt="Jacob Grieco" className="about-page__portrait-image" />
							</div>
						</div>
						<div className="about-page__portrait-caption">Jacob Grieco</div>
					</div>
				</section>

				<section className="about-page__scroll-shell" aria-label="About me">
					<div className="about-page__scroll">
						<div className="about-page__scroll-rod about-page__scroll-rod--left" />
						<div className="about-page__scroll-rod about-page__scroll-rod--right" />
						<div className="about-page__scroll-paper">
							<div className="about-page__scroll-content">
								<div className="about-page__eyebrow">About Me</div>
								<h2 className="about-page__headline">
									I like building software that feels thoughtful, useful, and finished.
								</h2>
								<p className="about-page__copy">
									I&apos;m a developer with a strong interest in full-stack product work, especially the
									space where interface design, system logic, and real-world workflow all meet. I like
									projects that start with a messy process and end with something people can actually rely on.
								</p>
								<p className="about-page__copy">
									My background combines computer science, mathematics, and exposure to artificial
									intelligence and cybersecurity. That mix pushes me toward work that is both technically
									sound and practical for the people using it.
								</p>
								<p className="about-page__copy">
									Right now I&apos;m most interested in building polished tools with React, FastAPI, and
									PostgreSQL, especially products that balance clean frontend presentation with strong
									backend structure.
								</p>

								<div className="about-page__divider" />

								<div className="about-page__facts">
									<div className="about-page__fact-group">
										<div className="about-page__fact-title">Highlights</div>
										<ul className="about-page__list">
											{HIGHLIGHTS.map((item) => (
												<li key={item}>{item}</li>
											))}
										</ul>
									</div>

									<div className="about-page__fact-group">
										<div className="about-page__fact-title">What I Care About</div>
										<ul className="about-page__list">
											{FOCUS.map((item) => (
												<li key={item}>{item}</li>
											))}
										</ul>
									</div>
								</div>

								<div className="about-page__actions">
									<a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="about-page__button about-page__button--primary">
										View Resume
									</a>
									<a href="/contact" className="about-page__button about-page__button--secondary">
										Get In Touch
									</a>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
