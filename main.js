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
