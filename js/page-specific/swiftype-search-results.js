namespacer("baltimoreCounty.pageSpecific");

baltimoreCounty.pageSpecific.swiftypeSearchResults = (function($, querystringer, Handlebars, undefined) {

	var $searchResultsTarget;
	var templateSelector = '#swiftype-search-results-template';
	var errorMessageHtml = '<p>There were no results found for this search.</p>';

	function getSearchResults(searchTerm, pageNumber) {
		pageNumber = pageNumber || 1;
		searchTerm = searchTerm.replace(/\+/g, '%20');

		$.ajax('//ba224964:1000/api/search/' + searchTerm + '/' + pageNumber).then(searchResultRequestSuccessHandler, searchResultRequestErrorHandler);
	}

	function searchResultRequestErrorHandler(err) {
		console.log(err);
	}

	function searchResultRequestSuccessHandler(response) {
		var info = response.info.page;
		var hits = response.records.page;

		info.base_url = window.location.pathname + '?q=' + info.query + '&page=';

		var searchResults = [];
		var pageLinks = [];

		info.index = {
			first: ((info.current_page - 1) * info.per_page) + 1,
			last: info.current_page * info.per_page < info.total_result_count ? info.current_page * info.per_page : info.total_result_count
		};

		$.each(hits, function(index, hit) {
			var highlight = hit.highlight.title || hit.highlight.sections || hit.highlight.body;
			var title = hit.title;
			var url = hit.url;

			searchResults.push({
				highlight: highlight,
				title: title,
				url: url
			});
		});

		for (var i = 1; i <= info.num_pages; i++) {
			pageLinks.push({
				page: i,
				current: i === info.current_page
			});
		}

		var source = $(templateSelector).html();
		var template = Handlebars.compile(source);
		var searchResultsHtml = template({ 
			searchResult: searchResults, 
			info: info,
			pageLinks: pageLinks
		});

		$searchResultsTarget.html(searchResultsHtml);
		$searchResultsTarget.find('.loading').hide();
		$searchResultsTarget.find('.search-results-display').fadeIn(250);
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
		init: init
	};

})(jQuery, baltimoreCounty.utility.querystringer, Handlebars);

$(function() { 
	baltimoreCounty.pageSpecific.swiftypeSearchResults.init(); 
});