namespacer('baltimoreCounty');

baltimoreCounty.contentFilter = (function($) {

    var DEFAULT_WRAPPER_SELECTOR = '.bc-filter-content',
        DEFAULT_SEARCH_BOX_SELECTOR = '.bc-filter-form .bc-filter-form-filter',
        DEFAULT_CLEAR_BUTTON_SELECTOR = '.bc-filter-form .bc-filter-form-clearButton',
        DEFAULT_ERROR_MESSAGE_SELECTOR = '.bc-filter-noResults',
        DEFAULT_CONTENT_TYPE = 'list',

        /*
         * Initialize the filter, and activate it.
         */
        init = function(options) {

            options = options || {};

            var wrapperSelector = options.wrapper || DEFAULT_WRAPPER_SELECTOR,
                searchBoxSelector = options.searchBox || DEFAULT_SEARCH_BOX_SELECTOR,
                clearButtonSelector = options.clearButton || DEFAULT_CLEAR_BUTTON_SELECTOR,
                errorMessageSelector = options.errorMessage || DEFAULT_ERROR_MESSAGE_SELECTOR,
                contentType = options.contentType || DEFAULT_CONTENT_TYPE,
                $wrapper = safeLoad(wrapperSelector),
                $searchBox = safeLoad(searchBoxSelector),
                $errorMessage = safeLoad(errorMessageSelector),
				$clearIcon = $('.icon-clear');

            $errorMessage.hide();

            $searchBox.on('keyup', function(eventObject) {
				var criteria = $(eventObject.currentTarget).val();

				if (criteria.length) {
					showIcon('clear');
				} else {
					showIcon('search');
				}

                switch (contentType) {
                    case 'table':
                        filterTable($wrapper, criteria, $errorMessage);
                        break;
                    case 'list':
                        filterList($wrapper, criteria, $errorMessage);
                        break;
                }            
            });
            
            $searchBox.closest('form').on('submit', function(e) {
                return false;
            });

             $clearIcon.on('click', function() {
                clearFilter($wrapper, $searchBox, $errorMessage, function() {
					showIcon('search');
				});
            });
        },  

		showIcon = function(iconType, callback) {
			setTimeout(function() {
				var $iconSearch = $('.icon-search'),
					$iconClear = $('.icon-clear'),
					animationDuration = 150,
					animationPropertiesOut = { 
						top: 0,
						opacity: 0
					},
					animationPropertiesIn = { 
						top: '25px',
						opacity: 1
					};
					
				
				if (iconType === 'search' && $iconClear.is(':visible')) {
					$iconClear.animate(animationPropertiesOut, animationDuration, function() {
						$iconSearch.animate(animationPropertiesIn, animationDuration, function() {
							if (typeof(callback) === 'function')
								callback();
						});
					});
				}
				
				if (iconType === 'clear' && $iconSearch.is(':visible')) {
					$iconSearch.animate(animationPropertiesOut, animationDuration, function() {
						$iconClear.animate(animationPropertiesIn, animationDuration, function() {
							if (typeof(callback) === 'function')
								callback();
						});
					});				
				}
			}, 0);
		},

        setColumnWidthToInitialWidth = function(index, item) {
            var $columnHeader = $(item);
            $columnHeader.width($columnHeader.width());
        },

        safeLoad = function(selector) {
            var $items = $(selector);
            if ($items.length === 0)
                throw 'No elements for "' + selector + '" were found.';
            return $items;
        },

        /*
         * Tokenized search that returns the matches found in the list or table.
         */
        findMatches = function($wrapper, selector, criteria) {
            var criteriaTokens = criteria.trim().toLowerCase().replace(',','').split(' '); 

            var $matches = $wrapper.find(selector).filter(function(idx, element) {
                var selectorText = $(element).text().toLowerCase().replace(',','');            
                return criteriaTokens.every(function(tokenValue) {
                    return selectorText.indexOf(tokenValue) > -1;
                });
            });

            return $matches;
        },

        /*
         * Filters an unordered list based on the user's input.
         */
        filterList = function($wrapper, criteria, $errorMessage) {
            var $matches = findMatches($wrapper, 'ul li', criteria);

            $wrapper.find('li').not($matches).hide();
            $matches.show();

            var $divsWithResults = $wrapper.children('div').find('li').not('[style="display: none;"]').closest('div');

            $wrapper.children('div').not($divsWithResults).hide();
            $divsWithResults.show();

            if ($divsWithResults.length === 0) 
                $errorMessage.show();
            else
                $errorMessage.hide();
        },

        /*
         * Since the current table stripes are based on :nth-child(), they'll get funky
         * when the filter removes rows. So, let's reset the row striping when there's a search. 
         * This is using inline styles since there's inline CSS that sets the color and 
         * has to be overwritten.
         */
        resetTableStripes = function($matches, selector, color) {
            $matches.parent().children(selector).has('td').css('background-color', color);
        },

        /*
         * Filters an table of links and content based on the user's input.
         */
        filterTable = function($wrapper, criteria, $errorMessage) {
            var $matches = findMatches($wrapper, 'tr', criteria);

            $wrapper.find('tr').has('td').not($matches).hide();
            $matches.show();

            if ($matches.length === 0) {
                $errorMessage.show();
                $wrapper.find('tr').has('th').hide();
            } else {
                $errorMessage.hide();
                $wrapper.find('tr').has('th').show();
            }

            resetTableStripes($matches, 'tr:visible:even', '#ebebeb');
            resetTableStripes($matches, 'tr:visible:odd', '#fff');
        },

        /*
         * Clears the filter and displays all nodes in the list.
         */
        clearFilter = function($wrapper, $searchbox, $errorMessage, callback) {
            var $everythingWeFilter = $wrapper.find('li, div, tr');
			$everythingWeFilter.show();
            resetTableStripes($everythingWeFilter.filter('tr'), 'tr:visible:even', '#ebebeb');
            resetTableStripes($everythingWeFilter.filter('tr'), 'tr:visible:odd', '#fff');
            $searchbox.val('');
            $errorMessage.hide();
			if (typeof(callback) === 'function')
				callback();
        };

    /* Reveal! */

    return {
        init: init
    };

})(jQuery);
