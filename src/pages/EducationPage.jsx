import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/shared.css';
import '../styles/education-page.css';
import DropCard from '../components/DropCard';

const FALLBACK = [
	{
		id: 'cs',
		title: 'B.S. — Computer Science',
		desc: 'Built a strong foundation in software development, algorithms, systems, and problem-solving through broad computer science coursework. The program emphasizes both technical theory and practical application in real-world software design.',
		gemColor: 'rgba(0, 51, 160, 0.9)',
		iconImage: '/projects/staffingtool.png',
		size: 462,
		featured: true,
		className: 'education-page__crystal education-page__crystal--major',
	},
	{
		id: 'math',
		title: 'Minor — Mathematics',
		desc: 'Strengthened quantitative reasoning and analytical problem-solving through advanced mathematics coursework. The minor reinforces logic, precision, and structured thinking alongside technical work.',
		gemColor: 'rgba(69, 134, 255, 0.82)',
		iconImage: '/projects/staffingtool.png',
		size: 396,
		featured: false,
		className: 'education-page__crystal education-page__crystal--minor',
	},
	{
		id: 'ai',
		title: 'Artificial Intelligence',
		desc: 'AI, machine learning, and responsible use of data-driven systems.',
		gemColor: 'rgba(35, 87, 208, 0.86)',
		iconImage: '/projects/staffingtool.png',
		size: 318,
		featured: false,
		className: 'education-page__crystal education-page__crystal--certificate education-page__crystal--ai',
	},
	{
		id: 'cyber',
		title: 'Cybersecurity',
		desc: 'System protection, cyber threats, and core security principles across software, networks, and data.',
		gemColor: 'rgba(16, 38, 104, 0.9)',
		iconImage: '/projects/staffingtool.png',
		size: 318,
		featured: false,
		className: 'education-page__crystal education-page__crystal--certificate education-page__crystal--cyber',
	},
];

function DropCardSkeleton({ size = 318 }) {
	return (
		<div
			className="drop-card drop-card--skeleton"
			style={{
				'--drop-w': `${size}px`,
			}}
		/>
	);
}

export default function EducationPage() {
	const [education, setEducation] = useState(null);
	const rowRef = useRef(null);

	useEffect(() => {
		fetch('/api/education')
			.then((r) => {
				if (!r.ok) throw new Error(`Education request failed with status ${r.status}`);
				return r.json();
			})
			.then(({ education: data }) => setEducation(Array.isArray(data) && data.length ? data : FALLBACK))
			.catch(() => setEducation(FALLBACK));
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
					[462, 396, 318, 318].map((size, i) => <DropCardSkeleton key={i} size={size} />)
				) : (
					education.map((item) => (
						<DropCard key={item.id} {...item} />
					))
				)}
			</div>
		</div>
	);
}
