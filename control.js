import GurmukhiKeyboard from './widgets/GurmukhiKeyboard.js';

const keyboard = GurmukhiKeyboard.create();
const footer = document.getElementsByTagName('footer')[0];
footer.appendChild(keyboard.node);

const searchInput = document.getElementsByClassName('search-input')[0];
keyboard.node.addEventListener('pointerdown', function (event) {
	if (event.target.classList.contains('keyboard-letter')) {
		searchInput.classList.remove('empty');
		searchInput.children[1].textContent += event.target.textContent;
	}
});

const bodyWidth = document.body.offsetWidth;
const rowPadding = 4 * 2; // 4px padding on left and right
const keyBorders = 10 * 2; // 1px border on each side of 10 keys
const desiredKeyWidth = (bodyWidth - rowPadding - keyBorders) / 10;
const keyRems = 5.5; // 5 from key width, 0.5 from key margins (0.25 * 2)
const baseFontSize = desiredKeyWidth / keyRems;
// Round down and drop decimals past the first two to keep it on the safer side of small
document.documentElement.style.fontSize = (Math.round(baseFontSize * 99) / 100) + 'px';
