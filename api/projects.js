import { getDb } from '../lib/db.js';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	try {
		const sql = getDb();
		const rows = await sql`
			SELECT id, title, "desc", tags, icon_image, link_url, color_hex, size
			FROM projects
			ORDER BY display_order ASC
		`;

		const projects = rows.map((r) => ({
			id: r.id,
			title: r.title,
			desc: r.desc,
			tags: r.tags ?? [],
			iconImage: r.icon_image,
			link: r.link_url,
			gemColor: r.color_hex ?? undefined,
			size: r.size ?? 1,
			featured: false,
			className: 'projects-page__crystal',
		}));

		res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
		return res.status(200).json({ projects });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
