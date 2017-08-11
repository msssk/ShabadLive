(function () {
	let activeDemo;
	let activeShabad;
	let shabadNodes = document.body.getElementsByClassName('shabad');

	function showDemo (id) {
		const demoNode = document.getElementById(id);

		if (demoNode) {
			demoNode.classList.remove('hidden');
			activeDemo = demoNode;

			if (id === 'shabadDemo') {
				const shabadNode = shabadNodes[0];
				activeShabad = shabadNode;
				resizeShabad(shabadNode);
			}
		}
	}

	function hideDemo () {
		if (activeDemo) {
			activeDemo.classList.add('hidden');
			activeDemo = null;
		}
	}

	function resizeShabad (shabadNode) {
		shabadNode = shabadNode || activeShabad;
		const parentHeight = shabadNode.parentElement.parentElement.offsetHeight;
		const parentWidth = shabadNode.parentElement.parentElement.offsetWidth;
		const nodeHeight = shabadNode.offsetHeight;
		const nodeWidth = shabadNode.offsetWidth;
		const heightRatio = (parentHeight / nodeHeight) * 0.9;
		const widthRatio = (parentWidth / nodeWidth) * 0.9;
		const scaleValue = Math.min(heightRatio, widthRatio);
		shabadNode.style.transform = 'scale(' + scaleValue + ')';
		shabadNode.style.left = ((parentWidth - nodeWidth) / 2) + 'px';
		shabadNode.style.top = ((parentHeight - nodeHeight) / 2) + 'px';
	}

	function rotateShabad (direction) {
		if (direction === 'prev') {
			nextNode = activeShabad.parentElement.previousElementSibling;
			if (!nextNode) {
				nextNode = shabadNodes[shabadNodes.length - 1].parentElement;
			}
		}
		else {
			nextNode = activeShabad.parentElement.nextElementSibling;
			if (!nextNode) {
				nextNode = shabadNodes[0].parentElement;
			}
		}
		activeShabad.parentElement.classList.add('hidden');
		nextNode.classList.remove('hidden');
		activeShabad = nextNode.getElementsByClassName('shabad')[0];
		resizeShabad(activeShabad);
	}

	document.body.addEventListener('click', function (event) {
		if (event.target.classList.contains('demoButton')) {
			showDemo(event.target.dataset.demoId);
		}
		else if (event.target.classList.contains('close')) {
			hideDemo();
		}
		else if (event.target.classList.contains('navicon')) {
			if (event.target.classList.contains('prev')) {
				rotateShabad('prev');
			}
			else {
				rotateShabad('next');
			}
		}
	});

	document.body.addEventListener('keydown', function (event) {
		switch (event.keyCode) {
			case /* escape */ 27:
				hideDemo();
				break;

			case /* left */ 37:
			case /* up   */ 38:
				rotateShabad('prev');
				break;

			case /* right */ 39:
			case /* down  */ 40:
				rotateShabad('next');
				break;
		}
		if (event.keyCode === /* escape */ 27) {
			hideDemo();
		}
	});
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
		mtl.href = href + '?subject=ShabadLive development support';
		mtl.removeEventListener('click', mtlf);
	}

	mtl.addEventListener('click', mtlf);
})();