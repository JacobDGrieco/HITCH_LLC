import { useEffect, useState } from 'react';
import '../styles/shared.css';
import '../styles/experience-page.css';
import DropCard from '../components/DropCard';

const FALLBACK = [
	{
		id: 'staffing',
		title: 'UK HealthCare Staffing Tool',
		role: 'Full-Stack Developer | CS499 Capstone',
		dateRange: 'Jan 2026 - May 2026',
		desc: 'Building a production-ready scheduling system for UK HealthCare clinic managers with a Gantt-style UI, role-based access, and automated email reminders.',
		tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'REST APIs'],
		iconImage: '/projects/staffingtool.png',
		gemColor: 'rgba(0, 41, 122, 0.96)',
		size: 402,
		featured: true,
		className: 'experience-page__crystal experience-page__crystal--product',
	},
	{
		id: 'housing',
		title: 'University of Kentucky Housing',
		role: 'Front Desk Clerk',
		dateRange: 'Feb 2024 - May 2026',
		desc: 'Handled front-line housing operations, key and package management, resident support, and emergency-response coordination.',
		tags: ['Operations', 'Resident Support', 'Customer Service'],
		iconImage: '/projects/staffingtool.png',
		gemColor: 'rgba(16, 38, 104, 0.95)',
		size: 378,
		featured: true,
		className: 'experience-page__crystal experience-page__crystal--operations',
	},
];

function buildDesc(item) {
	return `${item.role}\n${item.dateRange}\n\n${item.desc}`;
}

function DropCardSkeleton({ size = 390 }) {
	return (
		<div
			className="drop-card drop-card--skeleton"
			style={{
				'--drop-w': `${size}px`,
			}}
		/>
	);
}

export default function ExperiencePage() {
	const [experience, setExperience] = useState(null);

	useEffect(() => {
		fetch('/api/experience')
			.then((r) => {
				if (!r.ok) throw new Error(`Experience request failed with status ${r.status}`);
				return r.json();
			})
			.then(({ experience: data }) => setExperience(Array.isArray(data) && data.length ? data : FALLBACK))
			.catch(() => setExperience(FALLBACK));
	}, []);

	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Experience</div>
				<div className="page-subtitle">where I&apos;ve contributed</div>
			</div>

			<div className="page-crystal-row experience-page__crystals">
				{experience === null ? (
					[402, 378].map((size, i) => <DropCardSkeleton key={i} size={size} />)
				) : (
					experience.map((item) => (
						<DropCard
							key={item.id}
							size={item.size}
							title={item.title}
							desc={buildDesc(item)}
							tags={item.tags}
							iconImage={item.iconImage}
							gemColor={item.gemColor}
							featured={item.featured}
							className={item.className}
						/>
					))
				)}
			</div>
		</div>
	);
}
