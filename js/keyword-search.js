namespacer('baltimoreCounty');

baltimoreCounty.keywordSearch = (function keywordSearch($, sessionStorage, Handlebars) {
	'use strict';

	var searchData;

	var documentClickHandler = function documentClickHandler() {
		var $searchResults = $('#header-search-results');

		if ($searchResults.is(':visible')) {
			$searchResults.hide();
		}
	};

	/**
	 * Highlights the matched term in the results.
	 * 
	 * @param {String} searchTerm 
	 * @param {Array<Term, Order>} matches 
	 */
	var highlightMatches = function highlightMatches(searchTerm, matches) {
		var highlightedMatches = [];

		matches.forEach(function forEachTopFiveMatch(match) {
			var highlightedMatch = $.extend({}, match);
			highlightedMatch.Term = highlightedMatch.Term.replace(searchTerm, '<strong>' + searchTerm + '</strong>');
			highlightedMatches.push(highlightedMatch);
		});

		return highlightedMatches;
	};

	var init = function init(callback) {
		if (sessionStorage && sessionStorage.searchData) {
			searchData = JSON.parse(sessionStorage.searchData);
		} else {
			$.ajax('/sebin/m/m/searchTerms.json')
				.then(onDataLoadedHandler, onDataLoadedError);
		}

		if (typeof callback !== 'undefined') {
			callback();
		}
	};


	/**
	 * Handles the loaded data and puts it in session storage in the browser.
	 * 
	 * @param {Array<Term, Order>} data 
	 */
	var onDataLoadedHandler = function onDataLoadedHandler(data) {
		searchData = data;
		sessionStorage.setItem('searchData', JSON.stringify(data));
	};

	/**
	 * Error handler
	 * 
	 * @param {Object} err 
	 */
	var onDataLoadedError = function onDataLoadedError(err) {
		console.log(err);
	};

	/**
	 * Matches the almighty Google's autocomplete rules
	 * 
	 * @param {string} searchTerm 
	 * @param {Array<Term, Order>} matches 
	 */
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

	/**
	 * Stops the browser window from scrolling when the up and down
	 * arrows are used on the search results.
	 */
	var scrollStoppingKeydownHandler = function scrollStoppingKeydownHandler(event) {
		var keyCode = event.which || event.keyCode;

		if ([38, 40].indexOf(keyCode) !== -1) {
			event.preventDefault();
		}
	};

	/**
	 * Does the actual searching.
	 * 
	 * @param {string} searchTerm 
	 */
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
		var topFiveHighlightedOrderedMatches = highlightMatches(searchTerm, topFiveOrderedMatches);

		return topFiveHighlightedOrderedMatches;
	};

	/**
	 * Handler for the searchBox Keyup event
	 * @param {Event} event 
	 */
	var searchBoxKeyupHandler = function searchBoxKeyupHandler(event) {
		var keyCode = event.which || event.keyCode;
		var $target = $(event.currentTarget);
		var $searchResults = $('#header-search-results');

		if (keyCode === 40 && $searchResults.find('li').is(':visible')) {
			$searchResults.find('li').first().trigger('focus');
			return;
		}

		if (keyCode === 38 && $searchResults.find('li').is(':visible')) {
			$searchResults.find('li').last().trigger('focus');
			return;
		}

		var matches = search($target.val());
		var $source = $('#search-results-template');
		var template = Handlebars.compile($source.html());
		var html = template(matches);

		$searchResults.html(html);
		$searchResults.show();
	};

	/**
	 * Handles the keyboard navigation for the search results.
	 * 
	 * @param {Event} event 
	 */
	var searchSuggestionsClickKeyupHandler = function searchSuggestionsClickHandler(event) {
		var $searchBox = $(event.data.searchBoxSelector);
		var keyCode = event.which || event.keyCode;
		var $searchResults = $('#header-search-results');
		var $target = $(event.currentTarget);

		if (event.type === 'click' || keyCode === 13) {
			$searchBox.val($target.text());
			$searchResults.hide();
			return;
		}

		if (keyCode === 38 && $target.is('li')) {
			if ($target.is(':first-child')) {
				$searchBox.trigger('focus');
			} else {
				$target.prev().trigger('focus');
			}

			return;
		}

		if (keyCode === 40 && $target.is('li')) {
			if ($target.is(':last-child')) {
				$searchBox.trigger('focus');
			} else {
				$target.next().trigger('focus');
			}
		}
	};

	$(document).on('keyup', '#q', searchBoxKeyupHandler);
	$(document).on('click keyup', '#header-search-results li', { searchBoxSelector: '#q' }, searchSuggestionsClickKeyupHandler);
	$(document).on('keydown', '#header-search-results li', { searchBoxSelector: '#q' }, scrollStoppingKeydownHandler);
	$(document).on('keydown', '#q', scrollStoppingKeydownHandler);
	$(document).on('click', documentClickHandler);

	return {
		init: init,
		search: search,
		orderByNameThenPopularity: orderByNameThenPopularity
	};
}(jQuery, sessionStorage, Handlebars));

$(function init() {
	baltimoreCounty.keywordSearch.init();
});
