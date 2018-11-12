import { Component } from './Component';

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
	_config: ClientConfig;
	cancelButton: HTMLButtonElement;
	saveButton: HTMLButtonElement;

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
		const newConfig: ClientConfig = {
			languages: languages.reduce(function (sum: LanguageConfig, language: string) {
				sum[language as PropertyName<LanguageConfig>] = this.node.elements[language].checked;

				return sum;
			}.bind(this), Object.create(null)) as unknown as LanguageConfig,
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
