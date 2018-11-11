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

interface LineInfo {
	id: string;
	shabadId: string;
}

interface ConfigMessage {
	type: 'config';
	config: ClientConfig;
}

interface HandshakeMessage {
	type: 'handshake';
	id: string;
}

interface LineMessage {
	type: 'line';
	lineInfo: LineInfo;
}

interface ShabadMessage {
	type: 'shabad';
	shabad: ShabadInfo;
}

type Message = ConfigMessage | HandshakeMessage | LineMessage | ShabadMessage;

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
