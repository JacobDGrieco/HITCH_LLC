// Keeps page API responses warm across route remounts without baking portfolio content into the frontend bundle.
function normalizeList(data) {
	return Array.isArray(data) ? data : [];
}

function preloadImages(items) {
	if (typeof Image === 'undefined') return;

	items.forEach((item) => {
		if (!item.iconImage) return;

		const image = new Image();
		image.src = item.iconImage;
	});
}

function createCachedApiLoader({ url, field, shouldPreloadImages = false }) {
	let cache = null;
	let request = null;

	function getCachedData() {
		return cache;
	}

	function loadData() {
		if (cache) return Promise.resolve(cache);
		if (request) return request;

		request = fetch(url)
			.then((response) => {
				if (!response.ok) throw new Error(`${field} request failed with status ${response.status}`);
				return response.json();
			})
			.then((payload) => {
				cache = normalizeList(payload?.[field]);
				if (shouldPreloadImages) preloadImages(cache);
				return cache;
			})
			.catch(() => {
				cache = [];
				return cache;
			})
			.finally(() => {
				request = null;
			});

		return request;
	}

	return { getCachedData, loadData };
}

const projectsLoader = createCachedApiLoader({
	url: '/api/projects',
	field: 'projects',
	shouldPreloadImages: true,
});

const skillsLoader = createCachedApiLoader({
	url: '/api/skills',
	field: 'skills',
});

const educationLoader = createCachedApiLoader({
	url: '/api/education',
	field: 'education',
	shouldPreloadImages: true,
});

const experienceLoader = createCachedApiLoader({
	url: '/api/experience',
	field: 'experience',
	shouldPreloadImages: true,
});

export const getCachedProjectsPageData = projectsLoader.getCachedData;
export const loadProjectsPageData = projectsLoader.loadData;
export const getCachedSkillsPageData = skillsLoader.getCachedData;
export const loadSkillsPageData = skillsLoader.loadData;
export const getCachedEducationPageData = educationLoader.getCachedData;
export const loadEducationPageData = educationLoader.loadData;
export const getCachedExperiencePageData = experienceLoader.getCachedData;
export const loadExperiencePageData = experienceLoader.loadData;
