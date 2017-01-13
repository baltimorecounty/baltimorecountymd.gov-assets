/*
        clickedColumnSorter : clickedColumnSorter,
        getFirstTextFromCell: getFirstTextFromCell,
        dollarSkipper : dollarSkipper,
        extractNumbersIfPresent: extractNumbersIfPresent,
        getFirstSetOfNumbersAndRemoveNonDigits : getFirstSetOfNumbersAndRemoveNonDigits,
*/

jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';

describe('NiftyTables', function() {

    describe('getFirstTextFromCell', function() {
        // getFirstTextFromCell = function(tableRow, clickedColumnIndex)

        it ('gets first text the first column of the first row of the table', function() {

            loadFixtures('nifty-tables-sortable.fixture.html');
            
            var tableRow = $('.nifty-tables.nifty-table-sortable tr').has('td').first().get(),
                clickedColumnIndex = 0,
                expected = 'aaaa',
                actual = baltimoreCounty.niftyTables.getFirstTextFromCell(tableRow, clickedColumnIndex);

            expect(actual).toEqual(expected);
        });
    });

});