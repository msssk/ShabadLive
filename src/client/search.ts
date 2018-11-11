import api from './api';
import { ResultsList } from './components/ResultsList';
import { Shabad } from './components/Shabad';
import { shabadUtil } from '../util/shabad';

const cache = Object.create(null);

const searchForm = document.getElementById('searchForm') as HTMLFormElement;
const waitingNode = document.getElementById('waiting');
const wsHost = `${window.location.hostname}:8080`;
const socket = new WebSocket(`ws://${wsHost}`);

const app = {
	config: {
		languages: {
			gu: true,
		},
	},
};

const resultsComponent = new ResultsList(document.getElementById('results'));
const shabadComponent = new Shabad(document.getElementById('shabad'));

resultsComponent.onSelectShabad = async function (shabadId) {
	let shabad = cache[shabadId];
	if (!shabad) {
		shabad = await api.getShabadById(shabadId);
		cache[shabadId] = shabad;
		socket.send(JSON.stringify({
			type: 'shabad',
			shabad,
		}));
	}
	shabadComponent.shabad = shabadUtil.filterLanguages(shabad, app.config.languages);
};

shabadComponent.onSelectLine = function (line) {
	socket.send(JSON.stringify({
		type: 'line',
		line,
	}));
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
