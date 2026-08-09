// Normalizes and dedupes database content rows before public page APIs return them.
// Read-side guard for legacy seed duplicates. The public site should never write
// content rows, but this keeps page output stable if duplicate titles exist.
export function normalizeContentTitle(value) {
	return String(value ?? '')
		.replace(/Ã©/g, 'e')
		.replace(/â€”/g, '-')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '');
}

export function dedupeRowsByTitle(rows) {
	const rowsByTitle = new Map();

	for (const row of rows) {
		const key = normalizeContentTitle(row.title);
		if (!key) continue;
		if (!rowsByTitle.has(key)) rowsByTitle.set(key, row);
	}

	return [...rowsByTitle.values()].sort((a, b) => {
		const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
		const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
		return orderA - orderB || a.id - b.id;
	});
}
