import { neon } from '@neondatabase/serverless';

export function getDb() {
	const env = globalThis.process?.env ?? {};
	const url = env.DATABASE_URL || env.POSTGRES_URL || '';
	if (!url) throw new Error('DATABASE_URL is not set');
	return neon(url);
}
