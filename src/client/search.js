import api from './api.js';
import { ResultsList } from './components/ResultsList.js';
import { Shabad } from './components/Shabad.js';

const cache = Object.create(null);

const searchForm = document.getElementById('searchForm');
const waitingNode = document.getElementById('waiting');
const socket = new WebSocket(`ws://${window.location.hostname}:8080`);

const resultsComponent = new ResultsList(document.getElementById('results'));
const shabadComponent = new Shabad(document.getElementById('shabad'));

resultsComponent.onSelectShabad = async function (shabadId) {
	const shabad = await api.getShabadById(shabadId);
	shabadComponent.shabad = shabad;
	cache[shabad.shabadinfo.shabadid] = shabad;
};

shabadComponent.onSelectLine = function (line) {
	const shabad = cache[line.shabadId];
	shabad.sent = shabad.sent || Object.create(null);
	if (!shabad.sent[line.id]) {
		const fullLine = shabad.shabad[line.index].line;
		Object.assign(line, {
			dv: fullLine.transliteration.devanagari.text,
			en: fullLine.translation.english.default,
			es: fullLine.translation.spanish,
			gu: fullLine.gurmukhi.akhar,
			lv: fullLine.larivaar.akhar,
			pa: fullLine.translation.punjabi.default.akhar,
			tl: fullLine.transliteration.english.text,
		});

		shabad.sent[line.id] = true;
	}

	socket.send(JSON.stringify(line));
};

searchForm.addEventListener('submit', async function (event) {
	event.preventDefault();

	waitingNode.hidden = false;
	const results = await api.search(searchForm.term.value);
	waitingNode.hidden = true;
	resultsComponent.results = results;
});

const deleteIcon = searchForm.querySelector('.delete-icon');
deleteIcon.addEventListener('click', function () {
	searchForm.term.value = '';
	setTimeout(function () {
		searchForm.term.focus();
	}, 0);
});
