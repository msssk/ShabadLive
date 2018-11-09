const config = {
	searchUrl: 'https://api.gurbaninow.com/v2/search/',
	shabadUrl: 'https://api.gurbaninow.com/v2/shabad/',
};

async function _fetch (url) {
	const response = await fetch(url);
	const results = await response.json();

	return results;
}

/**
 * @typedef {Object} ShabadLine
 * @property {string} id
 * @property {string} dv
 * @property {string} en
 * @property {string} es
 * @property {string} gu
 * @property {string} pa
 * @property {string} tl
 */

/**
 * @param {object} lineObject GurbaniNow API line object
 * @returns {ShabadLine}
 */
function transformLine ({ line: lineObject }) {
	const line = Object.create(null);
	line.id = lineObject.id;
	line.dv = lineObject.transliteration.devanagari.text;
	line.en = lineObject.translation.english.default;
	line.es = lineObject.translation.spanish;
	line.gu = lineObject.gurmukhi.akhar;
	line.pa = lineObject.translation.punjabi.default.akhar;
	line.tl = lineObject.transliteration.english.text;

	return line;
}

/**
 * @typedef {Object} Shabad
 * @property {string} id
 * @property {ShabadLine[]} lines
 */

/**
 * Get a shabad by its id
 * @param {string} id
 * @returns {Shabad}
 */
async function getShabadById (id) {
	const shabadInfo = await _fetch(config.shabadUrl + id);
	const shabad = Object.create(null);
	shabad.id = shabadInfo.shabadinfo.shabadid;
	shabad.lines = shabadInfo.shabad.map(transformLine);

	return shabad;
}

async function search (term) {
	return _fetch(config.searchUrl + term);
}

export default {
	getShabadById,
	search,
};
