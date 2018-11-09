import { ClientConfigForm } from './components/ClientConfigForm.js';
import { Shabad } from './components/Shabad.js';

const STORAGE_KEY = 'shabad-live-data';
const wsHost = `${window.location.hostname}:8080`;
const socket = new WebSocket(`ws://${wsHost}`);

const config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
	languages: {
		gu: true,
		tl: true,
		en: true,
		pa: false,
		lv: false,
		es: false,
		dv: false,
	},
};

const shabadsById = Object.create(null);
const shabadComponent = new Shabad(document.getElementById('shabad'));

socket.addEventListener('message', function (event) {
	const message = JSON.parse(event.data);

	switch (message.type) {
		case 'handshake': {
			socket.send(JSON.stringify({
				type: 'config',
				config,
			}));
			break;
		}

		case 'shabad': {
			shabadsById[message.shabadId] = message.shabad;
			shabadComponent.shabad = message.shabad;

			break;
		}

		default: {
			// TODO: showLine(message.line);
		}
	}
});

const headerNode = document.querySelector('header');
const mainNode = document.querySelector('main');
mainNode.addEventListener('click', function () {
	headerNode.hidden = !headerNode.hidden;
});

const configForm = new ClientConfigForm(document.getElementById('configForm'), {
	config,
	onClose () {
		this.node.hidden = true;
	},
	onCancel () {
		this.close();
	},
	onSave () {
		this.close();
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
	},
});

const configButton = document.getElementById('configButton');
configButton.addEventListener('click', function () {
	configForm.node.hidden = !configForm.node.hidden;
});
