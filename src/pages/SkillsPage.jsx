import { useEffect, useState } from 'react';
import '../styles/shared.css';
import '../styles/skills-page.css';
import '../styles/skill-crystal.css';
import SkillCrystal from '../components/SkillCrystal';
import { getStandardSkillDropSize } from '../lib/dropSizing';
import { getCachedSkillsPageData, loadSkillsPageData } from '../lib/pageDataCache';

const CATEGORY_ACCENTS = {
	Frontend: 'rgba(160, 214, 255, 0.95)',
	Backend: 'rgba(201, 183, 255, 0.95)',
	Data: 'rgba(255, 210, 166, 0.95)',
	Integrations: 'rgba(169, 231, 218, 0.95)',
	Tools: 'rgba(248, 177, 221, 0.95)',
	'Web Development': 'rgba(160, 214, 255, 0.95)',
	'Programming Languages': 'rgba(248, 177, 221, 0.95)',
};
const SKELETON_GROUPS = ['Frontend', 'Backend', 'Data'];
const SKILL_SIZE_SCALE = 1.14;

function groupByCategory(skills) {
	return skills.reduce((acc, skill) => {
		if (!acc[skill.category]) acc[skill.category] = [];
		acc[skill.category].push(skill);
		return acc;
	}, {});
}

function getCategoryClassName(category) {
	return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getSkillDropSize(level) {
	return Math.round(getStandardSkillDropSize(level) * SKILL_SIZE_SCALE);
}

function SkillsSkeleton() {
	return (
		<div className="skills-groups">
			{SKELETON_GROUPS.map((cat, groupIndex) => (
				<section
					key={cat}
					className={`skills-group skills-group--${getCategoryClassName(cat)}`}
				>
					<div className="skills-group__label" style={{ opacity: 0.3 }}>{cat}</div>
					<div className="skills-group__drops">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="skills-group__drop skills-group__drop--skeleton"
								style={{
									width: `${getSkillDropSize(72 + i * 5)}px`,
									animation: 'pulse 1.6s ease-in-out infinite',
									animationDelay: `${(i + groupIndex) * 0.1}s`,
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
				<div className="skills-groups">
					{Object.entries(grouped).map(([category, items], groupIndex) => {
						return (
						<section
							key={category}
							className={`skills-group skills-group--${getCategoryClassName(category)}`}
							style={{
								'--cluster-accent': CATEGORY_ACCENTS[category] ?? 'rgba(200, 200, 255, 0.95)',
							}}
						>
							<div className="skills-group__label">{category}</div>
							<div className="skills-group__drops">
								{items.map((skill, index) => (
									<div key={skill.name} className="skills-group__drop">
										<SkillCrystal
											name={skill.name}
											level={skill.level}
											size={getSkillDropSize(skill.level)}
											hue={CATEGORY_ACCENTS[category] ?? 'rgba(200, 200, 255, 0.95)'}
											delay={groupIndex * 0.35 + index * 0.18}
											enterDelay={groupIndex * 90 + index * 45}
										/>
									</div>
								))}
							</div>
						</section>
						);
					})}
				</div>
			)}
		</div>
	);
}
