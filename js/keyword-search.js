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

	var orderByNameThenPopularity = function orderByNameThenPopularity(searchTerm, matches) {
		if (matches.length === 0 || matches.length === 1) {
			return matches;
		}

		var orderedMatches = [];

		matches.forEach(function eachMatch(match) {
			if (match.Term.indexOf(searchTerm) === 0) {
				orderedMatches.push(match);
			}
		});

		matches.forEach(function eachMatch(match) {
			if (match.Term.indexOf(searchTerm) !== 0) {
				orderedMatches.push(match);
			}
		});

		return orderedMatches;
	};

	var search = function search(searchTerm) {
		if (!searchData || !searchData.length) {
			throw Error('Module "keywordSearch" is not initialized.');
		}

		var allMatches = [];

		if (typeof searchTerm === 'string' && searchTerm.trim().length > 0) {
			searchData.forEach(function forEach(element) {
				if (element.Term.indexOf(searchTerm) > -1) {
					allMatches.push(element);
				}
			});
		}

		var topFiveOrderedMatches = orderByNameThenPopularity(searchTerm, allMatches).slice(0, 5);
		var topFiveHighlightedOrderedMatches = [];

		topFiveOrderedMatches.forEach(function forEachTopFiveMatch(match) {
			var highlightedMatch = $.extend({}, match);
			highlightedMatch.Term = highlightedMatch.Term.replace(searchTerm, '<strong>' + searchTerm + '</strong>');
			topFiveHighlightedOrderedMatches.push(highlightedMatch);
		});

		return topFiveHighlightedOrderedMatches;
	};

	var searchBoxKeyupHandler = function searchBoxKeyupHandler(event) {
		var $target = $(event.target);
		var matches = search($target.val());
		var $source = $('#search-results-template');
		var template = Handlebars.compile($source.html());
		var html = template(matches);
		$('#header-search-results').html(html);
	};

	var init = function init(callback) {
		if (sessionStorage && sessionStorage.searchData) {
			searchData = JSON.parse(sessionStorage.searchData);
		} else {
			$.ajax('/sebin/m/l/searchTerms.json')
				.then(onDataLoadedHandler, onDataLoadedError);
		}

		if (typeof callback !== 'undefined') {
			callback();
		}
	};

	$(document).on('keyup', '#q', searchBoxKeyupHandler);

	return {
		init: init,
		search: search,
		orderByNameThenPopularity: orderByNameThenPopularity
	};
}(jQuery, sessionStorage, Handlebars));

$(function init() {
	baltimoreCounty.keywordSearch.init();
});
