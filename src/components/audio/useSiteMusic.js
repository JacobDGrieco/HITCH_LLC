// Hook wrapper that guarantees music consumers are rendered under SiteMusicProvider.
import { useContext } from 'react';
import { SiteMusicContext } from './SiteMusicContext';

export function useSiteMusic() {
	const context = useContext(SiteMusicContext);

	if (!context) {
		throw new Error('useSiteMusic must be used within a SiteMusicProvider');
	}

	return context;
}
