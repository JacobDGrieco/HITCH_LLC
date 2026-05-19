import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/shared.css';
import '../styles/education-page.css';
import DropCard from '../components/DropCard';

const EDUCATION_CRYSTALS = [
	{
		title: 'B.S. — Computer Science',
		desc: 'Built a strong foundation in software development, algorithms, systems, and problem-solving through broad computer science coursework. The program emphasizes both technical theory and practical application in real-world software design.',
		gemColor: 'rgba(0, 51, 160, 0.9)',
		iconImage: '/staffingtool.png',
		size: 410,
		featured: true,
		className: 'education-page__crystal education-page__crystal--major',
	},
	{
		title: 'Minor — Mathematics',
		desc: 'Strengthened quantitative reasoning and analytical problem-solving through advanced mathematics coursework. The minor reinforces logic, precision, and structured thinking alongside technical work.',
		gemColor: 'rgba(69, 134, 255, 0.82)',
		iconImage: '/staffingtool.png',
		size: 350,
		className: 'education-page__crystal education-page__crystal--minor',
	},
	{
		title: 'Artificial Intelligence',
		desc: 'AI, machine learning, and responsible use of data-driven systems.',
		gemColor: 'rgba(35, 87, 208, 0.86)',
		iconImage: '/staffingtool.png',
		size: 280,
		className: 'education-page__crystal education-page__crystal--certificate education-page__crystal--ai',
	},
	{
		title: 'Cybersecurity',
		desc: 'System protection, cyber threats, and core security principles across software, networks, and data.',
		gemColor: 'rgba(16, 38, 104, 0.9)',
		iconImage: '/staffingtool.png',
		size: 280,
		className: 'education-page__crystal education-page__crystal--certificate education-page__crystal--cyber',
	},
];

export default function EducationPage() {
	const degreeRef = useRef(null);
	const certsRef = useRef(null);
	const courseRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(degreeRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
		gsap.fromTo(certsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' });
		gsap.fromTo(courseRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.28, ease: 'power2.out' });
	}, []);

	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Education</div>
				<div className="page-subtitle">academic background</div>
			</div>

			<div className="page-crystal-row education-page__crystals">
				{EDUCATION_CRYSTALS.map((item) => (
					<DropCard key={item.title} {...item} />
				))}
			</div>
		</div>
	);
}
