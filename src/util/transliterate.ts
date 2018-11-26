const smallConsonants: Record<string, string> = {
	M: 'n',
	R: 'r',
};

const consonants: Record<string, string> = {
	b: 'b',
	B: 'b',
	c: 'ch',
	C: 'sh',
	d: 'd',
	D: 'd',
	f: 'd',
	F: 'd',
	g: 'g',
	G: 'k',
	h: 'h',
	H: '@',
	j: 'j',
	J: 'j',
	k: 'k',
	K: 'k',
	l: 'l',
	L: '@',
	m: 'm',
	n: 'n',
	N: 'n',
	p: 'p',
	P: 'f',
	q: 't',
	Q: 'th',
	r: 'r',
	s: 's',
	S: 'sh',
	t: 't',
	T: 't',
	v: 'v',
	V: 'd',
	W: '@',
	x: 'n',
	X: '@',
	z: '@',
	Z: '@',
	'\\': 'y',
	...smallConsonants,
};

const map: Record<string, string> = {
	1: 'pahalaa',
	2: 'doojaa',
	3: 'teejaa',
	4: 'chotaa',
	5: 'panjvaa',
	6: 'chayvaa',
	7: 'satvaa',
	8: 'atvaa',
	9: 'novaa',
	10: 'dasvaa',
	11: 'gyaarvaa',
	12: 'baarvaa',
	13: 'tayrvaa',
	14: 'chorvaa',
	15: 'pandrvaa',
	16: 'solvaa',
	a: 'u',
	A: 'a',
	e: '',
	E: 'o',
	i: 'i',
	I: 'ee',
	u: 'u',
	U: 'oo',
	w: 'aa',
	y: 'ay',
	Y: 'ai',
	'@': '',
	...consonants,
	']': '|',
};

type CharacterHandler = (
	replacement: string,
	previousChar: string,
	nextChar: string,
	gurmukhiWord: string,
	currentCharIndex: number
) => string;

const characterHandlers: Record<string, CharacterHandler> = {
	A (replacement, previousChar, nextChar, gurmukhiWord, currentCharIndex) {
		if (nextChar && !(nextChar in consonants)) {
			replacement = '';
		}

		return replacement;
	},

	i (replacement, previousChar, nextChar, gurmukhiWord, currentCharIndex) {
		const isLastChar = currentCharIndex === gurmukhiWord.length - 1;

		if (isLastChar) {
			if (previousChar === 'h') {
				replacement = 'e';
			}
			else {
				replacement = '';
			}
		}
		else if (!(nextChar in consonants)) {
			replacement = 'ay';
		}

		return replacement;
	},

	I (replacement, previousChar, nextChar, gurmukhiWord, currentCharIndex) {
		if (previousChar === 'e') {
			replacement = 'e';
		}

		return replacement;
	},

	M (replacement, previousChar, nextChar, gurmukhiWord, currentCharIndex) {
		if (nextChar === 'm') {
			replacement = '';
		}

		return replacement;
	},

	u (replacement, previousChar, nextChar, gurmukhiWord, currentCharIndex) {
		const isLastChar = currentCharIndex === gurmukhiWord.length - 1;

		if (isLastChar && previousChar !== 'h') {
			replacement = '';
		}
		else if (previousChar === 'a') {
			replacement = '';
		}

		return replacement;
	},

	w (replacement, previousChar, nextChar, gurmukhiWord, currentCharIndex) {
		if (/* previousChar === 'A' || */ nextChar && !(nextChar in consonants)) {
			replacement = 'a';
		}

		return replacement;
	},
};

const sihareeRegex = /(i)(.)/;
function moveSiharee (gurmukhiWord: string) {
	return gurmukhiWord.replace(sihareeRegex, '$2$1');
}

function transliterateWord (gurmukhiWord: string): string {
	const transliteration: string[] = [];
	gurmukhiWord = moveSiharee(gurmukhiWord);

	for (let i = gurmukhiWord.length - 1; i > -1; i--) {
		const currentChar = gurmukhiWord[i];
		let replacement =  currentChar in map ? map[currentChar] : currentChar;

		// tests: drsn => darsan, brs => baras, and => anad
		const nextChar = gurmukhiWord[i + 1];
		const previousChar = gurmukhiWord[ i - 1];
		if (currentChar in consonants) {
			if (nextChar in consonants && (!previousChar || i !== 1) && !(currentChar in smallConsonants)) {
				replacement += 'a';
			}
		}

		const characterHandler = characterHandlers[currentChar];
		if (characterHandler) {
			replacement = characterHandler(replacement, previousChar, nextChar, gurmukhiWord, i);
		}

		transliteration.unshift(replacement);
	}

	return transliteration.join('');
}

function toEnglish (gurmukhiLine: string) {
	return gurmukhiLine.split(' ').map(transliterateWord).join(' ');
}

export const transliterate = {
	toEnglish,
};
