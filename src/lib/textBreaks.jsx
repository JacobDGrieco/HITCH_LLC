import { Fragment } from 'react';

const BREAKABLE_DELIMITER_PATTERN = /([/&])/g;

export function renderTextWithDelimiterBreaks(text) {
	if (text === null || text === undefined) return text;

	return String(text).split(BREAKABLE_DELIMITER_PATTERN).map((part, index) => {
		if (part === '/' || part === '&') {
			return (
				<Fragment key={`${part}-${index}`}>
					{part}
					<wbr />
				</Fragment>
			);
		}

		return part;
	});
}
