import '../styles/shared.css';
import CrystalCard from '../components/CrystalCard';

const EXPERIENCE = [
	{
		title: 'UK HealthCare Staffing Tool',
		role: 'Fullstack Developer — CS499 Capstone',
		period: 'Jan 2026 – Present',
		desc: 'Building a production-ready employee scheduling system for UK HealthCare clinic managers. Full-stack React + FastAPI with Gantt-style UI, role-based access, and automated email reminders.',
		iconImage: '/staffingtool.png',
		accent: 'rgba(80,130,200,0.9)',
		tags: ['React', 'FastAPI', 'PostgreSQL', 'GSAP'],
		current: true,
	},
	{
		title: 'University of Kentucky Housing',
		role: 'Desk Clerk',
		period: 'Feb 2024 – Present',
		desc: 'Front-line operations for UK residential housing. Key/package management, resident services, and emergency response coordination.',
		iconImage: '/staffingtool.png',
		accent: 'rgba(120,80,190,0.9)',
		tags: ['Operations', 'Customer Service'],
		current: true,
	},
];

function fadeAccent(accent, alpha) {
	return accent.replace('0.9', alpha);
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
						desc={`${item.role}\n\n${item.desc}`}
						tags={item.tags.slice(0, 3)}
						icon={index === 0 ? '✦' : index === 1 ? '⬢' : '✧'}
						iconImage={item.iconImage}
						gemColor={fadeAccent(item.accent, '0.92)')}
						featured={item.current}
					/>
				))}
			</div>
		</div>
	);
}
