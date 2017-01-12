namespacer('baltimoreCounty');

baltimoreCounty.niftyTables = (function() {
    
    $(function() {

        var $niftyTable = $('.nifty-table'),
            columnIndex = 0,
            isAscending = true;

            clickedColumnSorter = function(a, b) {
                var aContent = getFirstParagraphTextFromCell(a, columnIndex),
                    bContent = getFirstParagraphTextFromCell(b, columnIndex),
                    aExtractedContent = extractNumbersIfPresent(aContent),
                    bExtractedContent = extractNumbersIfPresent(bContent),
                    directionComparer = isAscending ? ascendingComparer : descendingComparer;
                return comparer(directionComparer, aExtractedContent, bExtractedContent);
            },

            comparer = function(comparerFunction, a, b) {
                return comparerFunction(a, b);
            },
            
            getFirstParagraphTextFromCell = function(tableCell, idx) {
                return $(tableCell).find('td').eq(idx).find('p').text();
            },

            decimalAndDollarSkipper = function(numberString) {
                var startsWithPeriodOrCurrencyRegex = /[\.\$]/;
                return startsWithPeriodOrCurrencyRegex.test(numberString[0]) && numberString.length > 1 ? 1 : 0;
            },

            getFirstSetOfNumbersAndRemoveNonDigits = function(numbersAndAssortedOtherCharacters) {
                var allTheDigitsRegex = /^[\.\$]{0,1}(\d+[\,\.]{0,1})*\d+/i;
                return parseInt(numbersAndAssortedOtherCharacters.match(allTheDigitsRegex)[0].split(',').join(''))
            },

            extractNumbersIfPresent = function(stringOrNumber) {
                var firstCharacterIndex = decimalAndDollarSkipper(stringOrNumber);
                return parseInt(stringOrNumber[firstCharacterIndex]) ? getFirstSetOfNumbersAndRemoveNonDigits(stringOrNumber) : stringOrNumber;
            },

            ascendingComparer = function(a, b) {
                if (a > b)
                    return 1;

                if (b > a)
                    return -1;

                return 0;                
            },

            descendingComparer = function(a, b) {
                if (a < b)
                    return 1;

                if (b < a)
                    return -1;

                return 0;                
            },

            tableSort = function(e) {
                var $clickedLink = $(e.target),                    
                    $tableRows = $niftyTable.find('tr').not(':first-child');

                columnIndex = $clickedLink.closest('th').index();

                $tableRows.detach();
                $tableRows.sort(clickedColumnSorter);                    
                $niftyTable.append($tableRows);
                isAscending = !isAscending;
            };

        var $columnHeadings = $niftyTable.find('th');

        // Create sorting links
        $columnHeadings.children().wrap('<a href="javascript:;" class="btn-sort" role="button"></a>')

        // Attach sort function
        $columnHeadings.find('.btn-sort').on('click', tableSort);
    });

})();