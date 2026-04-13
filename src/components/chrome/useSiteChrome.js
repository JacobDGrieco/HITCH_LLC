import { useContext } from 'react';
import { SiteChromeContext } from './SiteChromeContext';

export function useSiteChrome() {
	const context = useContext(SiteChromeContext);

	if (!context) {
		throw new Error('useSiteChrome must be used within a SiteChromeProvider');
	}

	return context;
}
