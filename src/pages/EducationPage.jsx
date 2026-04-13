import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/shared.css';
import '../styles/education-page.css';
import CrystalCard from '../components/CrystalCard';

const EDUCATION_CRYSTALS = [
	{
		title: 'B.S. Computer Science',
		desc: 'Built a strong foundation in software development, algorithms, systems, and problem-solving through broad computer science coursework. The program emphasizes both technical theory and practical application in designing real-world software.',
		gemColor: 'rgba(175,220,255,0.92)',
		iconImage: '/staffingtool.png',
		size: 380,
		featured: true,
	},
	{
		title: 'Minor Mathematics',
		desc: 'Strengthened quantitative reasoning and analytical problem-solving through advanced mathematics coursework. The minor complements technical work by reinforcing logic, precision, and structured thinking.',
		gemColor: 'rgba(80,130,200,0.8)',
		iconImage: '/staffingtool.png',
		size: 320,
	},
	{
		title: 'Articifical Intelligence',
		desc: 'Gained interdisciplinary exposure to artificial intelligence, machine learning, and the ethical use of data-driven technologies. The certificate helps connect emerging AI concepts to practical and responsible real-world use.',
		gemColor: 'rgba(80,130,200,0.8)',
		iconImage: '/staffingtool.png',
		size: 280,
	},
	{
		title: 'Cybersecurity',
		desc: 'Built foundational knowledge in protecting systems, understanding cyber threats, and applying security principles across modern digital environments. The certificate supports practical awareness of security challenges in software, networks, and data protection.',
		gemColor: 'rgba(150,80,190,0.8)',
		iconImage: '/staffingtool.png',
		size: 280,
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
					<CrystalCard key={item.title} {...item} />
				))}
			</div>
		</div>
	);
}
