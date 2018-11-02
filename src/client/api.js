const config = {
	searchUrl: 'https://api.gurbaninow.com/v2/search/',
	shabadUrl: 'https://api.gurbaninow.com/v2/shabad/',
};

async function _fetch (url) {
	const response = await fetch(url);
	const results = await response.json();

	return results;
}

async function getShabadById (id) {
	return _fetch(config.shabadUrl + id);
}

async function search (term) {
	return _fetch(config.searchUrl + term);
}

export default {
	getShabadById,
	search,
};
