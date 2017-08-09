(function () {
	const containerNode = document.getElementsByClassName('container')[0];
	containerNode.addEventListener('click', function (event) {
		if (event.target.classList.contains('close')) {
			event.target.parentNode.classList.add('hidden');
		}
	});

	const searchDemoNode = document.getElementById('searchDemo');

	function showSearchDemo () {
		searchDemoNode.classList.remove('hidden');
	}

	const demoButton1 = document.getElementById('demo1');
	demoButton1.addEventListener('click', showSearchDemo);
})();

(function () {
	const mtl = document.getElementById('mtl');

	function mtlf () {
		let href = 'mailto';
		href += '\u003A';
		href += 'mangala';
		href += '\u0040';
		href += 'khalsa';
		href += '\u002E';
		href += 'com';
		mtl.href = href;
		mtl.removeEventListener('mouseenter', mtlf);
	}

	mtl.addEventListener('mouseenter', mtlf);
})();
