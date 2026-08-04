const LEGACY_PIXEL_SIZE_THRESHOLD = 10;
const SKILL_DROP_SIZE_SCALE = 0.64;

export function resolveScaledDropSize(size, standardSize) {
	const numericSize = Number(size);
	if (!Number.isFinite(numericSize) || numericSize <= 0) return standardSize;

	if (numericSize <= LEGACY_PIXEL_SIZE_THRESHOLD) {
		return Math.round(standardSize * numericSize);
	}

	return Math.round(numericSize);
}

export function getStandardSkillDropSize(level) {
	const normalizedLevel = Math.min(100, Math.max(0, Number(level) || 0));
	return Math.round((112 + normalizedLevel * 0.58) * SKILL_DROP_SIZE_SCALE);
}
