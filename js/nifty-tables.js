namespacer('baltimoreCounty');

baltimoreCounty.niftyTables = (function($) {
    'use strict';

    var columnIndex = 0,
        shouldSortAscending = true,

        /*
         * Since we're sorting a table, we need to work out what we're 
         * comparing against, based on the column header that was clicked. 
         * Then we can compare the two rows that are passed in.
         */
        clickedColumnSorter = function(aTableRow, bTableRow) {
            var aContent = getFirstTextFromCell(aTableRow, columnIndex),
                bContent = getFirstTextFromCell(bTableRow, columnIndex),
                aExtractedContent = extractNumbersIfPresent(aContent),
                bExtractedContent = extractNumbersIfPresent(bContent),
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
         * We want to consider the column text to be a number if it starts with a dollar 
         * sign, so let's peek at the first character and see if that's the case.
         * Don't worry, if it's just a normal number, it's handled elsewhere.
         */
        dollarSkipper = function(numberString) {
            var startsWithPeriodOrCurrencyRegex = /\$/;
            return startsWithPeriodOrCurrencyRegex.test(numberString[0]) && numberString.length > 1 ? 1 : 0;
        },

        /*
         * Is the first character of the value in question a number (without the dollar sign, if present)? 
         * If so, return the value as an actual number, rather than a string of numbers.
         */
        extractNumbersIfPresent = function(stringOrNumber) {
            var firstCharacterIndex = dollarSkipper(stringOrNumber),
                stringOrNumberPossiblyWithoutFirstCharacter = stringOrNumber.slice(firstCharacterIndex);                
            return parseFloat(stringOrNumber[firstCharacterIndex]) ? getFirstSetOfNumbersAndRemoveNonDigits(stringOrNumberPossiblyWithoutFirstCharacter) : stringOrNumber;
        },

        /*
         * Here, we're converting the first group of characters to a number, so we can sort 
         * numbers numerically, rather than alphabetically.
         */
        getFirstSetOfNumbersAndRemoveNonDigits = function(numbersAndAssortedOtherCharacters) {
            var allTheDigitsRegex = /^\.{0,1}(\d+[\,\.]{0,1})*\d+/i;
            return parseFloat(numbersAndAssortedOtherCharacters.match(allTheDigitsRegex)[0].split(',').join(''));
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
        dollarSkipper : dollarSkipper,
        extractNumbersIfPresent: extractNumbersIfPresent,
        getFirstSetOfNumbersAndRemoveNonDigits : getFirstSetOfNumbersAndRemoveNonDigits,
        /* end test code */
        init: init
    };

})(jQuery);

$(document).ready(function() {
    baltimoreCounty.niftyTables.init();
});