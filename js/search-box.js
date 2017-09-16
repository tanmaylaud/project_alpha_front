;(function(window) {

	'use strict';

	var closeCtrl = document.getElementById('btn-search-close'),
	searchContainer = document.querySelector('.search'),
	inputSearch = searchContainer.querySelector('.search__input'),
	topSearches = '<div class="query row"><div class="col-sm-3"></div><div class="col-sm-4">Hello world, is this the basics?</div><div class="col-sm-2">95%</div><div class="col-sm-3"></div></div><div class="query row"><div class="col-sm-3"></div><div class="col-sm-4">Hello world, is this the basics?</div><div class="col-sm-2">95%</div><div class="col-sm-3"></div></div><div class="query row"><div class="col-sm-3"></div><div class="col-sm-4">Hello world, is this the basics?</div><div class="col-sm-2">95%</div><div class="col-sm-3"></div></div><div id="truenet-logo"><img class="img-responsive" src="img/truenet_letter.png" ></button></div></div>';

	function init() {
		initEvents();	
	}

	function initEvents() {
		inputSearch.addEventListener('focus', openSearch);
		closeCtrl.addEventListener('click', closeSearch);
		document.addEventListener('keyup', function(ev) {
			// escape key.
			if( ev.keyCode == 27 ) {
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
		inputSearch.focus();
		document.getElementById('ts').innerHTML = "";

	}

	function closeSearch() {
		searchContainer.classList.remove('search--open');
		inputSearch.blur();
		inputSearch.value = '';
		document.getElementById('ts').innerHTML = topSearches;
		//resetResultBox();
	}

	init();

})(window);