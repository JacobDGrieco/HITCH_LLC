import { Readable } from 'node:stream';
import { get } from '@vercel/blob';

export default async function handler(request, response) {
	if (!globalThis.process?.env?.BLOB_READ_WRITE_TOKEN) {
		return response.status(500).send('Missing BLOB_READ_WRITE_TOKEN');
	}

	const requestUrl = new URL(
		request.url,
		`${request.headers['x-forwarded-proto'] ?? 'http'}://${request.headers.host ?? 'localhost:3000'}`,
	);
	const { searchParams } = requestUrl;
	const pathname = searchParams.get('pathname');

	if (!pathname || (!pathname.startsWith('music/') && !pathname.startsWith('arts/'))) {
		return response.status(400).json({ error: 'Invalid pathname' });
	}

	try {
		const result = await get(pathname, { access: 'private' });

		if (result?.statusCode !== 200) {
			return response.status(404).send('Not found');
		}

		response.setHeader('Cache-Control', 'private, no-cache');
		response.setHeader('Content-Type', result.blob.contentType);
		response.setHeader('ETag', result.blob.etag);
		response.setHeader('X-Content-Type-Options', 'nosniff');

		return Readable.fromWeb(result.stream).pipe(response);
	} catch (error) {
		return response
			.status(500)
			.send(error instanceof Error ? error.message : 'Unable to stream track');
	}
}
