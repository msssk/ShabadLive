/**
 * Split a string on the middle-ish space into two roughly equal parts
 * @param text
 */
function splitText (text: string): [string, string] {
	const middleIndex = Math.ceil(text.length / 2);
	// look for a space in 2nd half of string to split at
	let splitIndex = text.indexOf(' ', middleIndex - 1);
	if (splitIndex === -1) {
		// get the last space in the first half of the string
		splitIndex = text.substring(0, middleIndex).lastIndexOf(' ');
	}

	return [
		text.substring(0, splitIndex),
		text.substring(splitIndex),
	];
}

function calculateFontSize (node: HTMLElement, availableWidth: number, config: Record<string, any>) {
	const {
		maxSize,
		minSize,
	} = config;
	const style = getComputedStyle(node);
	const currentFontSize = parseInt(style.getPropertyValue('font-size'), 10);
	const currentWidth = node.scrollWidth;
	const newFontSize = Math.min(
		Math.max(minSize, (availableWidth / currentWidth) * currentFontSize),
		maxSize
	);

	return newFontSize;
}

function fitContainer (node: HTMLElement, config?: Record<string, any>) {
	config = Object.assign({
		minSize: 36,
		maxSize: 512,
		tweakFactor: 1,
	}, config);

	node.style.display = 'inline-block';
	const availableWidth = node.parentElement.clientWidth;
	const newFontSize = calculateFontSize(node, availableWidth, config);
	node.style.fontSize = `${newFontSize}px`;

	if (node.scrollWidth > availableWidth) {
		const fullText = node.textContent;
		const [ halfText ] = splitText(fullText);
		node.textContent = halfText;
		node.style.fontSize = (calculateFontSize(node, availableWidth, config) * config.tweakFactor) + 'px';
		node.style.whiteSpace = 'normal';
		node.textContent = fullText;
	}

	node.style.display = '';
}

export const font = {
	fitContainer,
};
