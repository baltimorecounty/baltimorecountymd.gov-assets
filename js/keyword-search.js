namespacer('baltimoreCounty');

baltimoreCounty.keywordSearch = (function keywordSearch($, sessionStorage) {
	'use strict';

	var searchData;

	var onDataLoadedHandler = function onSearchTermAjaxSuccess(data, callback) {
		searchData = data;
		sessionStorage.setItem('searchData', JSON.stringify(data));
		callback();
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

	var init = function init(callback) {
		if (sessionStorage && sessionStorage.searchData) {
			searchData = JSON.parse(sessionStorage.searchData);
			onDataLoadedHandler(searchData, callback);
		} else {
			$.ajax('/mockups/search/data/searchTerms.json')
				.then(function success(data) {
					onDataLoadedHandler(data, callback);
				}, onDataLoadedError);
		}
	};

	return {
		init: init,
		search: search
	};
}(jQuery, sessionStorage));
