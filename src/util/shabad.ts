function getLine (lang: string, line: ShabadLine) {
	// TODO: special handling for lang: lv, tl, sm (Shahmukhi)
	return line[lang as PropertyName<ShabadLine>];
}

export const shabadUtil = {
	/**
	 * Remove lines for disabled languages from a Shabad
	 * @param fullShabad A full shabad
	 * @param languages Language config to filter lines in shabad by
	 */
	filterLanguages (fullShabad: any, languageConfig: LanguageConfig): ShabadInfo {
		const reducedShabad = Object.create(null);
		reducedShabad.id = fullShabad.id;
		reducedShabad.lines = fullShabad.lines.map(function (line: any) {
			const filteredLine = Object.create(null);
			filteredLine.id = line.id;
			Object.entries(languageConfig).forEach(function ([ lang, enabled ]) {
				if (enabled) {
					filteredLine[lang] = getLine(lang, line);
				}
			});

			return filteredLine;
		});

		return reducedShabad;
	},
};
