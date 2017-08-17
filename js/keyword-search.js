namespacer('baltimoreCounty');

baltimoreCounty.keywordSearch = (function keywordSearch($, sessionStorage, Handlebars) {
	'use strict';

	var searchData;

	var onDataLoadedHandler = function onSearchTermAjaxSuccess(data) {
		searchData = data;
		sessionStorage.setItem('searchData', JSON.stringify(data));
	};

	var onDataLoadedError = function onSearchTermAjaxError(err) {
		console.log(err);
	};

	var search = function search(searchTerm) {
		if (!searchData || !searchData.length) {
			throw Error('Module "keywordSearch" is not initialized.');
		}

		var matches = [];

		if (typeof searchTerm === 'string' && searchTerm.trim().length > 0) {
			searchData.forEach(function forEach(element) {
				if (element.Term.indexOf(searchTerm) > -1) {
					matches.push(element);
				}
			});
		}

		return matches;
	};

	var searchBoxKeydownHandler = function searchBoxKeydownHandler(event) {
		var $target = $(event.target);
		var matches = search($target.val()).slice(0, 5);
		var $source = $('#search-results-template');
		var template = Handlebars.compile($source.html());
		var html = template(matches);
		$('#header-search-results').html(html);
	};

	var init = function init(callback) {
		if (sessionStorage && sessionStorage.searchData) {
			searchData = JSON.parse(sessionStorage.searchData);
		} else {
			$.ajax('http://ba224964:1100/mockups/search/data/searchTerms.json')
				.then(onDataLoadedHandler, onDataLoadedError);
		}

		if (typeof callback !== 'undefined') {
			callback();
		}
	};

	$(document).on('keydown', '#q', searchBoxKeydownHandler);

	return {
		init: init,
		search: search
	};
}(jQuery, sessionStorage, Handlebars));

$(function init() {
	baltimoreCounty.keywordSearch.init();
});
