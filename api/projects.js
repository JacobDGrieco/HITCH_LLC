// Public Vercel API route that returns normalized project records for ProjectsPage.
import { getDb } from '../lib/db.js';
import { dedupeRowsByTitle } from '../lib/contentDedupe.js';
import { getOptimizedAssetPath } from '../lib/optimizedAssetPath.js';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	try {
		const sql = getDb();
		const rows = await sql`
			SELECT id, title, "desc", tags, icon_image, link_url, color_hex, size, display_order
			FROM projects
			ORDER BY id ASC
		`;

		const projects = dedupeRowsByTitle(rows).map((r) => ({
			id: r.id,
			title: r.title,
			desc: r.desc,
			tags: r.tags ?? [],
			iconImage: getOptimizedAssetPath(r.icon_image),
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
