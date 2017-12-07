namespacer('baltimoreCounty');

baltimoreCounty.contentFilter = (function contentFilterWrapper($, utilities) {
	var DEFAULT_WRAPPER_SELECTOR = '.bc-filter-content';
	var DEFAULT_SEARCH_BOX_SELECTOR = '.bc-filter-form .bc-filter-form-filter';
	var DEFAULT_ERROR_MESSAGE_SELECTOR = '.bc-filter-noResults';
	var DEFAULT_CONTENT_TYPE = 'list';

	/*
         * Initialize the filter, and activate it.
         */
	function init(options) {
		options = options || {}; // eslint-disable-line no-param-reassign

		var wrapperSelector = options.wrapper || DEFAULT_WRAPPER_SELECTOR;
		var searchBoxSelector = options.searchBox || DEFAULT_SEARCH_BOX_SELECTOR;
		var errorMessageSelector = options.errorMessage || DEFAULT_ERROR_MESSAGE_SELECTOR;
		var contentType = options.contentType || DEFAULT_CONTENT_TYPE;
		var $wrapper = safeLoad(wrapperSelector);
		var $searchBox = safeLoad(searchBoxSelector);
		var $errorMessage = safeLoad(errorMessageSelector);
		var $clearIcon = $('.icon-clear');

		$errorMessage.hide();

		$searchBox.on('keyup', function onKeyUp(eventObject) {
			utilities.debounce(function debounceWrapper() {
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
				default:
					break;
				}
			}, 100);
		});

		$searchBox.closest('form').on('submit', function onSubmit() {
			return false;
		});

		$clearIcon.on('click', function onClick() {
			clearFilter($wrapper, $searchBox, $errorMessage, function callback() {
				showIcon('search');
			});
		});
	}

	function showIcon(iconType, callback) {
		setTimeout(function setTimeoutWrapper() {
			var $iconSearch = $('.icon-search');
			var $iconClear = $('.icon-clear');
			var animationDuration = 150;
			var animationPropertiesOut = {
				top: 0,
				opacity: 0
			};
			var animationPropertiesIn = {
				top: '25px',
				opacity: 1
			};


			if (iconType === 'search' && $iconClear.is(':visible')) {
				$iconClear.animate(animationPropertiesOut, animationDuration,
					function animateOutsideWrapper() {
						$iconSearch.animate(animationPropertiesIn, animationDuration,
							function animateInsideWrapper() {
								if (typeof (callback) === 'function') { callback(); }
							});
					});
			}

			if (iconType === 'clear' && $iconSearch.is(':visible')) {
				$iconSearch.animate(animationPropertiesOut, animationDuration,
					function animateOutsideWrapper() {
						$iconClear.animate(animationPropertiesIn, animationDuration,
							function animateInsideWrapper() {
								if (typeof (callback) === 'function') { callback(); }
							});
					});
			}
		}, 0);
	}


	function safeLoad(selector) {
		var $items = $(selector);
		if ($items.length === 0) {
			throw new Error('No elements for "' + selector + '" were found.');
		}
		return $items;
	}

	/*
         * Tokenized search that returns the matches found in the list or table.
         */
	function findMatches($wrapper, selector, criteria) {
		var criteriaTokens = criteria.trim().toLowerCase().replace(',', '').split(' ');

		var $matches = $wrapper.find(selector).filter(function filterMatches(idx, element) {
			var selectorText = $(element).text().toLowerCase().replace(',', '');
			return criteriaTokens.every(function everyToken(tokenValue) {
				return selectorText.indexOf(tokenValue) > -1;
			});
		});

		return $matches;
	}

	/*
         * Filters an unordered list based on the user's input.
         */
	function filterList($wrapper, criteria, $errorMessage) {
		var $matches = findMatches($wrapper, 'ul li', criteria);

		$wrapper.find('li').not($matches).hide();
		$matches.show();

		var $divsWithResults = $wrapper.children('div').find('li').not('[style="display: none;"]').closest('div');

		$wrapper.children('div').not($divsWithResults).hide();
		$divsWithResults.show();

		if ($divsWithResults.length === 0) {
			$errorMessage.show();
		} else {
			$errorMessage.hide();
		}
	}

	/*
         * Since the current table stripes are based on :nth-child(), they'll get funky
         * when the filter removes rows. So, let's reset the row striping when there's a search.
         * This is using inline styles since there's inline CSS that sets the color and
         * has to be overwritten.
         */
	function resetTableStripes($matches, selector, color) {
		$matches.parent().children(selector).has('td').css('background-color', color);
	}

	/*
         * Filters an table of links and content based on the user's input.
         */
	function filterTable($wrapper, criteria, $errorMessage) {
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
	}

	/*
         * Clears the filter and displays all nodes in the list.
         */
	function clearFilter($wrapper, $searchbox, $errorMessage, callback) {
		var $everythingWeFilter = $wrapper.find('li, div, tr');
		$everythingWeFilter.show();
		resetTableStripes($everythingWeFilter.filter('tr'), 'tr:visible:even', '#ebebeb');
		resetTableStripes($everythingWeFilter.filter('tr'), 'tr:visible:odd', '#fff');
		$searchbox.val('');
		$errorMessage.hide();
		if (typeof (callback) === 'function') {
			callback();
		}
	}

	/* Reveal! */

	return {
		init: init
	};
}(jQuery, baltimoreCounty.utility));
