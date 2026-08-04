// Keeps page data warm across route remounts so navigation does not return to skeleton loading states.
const PROJECTS_FALLBACK = [
	{
		id: 'a.s.d',
		title: 'A.S.D',
		desc: 'Music promo platform with artist pages, album and song routes, admin tools, and Prisma-backed media workflows.',
		tags: ['React', 'Vercel', 'Prisma', 'REST APIs'],
		iconImage: '/projects/asd.png',
		live: 'https://www.asdrecords.net',
		gemColor: 'rgba(120,210,255,0.92)',
		size: 370,
		className: 'projects-page__crystal',
	},
	{
		id: 'staffing-tool',
		title: 'UK HealthCare Staffing Tool',
		desc: 'Full-stack scheduling system with week views, Gantt interactions, clinic templates, and PDF export workflows.',
		tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'SQLAlchemy'],
		iconImage: '/projects/staffingtool.png',
		github: 'https://github.com/Daratheon/Staffing-Tool-UK',
		live: 'https://staffing-tool-uk.onrender.com/',
		featured: true,
		gemColor: 'rgba(245,175,210,0.92)',
		size: 378,
		className: 'projects-page__crystal',
	},
	{
		id: 'pokemon',
		title: 'PokemonPGC',
		desc: 'Post-game checklist and Pokedex tracker across multiple titles. Migrated to React 18 with Prisma-backed sync.',
		tags: ['React', 'Node.js', 'Prisma', 'SQL'],
		iconImage: '/projects/ppgc.png',
		live: 'https://www.pokemonpgc.com/',
		gemColor: 'rgba(200,185,255,0.92)',
		size: 362,
		className: 'projects-page__crystal',
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		desc: 'Relationship graph editor with a built-in timeline for tracking how nodes and connections evolve over time.',
		tags: ['React', 'JavaScript', 'Cytoscape.js', 'JSZip'],
		iconImage: '/projects/relatime.png',
		live: 'https://www.relatime.org/',
		featured: true,
		gemColor: 'rgba(175,220,255,0.92)',
		size: 340,
		className: 'projects-page__crystal',
	},
];

const SKILLS_FALLBACK = [
	{ name: 'React', category: 'Frontend', level: 90 },
	{ name: 'JavaScript', category: 'Frontend', level: 88 },
	{ name: 'HTML & CSS', category: 'Frontend', level: 92 },
	{ name: 'Tailwind CSS', category: 'Frontend', level: 82 },
	{ name: 'Vite / Webpack', category: 'Frontend', level: 75 },
	{ name: 'FastAPI / Python', category: 'Backend', level: 85 },
	{ name: 'Node.js / Express', category: 'Backend', level: 80 },
	{ name: 'SQL / PostgreSQL', category: 'Backend', level: 82 },
	{ name: 'SQLAlchemy / Prisma', category: 'Backend', level: 78 },
	{ name: 'REST API Design', category: 'Backend', level: 85 },
	{ name: 'Git / GitHub', category: 'Tools', level: 90 },
	{ name: 'Vercel / Deployment', category: 'Tools', level: 80 },
	{ name: 'Java', category: 'Tools', level: 72 },
	{ name: 'C / C++', category: 'Tools', level: 65 },
	{ name: 'PHP', category: 'Tools', level: 60 },
];

const EDUCATION_FALLBACK = [
	{
		id: 'cs',
		title: 'B.S. - Computer Science',
		desc: 'Built a strong foundation in software development, algorithms, systems, and problem-solving through broad computer science coursework. The program emphasizes both technical theory and practical application in real-world software design.',
		gemColor: 'rgba(0, 51, 160, 0.9)',
		iconImage: '/projects/staffingtool.png',
		size: 462,
		featured: true,
		className: 'education-page__crystal education-page__crystal--major',
	},
	{
		id: 'math',
		title: 'Minor - Mathematics',
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

const EXPERIENCE_FALLBACK = [
	{
		id: 'staffing',
		title: 'UK HealthCare Staffing Tool',
		role: 'Full-Stack Developer | CS499 Capstone',
		dateRange: 'Jan 2026 - May 2026',
		desc: 'Building a production-ready scheduling system for UK HealthCare clinic managers with a Gantt-style UI, role-based access, and automated email reminders.',
		tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'REST APIs'],
		iconImage: '/projects/staffingtool.png',
		gemColor: 'rgba(0, 41, 122, 0.96)',
		size: 402,
		featured: true,
		className: 'experience-page__crystal experience-page__crystal--product',
	},
	{
		id: 'housing',
		title: 'University of Kentucky Housing',
		role: 'Front Desk Clerk',
		dateRange: 'Feb 2024 - May 2026',
		desc: 'Handled front-line housing operations, key and package management, resident support, and emergency-response coordination.',
		tags: ['Operations', 'Resident Support', 'Customer Service'],
		iconImage: '/projects/staffingtool.png',
		gemColor: 'rgba(16, 38, 104, 0.95)',
		size: 378,
		featured: true,
		className: 'experience-page__crystal experience-page__crystal--operations',
	},
];

function normalizeList(data, fallback) {
	return Array.isArray(data) && data.length ? data : fallback;
}

function preloadImages(items) {
	if (typeof Image === 'undefined') return;

	items.forEach((item) => {
		if (!item.iconImage) return;

		const image = new Image();
		image.src = item.iconImage;
	});
}

function createCachedApiLoader({ url, field, fallback, shouldPreloadImages = false }) {
	let cache = null;
	let request = null;

	function getCachedData() {
		return cache;
	}

	function loadData() {
		if (cache) return Promise.resolve(cache);
		if (request) return request;

		request = fetch(url)
			.then((response) => {
				if (!response.ok) throw new Error(`${field} request failed with status ${response.status}`);
				return response.json();
			})
			.then((payload) => {
				cache = normalizeList(payload?.[field], fallback);
				if (shouldPreloadImages) preloadImages(cache);
				return cache;
			})
			.catch(() => {
				cache = fallback;
				if (shouldPreloadImages) preloadImages(cache);
				return cache;
			})
			.finally(() => {
				request = null;
			});

		return request;
	}

	return { getCachedData, loadData };
}

const projectsLoader = createCachedApiLoader({
	url: '/api/projects',
	field: 'projects',
	fallback: PROJECTS_FALLBACK,
	shouldPreloadImages: true,
});

const skillsLoader = createCachedApiLoader({
	url: '/api/skills',
	field: 'skills',
	fallback: SKILLS_FALLBACK,
});

const educationLoader = createCachedApiLoader({
	url: '/api/education',
	field: 'education',
	fallback: EDUCATION_FALLBACK,
	shouldPreloadImages: true,
});

const experienceLoader = createCachedApiLoader({
	url: '/api/experience',
	field: 'experience',
	fallback: EXPERIENCE_FALLBACK,
	shouldPreloadImages: true,
});

export const getCachedProjectsPageData = projectsLoader.getCachedData;
export const loadProjectsPageData = projectsLoader.loadData;
export const getCachedSkillsPageData = skillsLoader.getCachedData;
export const loadSkillsPageData = skillsLoader.loadData;
export const getCachedEducationPageData = educationLoader.getCachedData;
export const loadEducationPageData = educationLoader.loadData;
export const getCachedExperiencePageData = experienceLoader.getCachedData;
export const loadExperiencePageData = experienceLoader.loadData;
