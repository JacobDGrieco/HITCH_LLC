import { getDb } from '../../lib/db.js';

const sql = getDb();

// ─── Projects ──────────────────────────────────────────────────────────────

const projects = [
  {
    title: 'ASD',
    desc: 'Music promo platform with artist pages, album and song routes, admin tools, and Prisma-backed media workflows.',
    tags: ['React', 'Vercel', 'Prisma', 'REST APIs'],
    icon_image: '/asd.png',
    github_url: null,
    live_url: 'https://www.asdrecords.net',
    gem_color: 'rgba(120,210,255,0.92)',
    size: 328,
    featured: false,
    display_order: 1,
  },
  {
    title: 'UK HealthCare Staffing Tool',
    desc: 'Full-stack scheduling system with week views, Gantt interactions, clinic templates, and PDF export workflows.',
    tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'SQLAlchemy'],
    icon_image: '/staffingtool.png',
    github_url: 'https://github.com/Daratheon/Staffing-Tool-UK',
    live_url: 'https://staffing-tool-uk.onrender.com/',
    gem_color: 'rgba(245,175,210,0.92)',
    size: 334,
    featured: true,
    display_order: 2,
  },
  {
    title: 'PokémonPGC',
    desc: 'Post-game checklist & Pokédex tracker across multiple titles. Migrated to React 18 with Prisma-backed sync.',
    tags: ['React', 'Node.js', 'Prisma', 'SQL'],
    icon_image: '/ppgc.png',
    github_url: null,
    live_url: 'https://www.pokemonpgc.com/',
    gem_color: 'rgba(200,185,255,0.92)',
    size: 320,
    featured: false,
    display_order: 3,
  },
  {
    title: 'RelaTime',
    desc: 'Relationship graph editor with a built-in timeline for tracking how nodes and connections evolve over time.',
    tags: ['React', 'JavaScript', 'Cytoscape.js', 'JSZip'],
    icon_image: '/relatime.png',
    github_url: null,
    live_url: 'https://www.relatime.org/',
    gem_color: 'rgba(175,220,255,0.92)',
    size: 300,
    featured: true,
    display_order: 4,
  },
];

for (const p of projects) {
  await sql`
    INSERT INTO projects (title, desc, tags, icon_image, github_url, live_url, gem_color, size, featured, display_order)
    VALUES (${p.title}, ${p.desc}, ${p.tags}, ${p.icon_image}, ${p.github_url}, ${p.live_url}, ${p.gem_color}, ${p.size}, ${p.featured}, ${p.display_order})
    ON CONFLICT DO NOTHING
  `;
}
console.log('Projects seeded.');

// ─── Skills ────────────────────────────────────────────────────────────────

const skills = [
  { name: 'React',             category: 'Frontend', level: 90, display_order: 1 },
  { name: 'JavaScript',        category: 'Frontend', level: 88, display_order: 2 },
  { name: 'HTML & CSS',        category: 'Frontend', level: 92, display_order: 3 },
  { name: 'Tailwind CSS',      category: 'Frontend', level: 82, display_order: 4 },
  { name: 'Vite / Webpack',    category: 'Frontend', level: 75, display_order: 5 },
  { name: 'FastAPI / Python',  category: 'Backend',  level: 85, display_order: 1 },
  { name: 'Node.js / Express', category: 'Backend',  level: 80, display_order: 2 },
  { name: 'SQL / PostgreSQL',  category: 'Backend',  level: 82, display_order: 3 },
  { name: 'SQLAlchemy / Prisma', category: 'Backend', level: 78, display_order: 4 },
  { name: 'REST API Design',   category: 'Backend',  level: 85, display_order: 5 },
  { name: 'Git / GitHub',      category: 'Tools',    level: 90, display_order: 1 },
  { name: 'Vercel / Deployment', category: 'Tools',  level: 80, display_order: 2 },
  { name: 'Java',              category: 'Tools',    level: 72, display_order: 3 },
  { name: 'C / C++',          category: 'Tools',    level: 65, display_order: 4 },
  { name: 'PHP',               category: 'Tools',    level: 60, display_order: 5 },
];

