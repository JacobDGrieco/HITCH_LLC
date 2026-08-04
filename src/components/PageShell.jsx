import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSiteChrome } from './chrome/useSiteChrome';
import '../styles/page-shell.css';

const RETURN_SECTION_STORAGE_KEY = 'cloudsHomeReturnSection';
const PAGE_NAV_ITEMS = [
	{ section: 'projects', label: 'Projects', route: '/projects' },
	{ section: 'about', label: 'About', route: '/about' },
	{ section: 'skills', label: 'Skills', route: '/skills' },
	{ section: 'education', label: 'Education', route: '/education' },
	{ section: 'experience', label: 'Experience', route: '/experience' },
	{ section: 'contact', label: 'Contact', route: '/contact' },
];

export default function PageShell({ children, section = 'default' }) {
	const navigate = useNavigate();
	const { setDasHidden } = useSiteChrome();
	const [contentVisible, setContentVisible] = useState(false);
	const [returning, setReturning] = useState(false);

	useEffect(() => {
		setDasHidden(false);

		const contentTimer = setTimeout(() => setContentVisible(true), 700);

		return () => {
			clearTimeout(contentTimer);
		};
	}, [setDasHidden]);

	function handleBack() {
		if (returning) return;
		setDasHidden(true);
		setContentVisible(false);
		setReturning(true);
		window.sessionStorage.setItem(RETURN_SECTION_STORAGE_KEY, section);
		setTimeout(() => navigate('/'), 720);
	}

	return (
		<>
			<div className={`page-shell__sky page-shell__sky--${section}`} />

			<div className={`page-shell__overlay page-shell__overlay--${section} page-shell__overlay--visible ${returning ? 'page-shell__overlay--returning' : ''}`}>
				<div className="page-shell__wisps" />

				<button type="button" onClick={handleBack} className="page-shell__back">
					Back to the sky
				</button>

				<nav className="page-shell__nav" aria-label="Page sections">
					<div className="page-shell__nav-links">
						{PAGE_NAV_ITEMS.map((item) => (
							<NavLink
								key={item.section}
								to={item.route}
								className={({ isActive }) => `page-shell__nav-link${isActive ? ' page-shell__nav-link--active' : ''}`}
							>
								{item.label}
							</NavLink>
						))}
					</div>
				</nav>

				<div className={`page-shell__content ${contentVisible ? 'page-shell__content--visible' : 'page-shell__content--hidden'}`}>
					{children}
				</div>
			</div>
		</>
	);
}
