// Resolves legacy scale-based drop sizes and newer explicit pixel sizes for droplet components.
const LEGACY_PIXEL_SIZE_THRESHOLD = 10;
const SKILL_DROP_SIZE_SCALE = 0.64;

export function resolveScaledDropSize(size, standardSize) {
	const numericSize = Number(size);
	if (!Number.isFinite(numericSize) || numericSize <= 0) return standardSize;

	// Older database values used small multipliers; current values above 10 are treated as pixels.
	if (numericSize <= LEGACY_PIXEL_SIZE_THRESHOLD) {
		return Math.round(standardSize * numericSize);
	}

	return Math.round(numericSize);
}

export function getStandardSkillDropSize(level) {
	const normalizedLevel = Math.min(100, Math.max(0, Number(level) || 0));
	return Math.round((112 + normalizedLevel * 0.58) * SKILL_DROP_SIZE_SCALE);
}
