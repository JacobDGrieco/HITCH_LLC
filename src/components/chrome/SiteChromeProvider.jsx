import { useMemo, useState } from 'react';
import { SiteChromeContext } from './SiteChromeContext';

function getInitialDasHidden() {
	if (typeof window === 'undefined') {
		return false;
	}

	if (window.location.pathname !== '/') {
		return false;
	}

	try {
		return window.sessionStorage.getItem('homeIntroSeen') !== 'true';
	} catch {
		return false;
	}
}

export function SiteChromeProvider({ children }) {
	const [dasHidden, setDasHidden] = useState(getInitialDasHidden);

	const value = useMemo(
		() => ({
			dasHidden,
			setDasHidden,
		}),
		[dasHidden]
	);

	return <SiteChromeContext.Provider value={value}>{children}</SiteChromeContext.Provider>;
}
