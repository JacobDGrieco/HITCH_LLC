import { useMemo, useState } from 'react';
import { SiteChromeContext } from './SiteChromeContext';

export function SiteChromeProvider({ children }) {
	const [dasHidden, setDasHidden] = useState(false);

	const value = useMemo(
		() => ({
			dasHidden,
			setDasHidden,
		}),
		[dasHidden]
	);

	return <SiteChromeContext.Provider value={value}>{children}</SiteChromeContext.Provider>;
}
