const WebSocket = require('ws');

const server = new WebSocket.Server({
	port: 8080,
	clientTracking: true,
	perMessageDeflate: true,
});

server.on('listening', function () {
	console.log('Listening on port ' + server.address().port);
});

server.on('connection', function (socket) {
	socket.on('message', function (message) {
		broadcast(message);
	});
});

function broadcast (message) {
	server.clients.forEach(function (client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	});
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
		console.log('Server stopped');
		process.exit();
	});
});
