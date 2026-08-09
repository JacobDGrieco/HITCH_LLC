// Assigns project cards to visual lanes while centering incomplete final rows.
export const PROJECT_WINDOW_LANES = ['left', 'middle', 'right'];

export function getProjectLane(index, totalItems = 0) {
	const normalizedTotal = Number(totalItems);
	const hasTotal = Number.isFinite(normalizedTotal) && normalizedTotal > 0;
	const lastRowCount = hasTotal ? normalizedTotal % PROJECT_WINDOW_LANES.length : 0;
	const lastRowStart = hasTotal && lastRowCount ? normalizedTotal - lastRowCount : normalizedTotal;

	if (lastRowCount === 1 && index >= lastRowStart) return 'middle';
	if (lastRowCount === 2 && index >= lastRowStart) return index === lastRowStart ? 'left' : 'right';

	return PROJECT_WINDOW_LANES[index % PROJECT_WINDOW_LANES.length];
}
