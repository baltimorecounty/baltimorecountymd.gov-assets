(function onTemplateEventsInit($) {
	var resizeTimer;
	var windowWidth;

	function $getSearchContainer(width) {
		return isMobile(width)
			? $('#search-container')
			: $('#internal-search-container');
	}

	function isMobile(width) {
		var mediaWidth = 990;
		var scrollBar = 15;
		return width < mediaWidth - scrollBar;
	}

	function onPageRating() { // eslint-disable-line consistent-return
		var urlElm = document.getElementById('url');

		if (urlElm) {
			urlElm.value = window.location.href;
		}

		if ($('input#website').val().length) {
			return false;
		}
	}

	function onSearchReady() {
		windowWidth = $(window).width();
		if (isMobile(windowWidth)) {
			repositionSearchBox(windowWidth);
		}
	}

	function onWindowResize() {
		var $window = $(window);
		var newWindowWidth = $window.width();
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function waitForResizeToFinish() {
			if (newWindowWidth !== windowWidth) {
				repositionSearchBox(newWindowWidth);
				windowWidth = newWindowWidth;
			}
		}, 100);
	}

	function repositionSearchBox(currentWindowWidth) {
		var $targetContainer = $getSearchContainer(currentWindowWidth);
		var searchFormHtml = $('.gsc-control-searchbox-only').closest('div').detach();

		$targetContainer.append(searchFormHtml);
	}

	$(document).ready(onSearchReady);

	/* Submit url to rate form */
	$(document).on('submit', '#RateThisPageForm', onPageRating);

	$(window).on('resize', onWindowResize);
}(jQuery));
