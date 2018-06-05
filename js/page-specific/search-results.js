namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.searchResults = (function searchResults(
    $,
    querystringer,
    Handlebars,
    constants
) {
    baltimoreCounty.constants.keywordSearch.urls.api =
        'https://testservices.baltimorecountymd.gov/api/search/';

    let $searchResultsTarget;
    const templateSelector = '#marty';
    const errorMessageHtml =
        '<p>There were no results found for this search.</p>';

    const cleanSearchTerm = termToClean => {
        let cleanedSearchTerm = termToClean.trim();
        const safeSearchTerms = [];
        // Ensure the last character is not '+' as the the trailing space causes no results
        if (cleanedSearchTerm[cleanedSearchTerm.length - 1] === '+') {
            cleanedSearchTerm = cleanedSearchTerm.slice(0, -1);
        }

        const searchTerms = cleanedSearchTerm.split('+');
        for (let i = 0, len = searchTerms.length; i < len; i += 1) {
            let term = decodeURIComponent(searchTerms[i])
                .replace(/[?#\\/]/g, ' ')
                .replace(/&/g, 'and')
                .trim();

            const encodedTerm = encodeURIComponent(term);
            safeSearchTerms.push(encodedTerm);
        }
        return safeSearchTerms.join('%20');
    };

    const getSearchResults = (searchTerm, pageNumber) => {
        const currentPageNumber = pageNumber || 1;
        const cleanedSearchTerm = cleanSearchTerm(searchTerm);
        const requestUrl = `${
            constants.keywordSearch.urls.api
        }${cleanedSearchTerm}/${currentPageNumber}`;

        $.ajax(requestUrl).then(
            searchResultRequestSuccessHandler,
            searchResultRequestErrorHandler
        );
    };

    const buildResultSettings = result => ({
        highlight: result.Description,
        title: result.Title,
        url: result.Url,
        id: result.Id
    });

    const searchResultRequestErrorHandler = err => {
        console.error(err); // eslint-disable-line no-console
    };

    const buildSearchResults = hits =>
        hits.map(result => buildResultSettings(result));

    const buildPageLinks = (lastPage, currentPage) =>
        Array(lastPage)
            .fill()
            .map((arrItem, i) => ({
                page: i + 1,
                current: i + 1 === currentPage
            }));

    const calculateLastResultNumber = info =>
        info.current_page * info.per_page < info.total_result_count
            ? info.current_page * info.per_page
            : info.total_result_count;

    const calculateFirstResultNumber = info =>
        (info.current_page - 1) * info.per_page + 1;

    const buildSearchResultsHtml = templateSettings => {
        const source = $(templateSelector).html();
        const template = Handlebars.compile(source);

        return template(templateSettings);
    };

    const searchResultRequestSuccessHandler = response => {
        const info = response.info.page;
        const hits = response.results;
        const query = info.query;
        const maxPages = 10;
        const tooManyResults = info.num_pages > maxPages;
        const lastPage = tooManyResults ? maxPages : info.num_pages;
        const lastResultNumber = calculateLastResultNumber(info);
        const firstResultNumber = calculateFirstResultNumber(info);
        const spellingSuggestion = info.spelling_suggestion
            ? info.spelling_suggestion.text
            : undefined;
        const searchResults = buildSearchResults(hits);
        const pageLinks = buildPageLinks(lastPage, info.current_page);

        info.base_url =
            window.location.pathname + '?q=' + info.query + '&page=';

        info.index = {
            first: firstResultNumber,
            last: lastResultNumber
        };

        const templateSettings = {
            searchResult: searchResults,
            info: info,
            pageLinks: pageLinks,
            tooManyResults: tooManyResults,
            spellingSuggestion: spellingSuggestion,
            query: query
        };

        const searchResultsHtml = buildSearchResultsHtml(templateSettings);

        $searchResultsTarget.html(searchResultsHtml);
        $searchResultsTarget.find('.loading').hide();
        $searchResultsTarget.find('.search-results-display').show();
    };

    const init = () => {
        const queryStringDictionary = querystringer.getAsDictionary();

        $searchResultsTarget = $('.search-results');

        if (queryStringDictionary.q) {
            getSearchResults(
                queryStringDictionary.q,
                queryStringDictionary.page
            );
        } else {
            $searchResultsTarget.html(errorMessageHtml);
        }
    };

    return {
        /* test-code */
        calculateLastResultNumber,
        calculateFirstResultNumber,
        buildPageLinks,
        /* end-test-code */
        init
    };
})(
    jQuery,
    baltimoreCounty.utility.querystringer,
    Handlebars,
    baltimoreCounty.constants
);

$(function initialize() {
    baltimoreCounty.pageSpecific.searchResults.init();
});
