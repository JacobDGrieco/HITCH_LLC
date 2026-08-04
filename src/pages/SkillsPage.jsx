import { useEffect, useState } from 'react';
import '../styles/shared.css';
import '../styles/skills-page.css';
import '../styles/skill-crystal.css';
import SkillCrystal from '../components/SkillCrystal';
import { getCachedSkillsPageData, loadSkillsPageData } from '../lib/pageDataCache';

const CATEGORY_ACCENTS = {
	Frontend: 'rgba(160, 214, 255, 0.95)',
	Backend: 'rgba(201, 183, 255, 0.95)',
	Tools: 'rgba(248, 177, 221, 0.95)',
};

const FALLBACK = [
	{ name: 'React',             category: 'Frontend', level: 90 },
	{ name: 'JavaScript',        category: 'Frontend', level: 88 },
	{ name: 'HTML & CSS',        category: 'Frontend', level: 92 },
	{ name: 'Tailwind CSS',      category: 'Frontend', level: 82 },
	{ name: 'Vite / Webpack',    category: 'Frontend', level: 75 },
	{ name: 'FastAPI / Python',  category: 'Backend',  level: 85 },
	{ name: 'Node.js / Express', category: 'Backend',  level: 80 },
	{ name: 'SQL / PostgreSQL',  category: 'Backend',  level: 82 },
	{ name: 'SQLAlchemy / Prisma', category: 'Backend', level: 78 },
	{ name: 'REST API Design',   category: 'Backend',  level: 85 },
	{ name: 'Git / GitHub',      category: 'Tools',    level: 90 },
	{ name: 'Vercel / Deployment', category: 'Tools',  level: 80 },
	{ name: 'Java',              category: 'Tools',    level: 72 },
	{ name: 'C / C++',          category: 'Tools',    level: 65 },
	{ name: 'PHP',               category: 'Tools',    level: 60 },
];

function groupByCategory(skills) {
	return skills.reduce((acc, skill) => {
		if (!acc[skill.category]) acc[skill.category] = [];
		acc[skill.category].push(skill);
		return acc;
	}, {});
}

function SkillsSkeleton() {
	return (
		<div className="skills-clusters">
			{['Frontend', 'Backend', 'Tools'].map((cat) => (
				<section key={cat} className={`skills-cluster skills-cluster--${cat.toLowerCase()}`}>
					<div className="skills-cluster__label" style={{ opacity: 0.3 }}>{cat}</div>
					<div className="skills-cluster__items">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								style={{
									width: `${80 + i * 12}px`,
									height: 32,
									borderRadius: 8,
									background: 'rgba(200, 180, 210, 0.18)',
									animation: 'pulse 1.6s ease-in-out infinite',
									animationDelay: `${i * 0.1}s`,
								}}
							/>
						))}
					</div>
				</section>
			))}
		</div>
	);
}

export default function SkillsPage() {
	const [cachedAtMount] = useState(() => getCachedSkillsPageData());
	const [skills, setSkills] = useState(cachedAtMount);

	useEffect(() => {
		let isActive = true;

		loadSkillsPageData().then((loadedSkills) => {
			if (isActive) setSkills(loadedSkills);
		});

		return () => {
			isActive = false;
		};
	}, []);

	const grouped = skills ? groupByCategory(skills) : null;

	return (
		<div className="page-section skills-page skills-page--clusters">
			<div className="page-header">
				<div className="page-title">Skills</div>
				<div className="page-subtitle">what I work with</div>
			</div>

			{grouped === null ? (
				<SkillsSkeleton />
			) : (
				<div className="skills-clusters">
					{Object.entries(grouped).map(([category, items], groupIndex) => (
						<section
							key={category}
							className={`skills-cluster skills-cluster--${category.toLowerCase()}`}
							style={{ '--cluster-accent': CATEGORY_ACCENTS[category] ?? 'rgba(200, 200, 255, 0.95)' }}
						>
							<div className="skills-cluster__label">{category}</div>
							<div className="skills-cluster__items">
								{items.map((skill, index) => (
									<SkillCrystal
										key={skill.name}
										name={skill.name}
										level={skill.level}
										hue={CATEGORY_ACCENTS[category] ?? 'rgba(200, 200, 255, 0.95)'}
										delay={groupIndex * 0.35 + index * 0.18}
										enterDelay={groupIndex * 90 + index * 45}
									/>
								))}
							</div>
						</section>
					))}
				</div>
			)}
		</div>
	);
}
