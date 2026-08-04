import { getDb } from '../lib/db.js';
import { dedupeRowsByTitle } from '../lib/contentDedupe.js';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	try {
		const sql = getDb();
		const rows = await sql`
			SELECT id, title, role, date_range, "desc", tags, icon_image, color_hex, size, display_order
			FROM experience
			ORDER BY id ASC
		`;

		const experience = dedupeRowsByTitle(rows).map((r) => ({
			id: r.id,
			title: r.title,
			role: r.role,
			dateRange: r.date_range,
			desc: r.desc,
			tags: r.tags ?? [],
			iconImage: r.icon_image,
			gemColor: r.color_hex ?? undefined,
			size: r.size ?? 1,
			featured: false,
			className: 'experience-page__crystal',
		}));

		res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
		return res.status(200).json({ experience });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
