import { getDb } from '../lib/db.js';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	try {
		const sql = getDb();
		const rows = await sql`
			SELECT id, title, desc, tags, icon_image, github_url, live_url, gem_color, size, featured
			FROM projects
			ORDER BY display_order ASC
		`;

		const projects = rows.map((r) => ({
			id: r.id,
			title: r.title,
			desc: r.desc,
			tags: r.tags ?? [],
			iconImage: r.icon_image,
			github: r.github_url,
			live: r.live_url,
			gemColor: r.gem_color,
			size: r.size,
			featured: r.featured,
			className: 'projects-page__crystal',
		}));

		res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
		return res.status(200).json({ projects });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
