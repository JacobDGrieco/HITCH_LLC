// Renders content-managed text delimiters as soft or hard breaks without storing JSX in the database.
import { Fragment } from 'react';

const TEXT_BREAK_PATTERN = /(\\r\\n|\\n|\r\n|\r|\n|[/&])/g;

function isLineBreakToken(part) {
	return part === '\n' || part === '\r' || part === '\r\n' || part === '\\n' || part === '\\r\\n';
}

export function renderTextWithDelimiterBreaks(text) {
	if (text === null || text === undefined) return text;

	return String(text).split(TEXT_BREAK_PATTERN).map((part, index) => {
		if (isLineBreakToken(part)) {
			return <br key={`line-break-${index}`} />;
		}

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
