import { font } from '../../util/font';
import { Component } from './Component';

let hasScrollIntoViewIfNeeded = false;
let hasScrollIntoView = false;

const lineEndRegex = /((\||॥).*)$/;
const lineEndGuRegex = /(\].*)$/;
const fontFitConfig = {
	tweakFactor: 0.92,
};

class Shabad extends Component {
	_linesById: Record<string, HTMLElement>;
	_selectedLine: LineInfo;
	_selectedLineNode: HTMLElement;
	_shabad: ShabadInfo;
	/**
	 * If true the Shabad is rendering in a viewer client (as opposed to a search client)
	 */
	isViewer?: boolean;

	constructor (node: HTMLElement, options?: Record<string, any>) {
		super(node, options);

		if (this.isViewer) {
			hasScrollIntoViewIfNeeded = typeof (document.documentElement as any).scrollIntoViewIfNeeded === 'function';
			hasScrollIntoView = typeof document.documentElement.scrollIntoView === 'function';
		}
	}

	get selectedLine () {
		return this._selectedLine;
	}
	set selectedLine (this: Shabad, line: LineInfo) {
		this._selectedLine = line;
		if (this._selectedLineNode) {
			this._selectedLineNode.classList.remove('selected');
		}

		this._selectedLineNode = this._linesById[line.id];
		this._selectedLineNode.classList.add('selected');

		if (this.isViewer) {
			if (window.screen.orientation.type.includes('landscape')) {
				Array.prototype.forEach.call(this._selectedLineNode.children, function (node: HTMLElement) {
					font.fitContainer(node, fontFitConfig);
				});
			}

			if (hasScrollIntoViewIfNeeded) {
				(this._selectedLineNode as any).scrollIntoViewIfNeeded();
			}
			else if (hasScrollIntoView) {
				this._selectedLineNode.scrollIntoView();
			}
		}
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

		if (!this.isViewer) {
			this.node.addEventListener('click', this._onClick.bind(this));
		}
	}

	_formatLine (line: string, language: string) {
		const replacementString = '<span class="end">$1</span>';
		if (language === 'gu') {
			return line.replace(lineEndGuRegex, replacementString);
		}
		else {
			return line.replace(lineEndRegex, replacementString);
		}
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

		this.node.style.visibility = 'hidden';
		const fragment = document.createDocumentFragment();

		this.shabad.lines.forEach(function (this: Shabad, line) {
			const lineWrapper = document.createElement('div');
			lineWrapper.className = 'line';
			lineWrapper.dataset.lineId = line.id;
			this._linesById[line.id] = lineWrapper;

			Object.entries(line).forEach(function (this: Shabad, [ language, text ]) {
				if (language === 'id') {
					return;
				}

				const div = document.createElement('div');
				div.className = language;
				div.innerHTML = this._formatLine(text, language);
				lineWrapper.appendChild(div);
			}, this);

			fragment.appendChild(lineWrapper);
		}, this);

		this.node.appendChild(fragment);
		this.node.style.visibility = '';
	}
}

export { Shabad };
