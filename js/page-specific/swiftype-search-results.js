namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.swiftypeSearchResults = (function swiftypeSearchResults($,
	querystringer, Handlebars, constants) {
	var $searchResultsTarget;
	var templateSelector = '#swiftype-search-results-template';
	var errorMessageHtml = '<p>There were no results found for this search.</p>';

	function getSearchResults(searchTerm, pageNumber) {
		var currentPageNumber = pageNumber || 1;
		var cleanedSearchTerm = searchTerm.trim().replace(/\+/g, '%20');

		$.ajax(constants.keywordSearch.urls.api + cleanedSearchTerm + '/' + currentPageNumber)
			.then(searchResultRequestSuccessHandler, searchResultRequestErrorHandler);
	}

	function searchResultRequestErrorHandler(err) {
		console.error(err); // eslint-disable-line no-console
	}

	function buildResultSettings(result) {
		var highlight = result.highlight.body || result.highlight.sections || result.highlight.title;
		var title = result.title;
		var url = result.url;

		return {
			highlight: highlight,
			title: title,
			url: url
		};
	}

	function buildSearchResults(hits) {
		var results = [];

		for (var i = 0, hitCount = hits.length; i < hitCount; i += 1) {
			results.push(buildResultSettings(hits[i]));
		}

		return results;
	}

	function buildPageLinks(lastPage, currentPage) {
		var pageLinks = [];

		for (var i = 1; i <= lastPage; i += 1) {
			pageLinks.push({
				page: i,
				current: i === currentPage
			});
		}

		return pageLinks;
	}

	function calculateLastResultNumber(info) {
		return info.current_page * info.per_page < info.total_result_count ?
			info.current_page * info.per_page :
			info.total_result_count;
	}

	function calculateFirstResultNumber(info) {
		return ((info.current_page - 1) * info.per_page) + 1;
	}

	function buildSearchResultsHtml(templateSettings) {
		var source = $(templateSelector).html();
		var template = Handlebars.compile(source);
		var searchResultsHtml = template(templateSettings);

		return searchResultsHtml;
	}

	function searchResultRequestSuccessHandler(response) {
		var info = response.info.page;
		var hits = response.records.page;
		var query = info.query;
		var maxPages = 10;
		var tooManyResults = info.num_pages > maxPages;
		var lastPage = tooManyResults ? maxPages : info.num_pages;
		var lastResultNumber = calculateLastResultNumber(info);
		var firstResultNumber = calculateFirstResultNumber(info);
		var spellingSuggestion = info.spelling_suggestion ? info.spelling_suggestion.text : undefined;
		var searchResults = buildSearchResults(hits);
		var pageLinks = buildPageLinks(lastPage, info.current_page);

		info.base_url = window.location.pathname + '?q=' + info.query + '&page=';

		info.index = {
			first: firstResultNumber,
			last: lastResultNumber
		};

		var templateSettings = {
			searchResult: searchResults,
			info: info,
			pageLinks: pageLinks,
			tooManyResults: tooManyResults,
			spellingSuggestion: spellingSuggestion,
			query: query
		};

		var searchResultsHtml = buildSearchResultsHtml(templateSettings);

		$searchResultsTarget.html(searchResultsHtml);
		$searchResultsTarget.find('.loading').hide();
		$searchResultsTarget.find('.search-results-display').show();
	}

	function init() {
		var queryStringDictionary = querystringer.getAsDictionary();

		$searchResultsTarget = $('.search-results');

		if (queryStringDictionary.q) {
			getSearchResults(queryStringDictionary.q, queryStringDictionary.page);
		} else {
			$searchResultsTarget.html(errorMessageHtml);
		}
	}

	return {
		/* test-code */
		calculateLastResultNumber: calculateLastResultNumber,
		calculateFirstResultNumber: calculateFirstResultNumber,
		buildPageLinks: buildPageLinks,
		/* end-test-code */
		init: init
	};
}(jQuery, baltimoreCounty.utility.querystringer, Handlebars, baltimoreCounty.constants));

$(function initialize() {
	baltimoreCounty.pageSpecific.swiftypeSearchResults.init();
});
