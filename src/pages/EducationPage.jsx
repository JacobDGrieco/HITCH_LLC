import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/shared.css';
import '../styles/education-page.css';
import DropCard from '../components/DropCard';
import { getCachedEducationPageData, loadEducationPageData } from '../lib/pageDataCache';

function DropCardSkeleton({ size = 318, enterDelay = 0 }) {
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

export default function EducationPage() {
	const [cachedAtMount] = useState(() => getCachedEducationPageData());
	const [education, setEducation] = useState(cachedAtMount);
	const rowRef = useRef(null);

	useEffect(() => {
		let isActive = true;

		loadEducationPageData().then((loadedEducation) => {
			if (isActive) setEducation(loadedEducation);
		});

		return () => {
			isActive = false;
		};
	}, []);

	useEffect(() => {
		if (!education || !rowRef.current) return;
		gsap.fromTo(rowRef.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' });
	}, [education]);

	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Education</div>
				<div className="page-subtitle">academic background</div>
			</div>

			<div className="page-crystal-row education-page__crystals" ref={rowRef}>
				{education === null ? (
					[462, 396, 318, 318].map((size, i) => <DropCardSkeleton key={i} size={size} enterDelay={i * 85} />)
				) : (
					education.map((item, index) => (
						<DropCard key={item.id} {...item} enterDelay={index * 85} />
					))
				)}
			</div>
		</div>
	);
}
