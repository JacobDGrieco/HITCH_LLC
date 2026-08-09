// Shared section navigation used by the home scene and routed page shell.
import { Link, NavLink } from 'react-router-dom';
import '../styles/page-shell.css';

const SECTION_NAV_ITEMS = [
	{ section: 'about', label: 'About', route: '/about' },
	{ section: 'projects', label: 'Projects', route: '/projects' },
	{ section: 'experience', label: 'Experience', route: '/experience' },
	{ section: 'education', label: 'Education', route: '/education' },
];

export default function SectionNav({ activeSection, ariaLabel = 'Page sections' }) {
	return (
		<nav className="page-shell__nav" aria-label={ariaLabel}>
			<Link to="/" className="page-shell__nav-cloud" aria-label="Back to homepage" />
			<div className="page-shell__nav-links">
				{SECTION_NAV_ITEMS.map((item) => (
					<NavLink
						key={item.section}
						to={item.route}
						className={({ isActive }) => {
							const isCurrent = isActive || activeSection === item.section;
							return `page-shell__nav-link${isCurrent ? ' page-shell__nav-link--active' : ''}`;
						}}
					>
						{item.label}
					</NavLink>
				))}
			</div>
			<span className="page-shell__nav-orb" aria-hidden="true" />
		</nav>
	);
}
