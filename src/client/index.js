const shabadNode = document.getElementById('shabad');

const socket = new WebSocket(`ws://${window.location.hostname}:8080`);
const languages = [
	'gu',
	'tl',
	'en',
	'pa',
	'lv',
	'es',
	'dv',
];

function render (line) {
	const fragment = document.createDocumentFragment();
	languages.forEach(function (language) {
		const div = document.createElement('div');
		div.className = language;
		div.textContent = line[language];
		fragment.appendChild(div);
	});
	shabadNode.innerHTML = '';
	shabadNode.appendChild(fragment);
}

socket.addEventListener('message', function (event) {
	render(JSON.parse(event.data));
});
