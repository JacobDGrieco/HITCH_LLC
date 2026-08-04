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
	Tools: 'rgba(248, 177, 221, 0.95)',
	'Web Development': 'rgba(160, 214, 255, 0.95)',
	'Programming Languages': 'rgba(248, 177, 221, 0.95)',
};
const SKELETON_GROUPS = ['Web Development', 'Programming Languages', 'Backend'];
const GOLDEN_ANGLE_DEG = 137.508;
const DROP_ASPECT_RATIO = 1.32;
const DROP_COLLISION_GAP = 2;
const DROP_RADIUS_X_FACTOR = 0.44;
const DROP_RADIUS_Y_FACTOR = 0.4;
const ORBIT_PADDING = 8;
const MIN_ORBIT_SIZE = 220;

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

function getStringSeed(value) {
	return Array.from(value).reduce((seed, char) => seed + char.charCodeAt(0), 0);
}

function getOrbitSize(count, maxDropSize) {
	if (count <= 1) return Math.ceil(Math.max(MIN_ORBIT_SIZE, maxDropSize + 64));

	return Math.ceil(Math.max(
		MIN_ORBIT_SIZE,
		118 + Math.sqrt(count) * 62 + count * 5 + maxDropSize * 0.36,
	));
}

function doDropsCollide(a, b) {
	const normalizedX = (a.x - b.x) / (a.radiusX + b.radiusX + DROP_COLLISION_GAP);
	const normalizedY = (a.y - b.y) / (a.radiusY + b.radiusY + DROP_COLLISION_GAP);
	return normalizedX * normalizedX + normalizedY * normalizedY < 1;
}

function findDropPosition({ category, index, orbitSize, radius, placedDrops }) {
	const center = orbitSize / 2;
	const maxRadius = center - Math.max(radius.x, radius.y) - ORBIT_PADDING;
	if (maxRadius <= 0) return { x: center, y: center };

	const seed = getStringSeed(`${category}-${index}`);
	const candidateCount = 180;

	for (let attempt = 0; attempt < candidateCount; attempt += 1) {
		const angle = (index * GOLDEN_ANGLE_DEG + attempt * 53 + seed % 37) * (Math.PI / 180);
		const radiusRatio = Math.sqrt((attempt * 0.127 + (seed % 29) / 29) % 1);
		const candidateRadius = maxRadius * radiusRatio;
		const x = center + Math.cos(angle) * candidateRadius;
		const y = center + Math.sin(angle) * candidateRadius;
		const candidateDrop = { x, y, radiusX: radius.x, radiusY: radius.y };
		const hasCollision = placedDrops.some((drop) => doDropsCollide(candidateDrop, drop));

		if (!hasCollision) return { x, y };
	}

	return null;
}

function getSkillGroupLayout(category, skills) {
	const dropMetrics = skills.map((skill, index) => {
		const width = getStandardSkillDropSize(skill.level);
		return {
			index,
			width,
			height: width * DROP_ASPECT_RATIO,
			radiusX: width * DROP_RADIUS_X_FACTOR,
			radiusY: width * DROP_ASPECT_RATIO * DROP_RADIUS_Y_FACTOR,
		};
	});
	const maxDropSize = Math.max(...dropMetrics.map((drop) => drop.height), 0);
	let orbitSize = getOrbitSize(dropMetrics.length, maxDropSize);

	for (let growthAttempt = 0; growthAttempt < 8; growthAttempt += 1) {
		const placedDrops = [];
		let didPlaceAllDrops = true;

		for (const drop of dropMetrics) {
			const position = findDropPosition({
				category,
				index: drop.index,
				orbitSize,
				radius: { x: drop.radiusX, y: drop.radiusY },
				placedDrops,
			});

			if (!position) {
				didPlaceAllDrops = false;
				break;
			}

			placedDrops.push({ ...drop, ...position });
		}

		if (didPlaceAllDrops) {
			return {
				orbitSize,
				placements: placedDrops.sort((a, b) => a.index - b.index),
			};
		}

		orbitSize += 72;
	}

	return {
		orbitSize,
		placements: dropMetrics.map((drop, index) => {
			const center = orbitSize / 2;
			const angle = (index * GOLDEN_ANGLE_DEG) * (Math.PI / 180);
			const radius = Math.max(0, center - Math.max(drop.radiusX, drop.radiusY) - ORBIT_PADDING);
			return {
				...drop,
				x: center + Math.cos(angle) * radius * 0.62,
				y: center + Math.sin(angle) * radius * 0.62,
			};
		}),
	};
}

function getPlacementStyle(placement) {
	return {
		'--skill-x': `${placement.x.toFixed(1)}px`,
		'--skill-y': `${placement.y.toFixed(1)}px`,
	};
}

function SkillsSkeleton() {
	return (
		<div className="skills-clusters">
			{SKELETON_GROUPS.map((cat, groupIndex) => {
				const skeletonSkills = Array.from({ length: 5 }).map((_, i) => ({ level: 72 + i * 5 }));
				const layout = getSkillGroupLayout(cat, skeletonSkills);

				return (
				<section
					key={cat}
					className={`skills-cluster skills-cluster--${getCategoryClassName(cat)}`}
					style={{ '--skills-orbit-size': `${layout.orbitSize}px` }}
				>
					<div className="skills-cluster__label" style={{ opacity: 0.3 }}>{cat}</div>
					<div className="skills-cluster__orbit">
						{layout.placements.map((placement, i) => (
							<div
								key={i}
								className="skills-cluster__drop skills-cluster__drop--skeleton"
								style={{
									...getPlacementStyle(placement),
									width: `${placement.width}px`,
									height: `${placement.height}px`,
									animation: 'pulse 1.6s ease-in-out infinite',
									animationDelay: `${(i + groupIndex) * 0.1}s`,
								}}
							/>
						))}
					</div>
				</section>
				);
			})}
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
					{Object.entries(grouped).map(([category, items], groupIndex) => {
						const layout = getSkillGroupLayout(category, items);

						return (
						<section
							key={category}
							className={`skills-cluster skills-cluster--${getCategoryClassName(category)}`}
							style={{
								'--cluster-accent': CATEGORY_ACCENTS[category] ?? 'rgba(200, 200, 255, 0.95)',
								'--skills-orbit-size': `${layout.orbitSize}px`,
							}}
						>
							<div className="skills-cluster__label">{category}</div>
							<div className="skills-cluster__orbit">
								{items.map((skill, index) => (
									<div
										key={skill.name}
										className="skills-cluster__drop"
										style={getPlacementStyle(layout.placements[index])}
									>
										<SkillCrystal
											name={skill.name}
											level={skill.level}
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
