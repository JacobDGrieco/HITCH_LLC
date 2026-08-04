import { getDb } from '../lib/db.js';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	try {
		const sql = getDb();
		const rows = await sql`
			SELECT title, percentage, skill_group
			FROM skills
			ORDER BY skill_group ASC, display_order ASC
		`;

		res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
		return res.status(200).json({
			skills: rows
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
