const PORT_NUMBER = 8080;
const WebSocket = require('ws');

const server = new WebSocket.Server({
	port: PORT_NUMBER,
	clientTracking: true,
	perMessageDeflate: true,
});
const activeConfigs = Object.create(null);
const clientsByConfig = Object.create(null);
const clientsById = Object.create(null);
const shabadCache = Object.create(null);

const DEFAULT_CLIENT_CONFIG = {
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

let getNextId = (function () {
	let clientId = 1;

	return function getNextId () {
		return clientId++;
	};
}());

function getLine (lang, line) {
	// TODO: special handling for lang: lv, tl, sm (Shahmukhi)
	return line[lang];
}

function cacheShabad (shabad) {
	if (!shabadCache[shabad.id]) {
		shabadCache[shabad.id] = Object.create(null);
	}

	Object.entries(activeConfigs).forEach(function ([ configKey, config ]) {
		shabadCache[shabad.id][configKey] = JSON.stringify({
			type: 'shabad',
			shabad: {
				id: shabad.id,
				lines: shabad.lines.reduce(function (sum, line) {
					sum[line.id] = Object.create(null);
					Object.entries(config).forEach(function ([ lang, enabled ]) {
						if (enabled) {
							sum[line.id][lang] = getLine(lang, line);
						}
					});

					return sum;
				}, Object.create(null)),
			},
		});
	});
}

server.on('listening', function () {
	console.log('ShabadLive server listening on port ' + server.address().port);
});

server.on('connection', function (client) {
	client.id = getNextId();
	client.send(JSON.stringify({
		type: 'handshake',
		id: client.id,
	}));
	clientsById[client.id] = client;

	client.on('message', function (messageString) {
		const message = JSON.parse(messageString);

		switch (message.type) {
			case 'config': {
				delete message.config.languages.lv; // handled client-side
				client.config = JSON.stringify(message.config.languages);
				activeConfigs[client.config] = message.config.languages;
				if (clientsByConfig[client.config]) {
					clientsByConfig[client.config].push(client.id);
				}
				else {
					clientsByConfig[client.config] = [ client.id ];
				}

				break;
			}

			case 'shabad': {
				cacheShabad(message.shabad);
				broadcast({
					type: 'shabad',
					id: message.shabad.id,
				});

				break;
			}

			default: {
				broadcast(message);
			}
		}
	});
});

function broadcast (message) {
	// TODO: filter command clients out of broadcast

	switch (message.type) {
		case 'shabad': {
			Object.entries(clientsByConfig).forEach(function ([ configKey, clientList ]) {
				const messageString = shabadCache[message.id][configKey];

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
			const messageString = JSON.stringify({
				type: 'line',
				line: message.line,
			});

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
		process.emit('SIGINT');
	});
}

process.on('SIGINT', function () {
	server.close(function () {
		console.log('ShabadLive server stopped');
		process.exit();
	});
});
