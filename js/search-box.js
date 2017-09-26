(function (window) {
	text = "";
	for (i = 0; i < search_results.length; i++) {
		text += '<div class="query row"><div class="col-sm-3"></div><div class="col-sm-4">' + search_results[i]["query"] + '</div><div class="col-sm-2" style="text-align: right">' + search_results[i]["res"] + '</div><div class="col-sm-2"></div></div>'
	}
	text += '<div id="truenet-logo"><img class="img-responsive" src="img/truenet_letter.png" ></div>';
	document.getElementById('ts').innerHTML = text;

	var closeCtrl = document.getElementById('btn-search-close'),
		searchContainer = document.querySelector('.search'),
		inputSearch = searchContainer.querySelector('.search__input'),
		topSearches = '';

	function init() {
		initEvents();
	}

	function initEvents() {
		inputSearch.addEventListener('focus', openSearch);
		closeCtrl.addEventListener('click', closeSearch);
		document.addEventListener('keyup', function (ev) {
			// escape key.
			if (ev.keyCode == 27) {
				closeSearch();
			}
		});
	}

	function resetResultBox() {
		document.getElementById('result').innerHTML = "";
		document.getElementById('result-info').innerHTML = "Hello, I am Truth Bot!";
	}

	function openSearch() {

		topSearches = document.getElementById('ts').innerHTML;
		searchContainer.classList.add('search--open');
		searchContainer.style.height = "auto";
		inputSearch.focus();
		document.getElementById('ts').innerHTML = "";
	}

	function closeSearch() {
		searchContainer.classList.remove('search--open');
		searchContainer.style.height = "";
		inputSearch.blur();
		inputSearch.value = '';
		text = "";
		for (i = 0; i < search_results.length; i++) {
			text += '<div class="query row"><div class="col-sm-3"></div><div class="col-sm-4">' + search_results[i]["query"] + '</div><div class="col-sm-2" style="text-align: right">' + search_results[i]["res"] + '</div><div class="col-sm-2"></div></div>'
		}
		text += '<div id="truenet-logo"><img class="img-responsive" src="img/truenet_letter.png" ></div>';
		document.getElementById('ts').innerHTML = text;
		//resetResultBox();
	}

	init();

})(window);
