import * as WebSocket from 'ws';
import { shabadUtil } from '../util/shabad';

interface WsClient extends WebSocket {
	id?: number;
	config?: string;
}

const PORT_NUMBER = 8081;

const server = new WebSocket.Server({
	port: PORT_NUMBER,
	clientTracking: true,
	perMessageDeflate: true,
});
const activeConfigs: Record<string, LanguageConfig> = Object.create(null);
const clientIdsByConfig: Record<string, number[]> = Object.create(null);
const clientsById: Record<string, WsClient> = Object.create(null);
const shabadCache: Record<string, Record<string, string>> = Object.create(null);

const DEFAULT_CLIENT_CONFIG: ClientConfig = {
	languages: {
		gu: true,
		tl: true,
		en: true,
		pa: false,
		es: false,
		dv: false,
	},
};

activeConfigs[JSON.stringify(DEFAULT_CLIENT_CONFIG.languages)] = DEFAULT_CLIENT_CONFIG.languages;

const getNextId = (function () {
	let clientId = 1;

	/* tslint:disable-next-line:no-shadowed-variable */
	return function getNextId () {
		return clientId++;
	};
}());

let currentLine: LineInfo;

function cacheShabad (shabad: ShabadInfo) {
	if (!shabadCache[shabad.id]) {
		shabadCache[shabad.id] = Object.create(null);
	}

	Object.entries(activeConfigs).forEach(function ([ configKey, languageConfig ]) {
		shabadCache[shabad.id][configKey] = JSON.stringify({
			type: 'shabad',
			shabad: shabadUtil.filterLanguages(shabad, languageConfig),
		});
	});
}

server.on('listening', function () {
	const addressInfo = server.address() as WebSocket.AddressInfo;
	console.log('ShabadLive server listening on port ' + addressInfo.port);
});

server.on('connection', function (client: WsClient) {
	client.id = getNextId();
	client.send(JSON.stringify({
		type: 'handshake',
		id: client.id,
	}));
	clientsById[client.id] = client;

	client.on('message', function (messageString: string) {
		const message = JSON.parse(messageString) as Message;

		switch (message.type) {
			case 'config': {
				delete message.config.languages.lv; // handled client-side
				client.config = JSON.stringify(message.config.languages);
				activeConfigs[client.config] = message.config.languages;
				if (clientIdsByConfig[client.config]) {
					clientIdsByConfig[client.config].push(client.id);
				}
				else {
					clientIdsByConfig[client.config] = [ client.id ];
				}

				if (currentLine) {
					if (client.readyState === WebSocket.OPEN) {
						client.send(shabadCache[currentLine.shabadId][client.config]);

						client.send(JSON.stringify({
							type: 'line',
							lineInfo: currentLine,
						}));
					}
				}

				break;
			}

			case 'getShabad': {
				if (client.readyState === WebSocket.OPEN) {
					client.send(shabadCache[message.id][client.config]);

					if (currentLine) {
						client.send(JSON.stringify({
							type: 'line',
							lineInfo: currentLine,
						}));
					}
				}

				break;
			}

			case 'shabad': {
				cacheShabad(message.shabad);
				broadcast(message);

				break;
			}

			case 'line': {
				currentLine = message.lineInfo;
				broadcast(message);

				break;
			}
		}
	});
});

function broadcast (message: Message) {
	// TODO: filter command clients out of broadcast

	switch (message.type) {
		case 'shabad': {
			Object.entries(clientIdsByConfig).forEach(function ([ configKey, clientList ]) {
				const messageString = shabadCache[message.shabad.id][configKey];

				clientList.forEach(function (clientId) {
					const client = clientsById[clientId];
					if (client.readyState === WebSocket.OPEN) {
						client.send(messageString);
					}
				});
			});

			break;
		}

		case 'line': {
			const messageString = JSON.stringify(message);

			server.clients.forEach(function (client) {
				if (client.readyState === WebSocket.OPEN) {
					client.send(messageString);
				}
			});

			break;
		}
	}
}

if (process.platform === 'win32') {
	const readline = require('readline');
	const readlineInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	readlineInterface.on('SIGINT', function () {
		(process as any).emit('SIGINT');
	});
}

process.on('SIGINT', function () {
	server.close(function () {
		console.log('ShabadLive server stopped');
		process.exit();
	});
});
