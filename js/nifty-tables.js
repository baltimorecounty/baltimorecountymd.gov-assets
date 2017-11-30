namespacer('baltimoreCounty');

baltimoreCounty.niftyTables = (function niftyTablesWrapper($, numericStringTools, undefined) { // eslint-disable-line

	'use strict';

	var columnIndex = 0;
	var shouldSortAscending = true;

	/*
         * Since we're sorting a table, we need to work out what we're
         * comparing against, based on the column header that was clicked.
         * Then we can compare the two rows that are passed in.
         */
	function clickedColumnSorter(aTableRow, bTableRow, type) {
		var aContent = getFirstTextFromCell(aTableRow, columnIndex).toLowerCase();
		var bContent = getFirstTextFromCell(bTableRow, columnIndex).toLowerCase();

		var aExtractedContent = numericStringTools.extractNumbersIfPresent(aContent);
		var bExtractedContent = numericStringTools.extractNumbersIfPresent(bContent);

		if (type === 'time') {
			var now = new Date();

			var aFullDate = now.toDateString() + ' ' + aContent.slice(0, 5) + ' ' + aContent.slice(-2);
			var bFullDate = now.toDateString() + ' ' + bContent.slice(0, 5) + ' ' + bContent.slice(-2);

			aExtractedContent = Date.parse(aFullDate);
			bExtractedContent = Date.parse(bFullDate);
		}
		var directionComparer = shouldSortAscending ? ascendingComparer : descendingComparer;

		return comparer(directionComparer, aExtractedContent, bExtractedContent);
	}

	/*
         * Use the supplied comparerFunction to compare a and b.
         */
	function comparer(comparerFunction, a, b) {
		return comparerFunction(a, b);
	}

	/*
         * Compares two values, and returns a result that incidates whether
         * or not the values are in ascending order.
         */
	function ascendingComparer(a, b) {
		if (a > b) { return 1; }

		if (b > a) { return -1; }

		return 0;
	}

	/*
         * Compares two values, and returns a result that incidates whether
         * or not the values are in descending order.
         */
	function descendingComparer(a, b) {
		if (a < b) { return 1; }

		if (b < a) { return -1; }

		return 0;
	}

	/*
         * Finds the content of the first <p> in a cell from the clicked column
         * of the supplied row. If there's no <p>, returns the raw text of the cell.
         */
	function getFirstTextFromCell(tableRow, clickedColumnIndex) {
		var $cell = $(tableRow).find('td').eq(clickedColumnIndex);
		var $p = $cell.find('p');

		return $p.length ? $p.text() : $cell.text();
	}

	/*
         * Sorts the table based on the column header that was clicked.
         */
	function tableSort(e) {
		var $clickedLink = $(e.target).closest('a');
		var $niftyTable = $clickedLink.closest('table');
		var $tableRows = $niftyTable.find('tr').has('td');
		var SORT_ASCENDING_CLASS = 'sort-ascending';
		var SORT_DESCENDING_CLASS = 'sort-descending';
		var linkText = $(e.target).text();
		var type = linkText && $(e.target).text().toLowerCase() === 'time' ? 'time' : '';

		columnIndex = $clickedLink.closest('th').index();

		shouldSortAscending = !($clickedLink.hasClass(SORT_ASCENDING_CLASS)
			|| $clickedLink.hasClass(SORT_DESCENDING_CLASS))
			|| $clickedLink.hasClass(SORT_DESCENDING_CLASS);

		if (shouldSortAscending) {
			$clickedLink.removeClass(SORT_DESCENDING_CLASS).addClass(SORT_ASCENDING_CLASS);
		} else {
			$clickedLink.removeClass(SORT_ASCENDING_CLASS).addClass(SORT_DESCENDING_CLASS);
		}

		$clickedLink.closest('tr').find('a').not($clickedLink).removeClass(SORT_ASCENDING_CLASS)
			.removeClass(SORT_DESCENDING_CLASS);

		$tableRows.detach();
		$tableRows.sort(function sortColumns(a, b) {
			return clickedColumnSorter(a, b, type);
		});
		$niftyTable.append($tableRows);

		resetTableStripes($tableRows, 'tr:visible:even', '#ebebeb');
		resetTableStripes($tableRows, 'tr:visible:odd', '#fff');
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
         * Build links and attach event handlers.
         */
	function init() {
		var $sortableTables = $('.nifty-table').filter('.nifty-table-sortable');
		var $sortableColumnHeadings = $sortableTables.find('th');

		// Create sorting links
		if ($sortableTables.length) {
			var $headingChildren = $sortableColumnHeadings.children();
			if ($headingChildren.length) {
				$sortableColumnHeadings.children().wrapInner('<a href="javascript:;" class="btn-sort" role="button"></a>');
			} else {
				$sortableColumnHeadings.wrapInner('<a href="javascript:;" class="btn-sort" role="button"></a>');
			}

			$sortableColumnHeadings.find('.btn-sort').on('click', tableSort);
		}
	}

	return {
		/* test-code */
		getFirstTextFromCell: getFirstTextFromCell,
		tableSort: tableSort,
		/* end-test-code */
		init: init
	};
}(jQuery, baltimoreCounty.utility.numericStringTools));

$(document).ready(function onReady() {
	baltimoreCounty.niftyTables.init();
});
