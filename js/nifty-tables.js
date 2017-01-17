namespacer('baltimoreCounty');

baltimoreCounty.niftyTables = (function($) {
    'use strict';

    var columnIndex = 0,
        shouldSortAscending = true,
        numericStringTools = baltimoreCounty.utility.numericStringTools,

        /*
        * Since we're sorting a table, we need to work out what we're 
        * comparing against, based on the column header that was clicked. 
        * Then we can compare the two rows that are passed in.
        */
        clickedColumnSorter = function(aTableRow, bTableRow) {
            var aContent = getFirstTextFromCell(aTableRow, columnIndex),
                bContent = getFirstTextFromCell(bTableRow, columnIndex),
                aExtractedContent = numericStringTools.extractNumbersIfPresent(aContent),
                bExtractedContent = numericStringTools.extractNumbersIfPresent(bContent),
                directionComparer = shouldSortAscending ? ascendingComparer : descendingComparer;
            return comparer(directionComparer, aExtractedContent, bExtractedContent);
        },

        /*
        * Use the supplied comparerFunction to compare a and b.
        */
        comparer = function(comparerFunction, a, b) {
            return comparerFunction(a, b);
        },

        /*
        * Compares two values, and returns a result that incidates whether 
        * or not the values are in ascending order.
        */
        ascendingComparer = function(a, b) {
            if (a > b)
                return 1;

            if (b > a)
                return -1;

            return 0;                
        },

        /*
        * Compares two values, and returns a result that incidates whether 
        * or not the values are in descending order.
        */
        descendingComparer = function(a, b) {
            if (a < b)
                return 1;

            if (b < a)
                return -1;

            return 0;                
        },
        
        /*
        * Finds the content of the first <p> in a cell from the clicked column 
        * of the supplied row. If there's no <p>, returns the raw text of the cell.
        */
        getFirstTextFromCell = function(tableRow, clickedColumnIndex) {
            var $cell = $(tableRow).find('td').eq(clickedColumnIndex),
                $p = $cell.find('p');

            return $p.length ? $p.text() : $cell.text();
        },

        /*
        * Sorts the table based on the column header that was clicked.
        */
        tableSort = function(e) {
            var $clickedLink = $(e.target).closest('a'),                    
                $niftyTable = $clickedLink.closest('table'),
                $tableRows = $niftyTable.find('tr').not(':first-child');

            columnIndex = $clickedLink.closest('th').index();

            shouldSortAscending = !($clickedLink.hasClass('sort-ascending') || $clickedLink.hasClass('sort-descending')) || $clickedLink.hasClass('sort-descending');

            if (shouldSortAscending)
                $clickedLink.removeClass('sort-descending').addClass('sort-ascending');
            else
                $clickedLink.removeClass('sort-ascending').addClass('sort-descending');

            $clickedLink.closest('tr').find('a').not($clickedLink).removeClass('sort-ascending').removeClass('sort-descending');

            $tableRows.detach();
            $tableRows.sort(clickedColumnSorter);                    
            $niftyTable.append($tableRows);
        },        

        /*
        * Build links and attach event handlers.
        */
        init = function() {

            var $niftyTables = $('table.nifty-table'),
                $sortableTables = $('.nifty-table').filter('.nifty-table-sortable'),
                $sortableColumnHeadings = $sortableTables.find('th');
                
            // Create sorting links    
            if ($sortableTables.length) {
                $sortableColumnHeadings.children().wrap('<a href="javascript:;" class="btn-sort" role="button"></a>');
                $sortableColumnHeadings.find('.btn-sort').on('click', tableSort);
            }
        };

    return {
        /* test code */
        clickedColumnSorter : clickedColumnSorter,
        getFirstTextFromCell: getFirstTextFromCell,
        /* end test code */
        init: init
    };

})(jQuery);

$(document).ready(function() {
    baltimoreCounty.niftyTables.init();
});
