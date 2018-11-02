export default {
	create () {
		const mainAlphabet = [
			'a', 'A', 'e', 's', 'h',
			'k', 'K', 'g', 'G', '|',
			'c', 'C', 'j', 'J', '\\',
			't', 'T', 'f', 'F', 'x',
			'q', 'Q', 'd', 'D', 'n',
			'p', 'P', 'b', 'B', 'm',
			'X', 'r', 'l', 'v', 'V',
			'S', '^', 'Z', 'z', '&',
		];
		const node = document.createElement('div');
		node.className = 'keyboard';
		let rowNode;
		let groupNode;
		let groupIndex = 0;

		mainAlphabet.forEach(function (letter, i) {
			if (i % 10 === 0) {
				rowNode = document.createElement('div');
				rowNode.className = 'keyboard-row';
				node.appendChild(rowNode);
			}

			if (i % 5 === 0) {
				groupNode = document.createElement('div');
				groupNode.className = 'keyboard-group';
				rowNode.appendChild(groupNode);

				switch (groupIndex) {
					case 1:
					case 2:
					case 5:
					case 6:
						groupNode.classList.add('alt');
				}

				groupIndex++;
			}

			const letterNode = document.createElement('div');

			letterNode.className = 'keyboard-letter';
			letterNode.textContent = letter;
			groupNode.appendChild(letterNode);
		});

		return {
			node,
		};
	},
};
