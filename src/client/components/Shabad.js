class Shabad {
	constructor (node) {
		this.node = node;
		this.init();
	}

	get shabad () {
		return this._shabad;
	}
	set shabad (value) {
		this._shabad = value;
		this.render();
	}

	init () {
		this.node.addEventListener('click', this._onClick.bind(this));
	}

	_onClick (event) {
		const lineNode = event.target;
		if (this._selectedLineNode) {
			this._selectedLineNode.classList.toggle('selected');
		}
		this._selectedLineNode = lineNode;
		lineNode.classList.toggle('selected');

		this.onSelectLine && this.onSelectLine({
			id: lineNode.dataset.lineId,
			index: lineNode.dataset.lineIndex,
			shabadId: lineNode.dataset.shabadId,
		});
	}

	onSelectLine () {
		/* eslint-disable-next-line no-console */
		console.warn('NOT IMPLEMENTED');
	}

	render () {
		const fragment = document.createDocumentFragment();
		const shabadId = this.shabad.shabadinfo.shabadid;

		this.shabad.shabad.forEach(function ({ line }, index) {
			const div = document.createElement('div');
			div.className = 'line';
			div.textContent = line.gurmukhi.akhar;
			div.dataset.shabadId = shabadId;
			div.dataset.lineId = line.id;
			div.dataset.lineIndex = index;
			fragment.appendChild(div);
		});

		this.node.innerHTML = '';
		this.node.appendChild(fragment);
	}
}

export { Shabad };
