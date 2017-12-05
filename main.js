(function () {
	var activeDemo;
	var activeShabad;
	var shabadNodes = document.body.getElementsByClassName('shabad');
	function showDemo(id) {
		var demoNode = document.getElementById(id);
		if (demoNode) {
			demoNode.classList.remove('hidden');
			activeDemo = demoNode;
			if (id === 'shabadDemo') {
				var shabadNode = shabadNodes[0];
				activeShabad = shabadNode;
				resizeShabad(shabadNode);
			}
		}
	}
	function hideDemo() {
		if (activeDemo) {
			activeDemo.classList.add('hidden');
			activeDemo = null;
		}
	}
	function resizeShabad(shabadNode) {
		shabadNode = shabadNode || activeShabad;
		var parentHeight = shabadNode.parentElement.parentElement.offsetHeight;
		var parentWidth = shabadNode.parentElement.parentElement.offsetWidth;
		var nodeHeight = shabadNode.offsetHeight;
		var nodeWidth = shabadNode.offsetWidth;
		var heightRatio = (parentHeight / nodeHeight) * 0.9;
		var widthRatio = (parentWidth / nodeWidth) * 0.9;
		var scaleValue = Math.min(heightRatio, widthRatio);
		shabadNode.style.transform = 'scale(' + scaleValue + ')';
		shabadNode.style.left = ((parentWidth - nodeWidth) / 2) + 'px';
		shabadNode.style.top = ((parentHeight - nodeHeight) / 2) + 'px';
	}
	function rotateShabad(direction) {
		var nextNode;

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
			case 27:
				hideDemo();
				break;
			case 37:
			case 38:
				rotateShabad('prev');
				break;
			case 39:
			case 40:
				rotateShabad('next');
				break;
		}
		if (event.keyCode === 27) {
			hideDemo();
		}
	});
}());
(function () {
	var mtl = document.getElementById('mtl');
	function mtlf() {
		var href = 'mailto';
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
}());
