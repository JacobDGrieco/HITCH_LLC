import { getDb } from '../../lib/db.js';

const sql = getDb();

// ─── Projects ──────────────────────────────────────────────────────────────

const projects = [
  {
    title: 'ASD',
    desc: 'Music promo platform with artist pages, album and song routes, admin tools, and Prisma-backed media workflows.',
    tags: ['React', 'Vercel', 'Prisma', 'REST APIs'],
    icon_image: '/projects/asd.png',
    link_url: 'https://www.asdrecords.net',
    color_hex: '#78d2ff',
    size: 0.96,
    display_order: 1,
  },
  {
    title: 'UK HealthCare Staffing Tool',
    desc: 'Full-stack scheduling system with week views, Gantt interactions, clinic templates, and PDF export workflows.',
    tags: ['React', 'FastAPI / Python', 'PostgreSQL', 'SQLAlchemy'],
    icon_image: '/projects/uky.png',
    link_url: 'https://github.com/Daratheon/Staffing-Tool-UK',
    color_hex: '#f5afd2',
    size: 0.98,
    display_order: 2,
  },
  {
    title: 'PokémonPGC',
    desc: 'Post-game checklist & Pokédex tracker across multiple titles. Migrated to React 18 with Prisma-backed sync.',
    tags: ['React', 'Node.js', 'Prisma', 'SQL'],
    icon_image: '/projects/ppgc.png',
    link_url: 'https://www.pokemonpgc.com/',
    color_hex: '#c8b9ff',
    size: 0.94,
    display_order: 3,
  },
  {
    title: 'RelaTime',
    desc: 'Relationship graph editor with a built-in timeline for tracking how nodes and connections evolve over time.',
    tags: ['React', 'JavaScript', 'Cytoscape.js', 'JSZip'],
    icon_image: '/projects/relatime.png',
    link_url: 'https://www.relatime.org/',
    color_hex: '#afdfff',
    size: 0.88,
    display_order: 4,
  },
];

for (const p of projects) {
  await sql`
    INSERT INTO projects (title, "desc", tags, icon_image, link_url, color_hex, size, display_order)
    VALUES (${p.title}, ${p.desc}, ${p.tags}, ${p.icon_image}, ${p.link_url}, ${p.color_hex}, ${p.size}, ${p.display_order})
    ON CONFLICT DO NOTHING
  `;
}
console.log('Projects seeded.');

// ─── Skills ────────────────────────────────────────────────────────────────

const skills = [
  { title: 'React',             skill_group: 'Web Development', percentage: 90, display_order: 1 },
  { title: 'JavaScript/JSX',    skill_group: 'Programming Languages', percentage: 88, display_order: 2 },
  { title: 'HTML5',             skill_group: 'Web Development', percentage: 98, display_order: 3 },
  { title: 'Node.js',           skill_group: 'Backend', percentage: 80, display_order: 1 },
  { title: 'SQL',               skill_group: 'Programming Languages', percentage: null, display_order: 1 },
];

for (const s of skills) {
  await sql`
    INSERT INTO skills (title, percentage, skill_group, display_order)
    VALUES (${s.title}, ${s.percentage}, ${s.skill_group}, ${s.display_order})
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
    icon_image: '/projects/uky.png',
    color_hex: '#00297a',
    size: 1.03,
    display_order: 1,
  },
  {
    title: 'University of Kentucky Housing',
    role: 'Front Desk Clerk',
    date_range: 'Feb 2024 - May 2026',
    desc: 'Handled front-line housing operations, key and package management, resident support, and emergency-response coordination.',
    tags: ['Operations', 'Resident Support', 'Customer Service'],
    icon_image: '/projects/uky.png',
    color_hex: '#102668',
    size: 0.97,
    display_order: 2,
  },
];

for (const e of experience) {
  await sql`
    INSERT INTO experience (title, role, date_range, "desc", tags, icon_image, color_hex, size, display_order)
    VALUES (${e.title}, ${e.role}, ${e.date_range}, ${e.desc}, ${e.tags}, ${e.icon_image}, ${e.color_hex}, ${e.size}, ${e.display_order})
    ON CONFLICT DO NOTHING
  `;
}
console.log('Experience seeded.');

// ─── Education ─────────────────────────────────────────────────────────────

const education = [
  {
    title: 'B.S. — Computer Science',
    desc: 'Built a strong foundation in software development, algorithms, systems, and problem-solving through broad computer science coursework. The program emphasizes both technical theory and practical application in real-world software design.',
    color_hex: '#0033a0',
    icon_image: '/projects/uky.png',
    size: 1.21,
    display_order: 1,
  },
  {
    title: 'Minor — Mathematics',
    desc: 'Strengthened quantitative reasoning and analytical problem-solving through advanced mathematics coursework. The minor reinforces logic, precision, and structured thinking alongside technical work.',
    color_hex: '#4586ff',
    icon_image: '/projects/uky.png',
    size: 1.03,
    display_order: 2,
  },
  {
    title: 'Artificial Intelligence',
    desc: 'AI, machine learning, and responsible use of data-driven systems.',
    color_hex: '#2357d0',
    icon_image: '/projects/uky.png',
    size: 0.82,
    display_order: 3,
  },
  {
    title: 'Cybersecurity',
    desc: 'System protection, cyber threats, and core security principles across software, networks, and data.',
    color_hex: '#102668',
    icon_image: '/projects/uky.png',
    size: 0.82,
    display_order: 4,
  },
];

for (const e of education) {
  await sql`
    INSERT INTO education_items (title, "desc", color_hex, icon_image, size, display_order)
    VALUES (${e.title}, ${e.desc}, ${e.color_hex}, ${e.icon_image}, ${e.size}, ${e.display_order})
    ON CONFLICT DO NOTHING
  `;
}
console.log('Education seeded.');
console.log('Done.');
