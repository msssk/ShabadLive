export default {
	create() {
		const alphabet = [
			'a', 'A', 'e', 's', 'h'
		];
		const node = document.createElement('div');
		node.className = 'gurmukhi-keyboard';

		alphabet.forEach(function (letter) {
			const letterNode = document.createElement('div');

			letterNode.className = 'letter';
			letterNode.textContent = letter;
			node.appendChild(letterNode);
		});

		return node;
	}
};
