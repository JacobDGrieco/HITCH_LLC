import '../styles/shared.css';
import '../styles/skills-page.css';
import '../styles/skill-crystal.css';
import SkillCrystal from '../components/SkillCrystal';

const SKILLS = {
	Frontend: {
		accent: 'rgba(160, 214, 255, 0.95)',
		items: [
			{ name: 'React', level: 90 },
			{ name: 'JavaScript', level: 88 },
			{ name: 'HTML & CSS', level: 92 },
			{ name: 'Tailwind CSS', level: 82 },
			{ name: 'Vite / Webpack', level: 75 },
		],
	},
	Backend: {
		accent: 'rgba(201, 183, 255, 0.95)',
		items: [
			{ name: 'FastAPI / Python', level: 85 },
			{ name: 'Node.js / Express', level: 80 },
			{ name: 'SQL / PostgreSQL', level: 82 },
			{ name: 'SQLAlchemy / Prisma', level: 78 },
			{ name: 'REST API Design', level: 85 },
		],
	},
	Tools: {
		accent: 'rgba(248, 177, 221, 0.95)',
		items: [
			{ name: 'Git / GitHub', level: 90 },
			{ name: 'Vercel / Deployment', level: 80 },
			{ name: 'Java', level: 72 },
			{ name: 'C / C++', level: 65 },
			{ name: 'PHP', level: 60 },
		],
	},
};

export default function SkillsPage() {
	return (
		<div className="page-section skills-page skills-page--clusters">
			<div className="page-header">
				<div className="page-title">Skills</div>
				<div className="page-subtitle">what I work with</div>
			</div>

			<div className="skills-clusters">
				{Object.entries(SKILLS).map(([category, data], groupIndex) => (
					<section
						key={category}
						className={`skills-cluster skills-cluster--${category.toLowerCase()}`}
						style={{ '--cluster-accent': data.accent }}
					>
						<div className="skills-cluster__label">{category}</div>
						<div className="skills-cluster__items">
							{data.items.map((skill, index) => (
								<SkillCrystal
									key={skill.name}
									name={skill.name}
									level={skill.level}
									hue={data.accent}
									delay={groupIndex * 0.35 + index * 0.18}
								/>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
