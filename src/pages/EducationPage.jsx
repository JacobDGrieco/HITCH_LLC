import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/shared.css';
import '../styles/education-page.css';
import CrystalCard from '../components/CrystalCard';

const EDUCATION_CRYSTALS = [
	{
		title: 'Articifical Intelligence',
		gemColor: 'rgba(80,130,200,0.8)',
		iconImage: '/staffingtool.png',
		size: 230,
	},
	{
		title: 'B.S. Computer Science',
		desc: 'University of Kentucky with a math minor and broad software systems coursework.',
		gemColor: 'rgba(175,220,255,0.92)',
		iconImage: '/staffingtool.png',
		size: 330,
		featured: true,
	},
	{
		title: 'Minor Mathematics',
		gemColor: 'rgba(80,130,200,0.8)',
		iconImage: '/staffingtool.png',
		size: 270,
	},
	{
		title: 'Cybersecurity',
		gemColor: 'rgba(150,80,190,0.8)',
		iconImage: '/staffingtool.png',
		size: 230,
	},
];

function softAccent(accent) {
	return accent.replace('0.8', '0.1');
}

function borderAccent(accent) {
	return accent.replace('0.8', '0.3');
}

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
					<CrystalCard key={item.title} {...item} />
				))}
			</div>
		</div>
	);
}
