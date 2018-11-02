function createResultRow (shabad) {
	const pageCell = document.createElement('td');
	pageCell.className = 'page-column';
	pageCell.textContent = shabad.pageno;

	const shabadCell = document.createElement('td');
	shabadCell.className = 'shabad-column';
	shabadCell.textContent = shabad.gurmukhi.akhar;

	const row = document.createElement('tr');
	row.dataset.shabadId = shabad.shabadid;
	row.appendChild(pageCell);
	row.appendChild(shabadCell);

	return row;
}

class ResultsList {
	constructor (node) {
		this.node = node;
		this.init();
	}

	get results () {
		return this._results;
	}
	set results (value) {
		this._results = value;
		this.render();
	}

	init () {
		this.node.addEventListener('click', this._onClick.bind(this));
	}

	_onClick (event) {
		const rowNode = event.target.parentElement;
		const shabadId = rowNode.dataset.shabadId;

		this.onSelectShabad && this.onSelectShabad(shabadId);
	}

	onSelectShabad () {
		/* eslint-disable-next-line no-console */
		console.warn('NOT IMPLEMENTED');
	}

	render () {
		if (this.results) {
			this.node.innerHTML = '';
			const fragment = document.createDocumentFragment();

			this.results.shabads.forEach(function ({ shabad }) {
				fragment.appendChild(createResultRow(shabad));
			});

			this.node.appendChild(fragment);
		}
		else {
			this.node.innerHTML = '';
		}
	}
}

export { ResultsList };
