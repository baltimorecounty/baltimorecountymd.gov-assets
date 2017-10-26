namespacer('baltimoreCounty');

baltimoreCounty.keywordSearch = (function keywordSearch($, sessionStorage, Handlebars, constants) {
	'use strict';

	var searchData;
	var maxResultCount = 5;

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
			$.ajax(constants.keywordSearch.urls.searchTerms)
				.then(onDataLoadedHandler);
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
			if (Object.prototype.hasOwnProperty.call(match, 'Term')) {
				if (match.Term.indexOf(searchTerm) === 0) {
					orderedMatches.push(match);
				}
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

		if ([constants.keyCodes.arrowUp, constants.keyCodes.arrowDown].indexOf(keyCode) !== -1) {
			event.preventDefault();
		}
	};

	/**
	 * Does the actual searching.
	 * 
	 * @param {string} searchTerm 
	 */
	var search = function search(searchTerm, maxMatches) {
		if (!searchData || !searchData.length) {
			throw Error('Module "keywordSearch" is not initialized.');
		}

		var allMatches = [];

		if (typeof searchTerm === 'string' && searchTerm.trim().length > 0) {
			searchData.forEach(function forEach(element) {
				if (Object.prototype.hasOwnProperty.call(element, 'Term')) {
					if (element.Term.toLowerCase().indexOf(searchTerm) > -1) {
						allMatches.push(element);
					}
				}
			});
		}

		var topOrderedMatches = orderByNameThenPopularity(searchTerm, allMatches).slice(0, maxMatches);
		var topHighlightedOrderedMatches = highlightMatches(searchTerm, topOrderedMatches);

		return topHighlightedOrderedMatches;
	};

	/**
	 * Handler for the searchBox Keyup event
	 * @param {Event} event 
	 */
	var searchBoxKeyupHandler = function searchBoxKeyupHandler(event) {
		var keyCode = event.which || event.keyCode;
		var $target = $(event.currentTarget);
		var searchTerm = $target.val().toLowerCase();
		var maxResults = event.data.maxResultCount;
		var $searchResults = $('#header-search-results');
		var areSearchResultsVisible = $searchResults.find('li').is(':visible');
		var $allSearchResults = $searchResults.find('li');

		if (keyCode === constants.keyCodes.arrowDown && areSearchResultsVisible) {
			$allSearchResults.first().trigger('focus');
			return;
		}

		if (keyCode === constants.keyCodes.arrowUp && areSearchResultsVisible) {
			$allSearchResults.last().trigger('focus');
			return;
		}

		var matches = search(searchTerm, maxResults);
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

		if (event.type === 'click' || keyCode === constants.keyCodes.enter) {
			$searchBox.val($target.text());
			$searchResults.hide();
			$searchBox.closest('form').trigger('submit');
			return;
		}

		if (keyCode === constants.keyCodes.arrowUp && $target.is('li')) {
			if ($target.is(':first-child')) {
				$searchBox.trigger('focus');
			} else {
				$target.prev().trigger('focus');
			}

			return;
		}

		if (keyCode === constants.keyCodes.arrowDown && $target.is('li')) {
			if ($target.is(':last-child')) {
				$searchBox.trigger('focus');
			} else {
				$target.next().trigger('focus');
			}
		}
	};

	$(document).on('keyup', '#q', { maxResultCount: maxResultCount }, searchBoxKeyupHandler);
	$(document).on('click keyup', '#header-search-results li', { searchBoxSelector: '#q' }, searchSuggestionsClickKeyupHandler);
	$(document).on('keydown', '#header-search-results li', { searchBoxSelector: '#q' }, scrollStoppingKeydownHandler);
	$(document).on('keydown', '#q', scrollStoppingKeydownHandler);
	$(document).on('click', documentClickHandler);

	return {
		init: init,
		search: search,
		orderByNameThenPopularity: orderByNameThenPopularity
	};
}(jQuery, sessionStorage, Handlebars, baltimoreCounty.constants));

$(function init() {
	baltimoreCounty.keywordSearch.init();
});
