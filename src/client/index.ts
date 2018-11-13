import { ClientConfigForm } from './components/ClientConfigForm';
import { Shabad } from './components/Shabad';

const STORAGE_KEY = 'shabad-live-data';
const wsHost = `${window.location.hostname}:8081`;
const socket = new WebSocket(`ws://${wsHost}`);

const config: ClientConfig = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
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

const shabadsById: Record<string, ShabadInfo> = Object.create(null);
const shabadComponent = new Shabad(document.getElementById('shabad'), {
	isViewer: true,
	_onClick: function () {},
});

function getShabadById (shabadId: string): ShabadInfo {
	if (shabadsById[shabadId]) {
		return shabadsById[shabadId];
	}
	else {
		socket.send(JSON.stringify({
			type: 'getShabad',
			id: shabadId,
		}));

		return null;
	}
}

socket.addEventListener('message', function (event) {
	const message = JSON.parse(event.data) as Message;

	switch (message.type) {
		case 'handshake': {
			socket.send(JSON.stringify({
				type: 'config',
				config,
			}));
			break;
		}

		case 'shabad': {
			shabadsById[message.shabad.id] = message.shabad as ShabadInfo;
			shabadComponent.shabad = message.shabad;

			break;
		}

		case 'line': {
			if (!shabadComponent.shabad || (shabadComponent.shabad.id !== message.lineInfo.shabadId)) {
				shabadComponent.shabad = getShabadById(message.lineInfo.shabadId);
			}

			if (shabadComponent.shabad) {
				shabadComponent.selectedLine = message.lineInfo;
			}

			break;
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
