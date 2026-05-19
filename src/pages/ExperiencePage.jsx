import '../styles/shared.css';
import '../styles/experience-page.css';
import DropCard from '../components/DropCard';

const EXPERIENCE = [
	{
		title: 'UK HealthCare Staffing Tool',
		role: 'Full-Stack Developer | CS499 Capstone',
		period: 'Jan 2026 - May 2026',
		desc: 'Building a production-ready scheduling system for UK HealthCare clinic managers with a Gantt-style UI, role-based access, and automated email reminders.',
		iconImage: '/staffingtool.png',
		accent: 'rgba(0, 41, 122, 0.96)',
		tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'REST APIs'],
		current: true,
		size: 350,
		className: 'experience-page__crystal experience-page__crystal--product',
	},
	{
		title: 'University of Kentucky Housing',
		role: 'Front Desk Clerk',
		period: 'Feb 2024 - May 2026',
		desc: 'Handled front-line housing operations, key and package management, resident support, and emergency-response coordination.',
		iconImage: '/staffingtool.png',
		accent: 'rgba(16, 38, 104, 0.95)',
		tags: ['Operations', 'Resident Support', 'Customer Service'],
		current: true,
		size: 330,
		className: 'experience-page__crystal experience-page__crystal--operations',
	},
];

function buildExperienceCopy(item) {
	return `${item.role}\n${item.period}\n\n${item.desc}`;
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
					<DropCard
						key={item.title}
						size={item.size}
						title={item.title}
						desc={buildExperienceCopy(item)}
						tags={item.tags}
						icon={index === 0 ? '*' : index === 1 ? '+' : '.'}
						iconImage={item.iconImage}
						gemColor={item.accent}
						featured={item.current}
						className={item.className}
					/>
				))}
			</div>
		</div>
	);
}
