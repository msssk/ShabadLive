const config = {
	searchUrl: 'https://api.gurbaninow.com/v2/search/',
	shabadUrl: 'https://api.gurbaninow.com/v2/shabad/',
};

async function _fetch (url: string) {
	const response = await fetch(url);
	const results = await response.json();

	return results;
}

function transformLine ({ line: lineObject }: any) {
	const line = Object.create(null);
	line.id = lineObject.id;
	line.gu = lineObject.gurmukhi.akhar;
	line.tl = lineObject.transliteration.english.text;
	line.en = lineObject.translation.english.default;
	line.es = lineObject.translation.spanish;
	line.pa = lineObject.translation.punjabi.default.akhar;
	line.dv = lineObject.transliteration.devanagari.text;

	return line;
}

/**
 * @typedef {Object} Shabad
 * @property {string} id
 * @property {ShabadLine[]} lines
 */

/**
 * Get a shabad by its id
 */
async function getShabadById (id: string): Promise<ShabadInfo> {
	const shabadInfo = await _fetch(config.shabadUrl + id);
	const shabad = Object.create(null);
	shabad.id = shabadInfo.shabadinfo.shabadid;
	shabad.lines = shabadInfo.shabad.map(transformLine);

	return shabad;
}

async function search (term: string) {
	return _fetch(config.searchUrl + term);
}

export default {
	getShabadById,
	search,
};
