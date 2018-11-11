interface ClientConfig {
	languages: LanguageConfig;
}

interface LanguageConfig {
		gu?: boolean;
		tl?: boolean;
		en?: boolean;
		pa?: boolean;
		lv?: boolean;
		es?: boolean;
		dv?: boolean;
}

/**
 * Use this for strings that should refer to an existing property on a type
 */
type PropertyName<T> = keyof T;

interface ShabadInfo {
	id: string;
	lines: ShabadLine[];
}

interface ShabadLine {
	id: string;
	dv?: string;
	en?: string;
	es?: string;
	gu?: string;
	pa?: string;
	tl?: string;
}
