import { Component } from './Component.js';

const languages = [
	'gu',
	'tl',
	'en',
	'pa',
	'lv',
	'es',
	'dv',
];

class ClientConfigForm extends Component {
	get config () {
		return this._config;
	}
	set config (value) {
		this._config = value;
		this.render();
	}

	init () {
		this.cancelButton = this.node.querySelector('#cancelButton');
		this.saveButton = this.node.querySelector('#saveButton');
		this.cancelButton.addEventListener('click', this._onClickCancel.bind(this));
		this.saveButton.addEventListener('click', this._onClickSave.bind(this));
	}

	onClose () {}
	onCancel () {}
	onSave () {}

	close () {
		this.onClose();
	}

	_onClickCancel () {
		this.render();
		this.onCancel();
	}

	_onClickSave () {
		const newConfig = {
			languages: languages.reduce(function (sum, language) {
				sum[language] = this.node.elements[language].checked;

				return sum;
			}.bind(this), Object.create(null)),
		};

		if (JSON.stringify(newConfig) !== JSON.stringify(this.config)) {
			this._config = newConfig;
			this.onSave();
		}
	}

	render () {
		Object.entries(this.config.languages).forEach(function ([ language, enabled ]) {
			this.node.elements[language].checked = enabled;
		}, this);
	}
}

export { ClientConfigForm };
