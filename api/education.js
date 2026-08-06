import { getDb } from '../lib/db.js';
import { dedupeRowsByTitle } from '../lib/contentDedupe.js';
import { getOptimizedAssetPath } from '../lib/optimizedAssetPath.js';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	try {
		const sql = getDb();
		const rows = await sql`
			SELECT id, title, "desc", color_hex, icon_image, size, display_order
			FROM education_items
			ORDER BY id ASC
		`;

		const education = dedupeRowsByTitle(rows).map((r) => ({
			id: r.id,
			title: r.title,
			desc: r.desc,
			gemColor: r.color_hex ?? undefined,
			iconImage: getOptimizedAssetPath(r.icon_image),
			size: r.size ?? 1,
			featured: false,
			className: 'education-page__crystal',
		}));

		res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
		return res.status(200).json({ education });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