for (const s of skills) {
  await sql`
    INSERT INTO skills (name, category, level, display_order)
    VALUES (${s.name}, ${s.category}, ${s.level}, ${s.display_order})
    ON CONFLICT DO NOTHING
  `;
}
console.log('Skills seeded.');

// ─── Experience ────────────────────────────────────────────────────────────

const experience = [
  {
    title: 'UK HealthCare Staffing Tool',
    role: 'Full-Stack Developer | CS499 Capstone',
    date_range: 'Jan 2026 - May 2026',
    desc: 'Building a production-ready scheduling system for UK HealthCare clinic managers with a Gantt-style UI, role-based access, and automated email reminders.',
    tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'REST APIs'],
    icon_image: '/staffingtool.png',
    gem_color: 'rgba(0, 41, 122, 0.96)',
    size: 350,
    featured: true,
    class_name: 'experience-page__crystal experience-page__crystal--product',
    display_order: 1,
  },
  {
    title: 'University of Kentucky Housing',
    role: 'Front Desk Clerk',
    date_range: 'Feb 2024 - May 2026',
    desc: 'Handled front-line housing operations, key and package management, resident support, and emergency-response coordination.',
    tags: ['Operations', 'Resident Support', 'Customer Service'],
    icon_image: '/staffingtool.png',
    gem_color: 'rgba(16, 38, 104, 0.95)',
    size: 330,
    featured: true,
    class_name: 'experience-page__crystal experience-page__crystal--operations',
    display_order: 2,
  },
];

for (const e of experience) {
  await sql`
    INSERT INTO experience (title, role, date_range, desc, tags, icon_image, gem_color, size, featured, class_name, display_order)
    VALUES (${e.title}, ${e.role}, ${e.date_range}, ${e.desc}, ${e.tags}, ${e.icon_image}, ${e.gem_color}, ${e.size}, ${e.featured}, ${e.class_name}, ${e.display_order})
    ON CONFLICT DO NOTHING
  `;
}
console.log('Experience seeded.');

// ─── Education ─────────────────────────────────────────────────────────────

const education = [
  {
    title: 'B.S. — Computer Science',
    desc: 'Built a strong foundation in software development, algorithms, systems, and problem-solving through broad computer science coursework. The program emphasizes both technical theory and practical application in real-world software design.',
    gem_color: 'rgba(0, 51, 160, 0.9)',
    icon_image: '/staffingtool.png',
    size: 410,
    featured: true,
    class_name: 'education-page__crystal education-page__crystal--major',
    display_order: 1,
  },
  {
    title: 'Minor — Mathematics',
    desc: 'Strengthened quantitative reasoning and analytical problem-solving through advanced mathematics coursework. The minor reinforces logic, precision, and structured thinking alongside technical work.',
    gem_color: 'rgba(69, 134, 255, 0.82)',
    icon_image: '/staffingtool.png',
    size: 350,
    featured: false,
    class_name: 'education-page__crystal education-page__crystal--minor',
    display_order: 2,
  },
  {
    title: 'Artificial Intelligence',
    desc: 'AI, machine learning, and responsible use of data-driven systems.',
    gem_color: 'rgba(35, 87, 208, 0.86)',
    icon_image: '/staffingtool.png',
    size: 280,
    featured: false,
    class_name: 'education-page__crystal education-page__crystal--certificate education-page__crystal--ai',
    display_order: 3,
  },
  {
    title: 'Cybersecurity',
    desc: 'System protection, cyber threats, and core security principles across software, networks, and data.',
    gem_color: 'rgba(16, 38, 104, 0.9)',
    icon_image: '/staffingtool.png',
    size: 280,
    featured: false,
    class_name: 'education-page__crystal education-page__crystal--certificate education-page__crystal--cyber',
    display_order: 4,
  },
];

for (const e of education) {
  await sql`
    INSERT INTO education_items (title, desc, gem_color, icon_image, size, featured, class_name, display_order)
    VALUES (${e.title}, ${e.desc}, ${e.gem_color}, ${e.icon_image}, ${e.size}, ${e.featured}, ${e.class_name}, ${e.display_order})
    ON CONFLICT DO NOTHING
  `;
}
console.log('Education seeded.');
console.log('Done.');
