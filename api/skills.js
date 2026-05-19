import { getDb } from '../lib/db.js';

export default async function handler(req, res) {
	if (req.method !== 'GET') return res.status(405).end();

	try {
		const sql = getDb();
		const rows = await sql`
			SELECT name, category, level
			FROM skills
			ORDER BY category ASC, display_order ASC
		`;

		res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
		return res.status(200).json({ skills: rows });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
