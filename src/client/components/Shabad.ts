import { Component } from './Component';

class Shabad extends Component {
	_linesById: Record<string, HTMLElement>;
	_selectedLine: LineInfo;
	_selectedLineNode: HTMLElement;
	_shabad: ShabadInfo;

	get selectedLine () {
		return this._selectedLine;
	}
	set selectedLine (line: LineInfo) {
		this._selectedLine = line;
		if (this._selectedLineNode) {
			this._selectedLineNode.classList.remove('selected');
		}

		this._selectedLineNode = this._linesById[line.id];
		this._selectedLineNode.classList.add('selected');
	}

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

	_onClick (event: PointerEvent) {
		const lineNode = (event.target as HTMLElement).parentElement;
		if (this._selectedLineNode) {
			this._selectedLineNode.classList.remove('selected');
		}
		this._selectedLineNode = lineNode;
		lineNode.classList.add('selected');

		this.onSelectLine({
			id: lineNode.dataset.lineId,
			shabadId: this.shabad.id,
		});
	}

	onSelectLine (lineInfo: LineInfo) {}

	render () {
		this.node.innerHTML = '';

		if (!this.shabad) {
			return;
		}

		const fragment = document.createDocumentFragment();

		this.shabad.lines.forEach(function (this: Shabad, line) {
			const lineWrapper = document.createElement('div');
			lineWrapper.className = 'line';
			lineWrapper.dataset.lineId = line.id;
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
