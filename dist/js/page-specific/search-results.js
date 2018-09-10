(function onInit($, getUrlParameter) {
	var searchTerm = getUrlParameter('q');
	var onReady = function onReady() {
		$('.search-input').val(searchTerm);
	};

	$(document).ready(onReady);
}(jQuery, baltimoreCounty.utility.querystringer.getUrlParameter || function empty() {}));
