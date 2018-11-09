import { Component } from './Component.js';

class Shabad extends Component {
	get shabad () {
		return this._shabad;
	}
	set shabad (value) {
		this._shabad = value;
		this.render();
	}

	init () {
		this._linesById = Object.create(null);
		this.node.addEventListener('click', this._onClick.bind(this));
	}

	_onClick (event) {
		const lineNode = event.target;
		if (this._selectedLineNode) {
			this._selectedLineNode.classList.toggle('selected');
		}
		this._selectedLineNode = lineNode;
		lineNode.classList.toggle('selected');

		this.onSelectLine({
			id: lineNode.dataset.lineId,
			shabadId: this.shabad.id,
		});
	}

	onSelectLine () {}

	render () {
		this.node.innerHTML = '';

		if (!this.shabad) {
			return;
		}

		const fragment = document.createDocumentFragment();

		this.shabad.lines.forEach(function (line) {
			const lineWrapper = document.createElement('div');
			lineWrapper.className = 'line';
			this._linesById[line.id] = lineWrapper;

			Object.entries(line).forEach(function ([ lang, text ]) {
				if (lang === 'id') {
					return;
				}

				const div = document.createElement('div');
				div.className = lang;
				div.textContent = text;
				lineWrapper.appendChild(div);
			});

			fragment.appendChild(lineWrapper);
		}, this);

		this.node.appendChild(fragment);
	}
}

export { Shabad };
