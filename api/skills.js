import { getDb } from '../lib/db.js';
import { dedupeRowsByTitle } from '../lib/contentDedupe.js';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	try {
		const sql = getDb();
		const rows = await sql`
			SELECT id, title, percentage, skill_group, display_order
			FROM skills
			ORDER BY id ASC
		`;

		res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
		return res.status(200).json({
			skills: dedupeRowsByTitle(rows)
				.map((row) => ({
					name: row.title,
					category: row.skill_group,
					level: row.percentage ?? 0,
				}))
				.filter((skill) => skill.name && skill.category),
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
