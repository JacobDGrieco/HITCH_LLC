import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/shared.css';
import '../styles/experience-page.css';
import CrystalCard from '../components/CrystalCard';

const EXPERIENCE = [
	{
		title: 'UK HealthCare Staffing Tool',
		role: 'Lead Developer — CS499 Capstone',
		period: 'Jan 2026 – Present',
		desc: 'Building a production-ready employee scheduling system for UK HealthCare clinic managers. Full-stack React + FastAPI with Gantt-style UI, role-based access, and automated email reminders.',
		accent: 'rgba(80,130,200,0.9)',
		tags: ['React', 'FastAPI', 'PostgreSQL', 'GSAP'],
		current: true,
	},
	{
		title: 'University of Kentucky Housing',
		role: 'Desk Clerk',
		period: 'Feb 2024 – Present',
		desc: 'Front-line operations for UK residential housing. Key/package management, resident services, and emergency response coordination.',
		accent: 'rgba(120,80,190,0.9)',
		tags: ['Operations', 'Customer Service'],
		current: true,
	},
];

function fadeAccent(accent, alpha) {
	return accent.replace('0.9', alpha);
}

function TimelineItem({ item, index, total }) {
	const ref = useRef(null);

	useEffect(() => {
		gsap.fromTo(ref.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.55, delay: index * 0.18, ease: 'power2.out' });
	}, [index]);

	return (
		<div
			ref={ref}
			className="experience-page__item"
			style={{
				'--accent': item.accent,
				'--accent-shadow': fadeAccent(item.accent, '0.4)'),
				'--accent-border': fadeAccent(item.accent, '0.2)'),
				'--accent-soft-bg': fadeAccent(item.accent, '0.1)'),
				'--accent-border-strong': fadeAccent(item.accent, '0.3)'),
				'--accent-border-soft': fadeAccent(item.accent, '0.25)'),
				'--card-margin': index < total - 1 ? '20px' : '0px',
			}}
		>
			<div className="experience-page__rail">
				<div className="experience-page__node" />
				{index < total - 1 && <div className="experience-page__line" />}
			</div>

			<div className="experience-page__card glass-card">
				<div className="experience-page__card-top">
					<div>
						<div className="experience-page__title">{item.title}</div>
						<div className="experience-page__role">{item.role}</div>
					</div>
					<div className="experience-page__meta">
						<span className="experience-page__period">{item.period}</span>
						{item.current && <span className="experience-page__active">Active</span>}
					</div>
				</div>
				<p className="experience-page__desc">{item.desc}</p>
				<div className="experience-page__tags">
					{item.tags.map((tag) => (
						<span key={tag} className="experience-page__tag">{tag}</span>
					))}
				</div>
			</div>
		</div>
	);
}

export default function ExperiencePage() {
	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Experience</div>
				<div className="page-subtitle">where I&apos;ve contributed</div>
			</div>

			<div className="page-crystal-row experience-page__crystals">
				{EXPERIENCE.map((item, index) => (
					<CrystalCard
						key={item.title}
						size={320}
						title={item.title}
						desc={item.role}
						tags={item.tags.slice(0, 3)}
						icon={index === 0 ? '✦' : index === 1 ? '⬢' : '✧'}
						gemColor={fadeAccent(item.accent, '0.92)')}
						featured={item.current}
					/>
				))}
			</div>

			<div className="experience-page__timeline">
				{EXPERIENCE.map((item, i) => (
					<TimelineItem key={item.title} item={item} index={i} total={EXPERIENCE.length} />
				))}
			</div>
		</div>
	);
}
