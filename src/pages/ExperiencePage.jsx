import { useEffect, useState } from 'react';
import '../styles/shared.css';
import '../styles/experience-page.css';
import DropCard from '../components/DropCard';
import { getCachedExperiencePageData, loadExperiencePageData } from '../lib/pageDataCache';

function buildDesc(item) {
	return [item.role, item.dateRange, item.desc].filter(Boolean).join('\n');
}

function DropCardSkeleton({ size = 390, enterDelay = 0 }) {
	return (
		<div
			className="drop-card drop-card--skeleton"
			style={{
				'--drop-w': `${size}px`,
				'--drop-enter-delay': `${enterDelay}ms`,
			}}
		/>
	);
}

export default function ExperiencePage() {
	const [cachedAtMount] = useState(() => getCachedExperiencePageData());
	const [experience, setExperience] = useState(cachedAtMount);

	useEffect(() => {
		let isActive = true;

		loadExperiencePageData().then((loadedExperience) => {
			if (isActive) setExperience(loadedExperience);
		});

		return () => {
			isActive = false;
		};
	}, []);

	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Experience</div>
				<div className="page-subtitle">where I&apos;ve contributed</div>
			</div>

			<div className="page-crystal-row experience-page__crystals">
				{experience === null ? (
					[402, 378].map((size, i) => <DropCardSkeleton key={i} size={size} enterDelay={i * 90} />)
				) : (
					experience.map((item, index) => (
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
							enterDelay={index * 90}
						/>
					))
				)}
			</div>
		</div>
	);
}
