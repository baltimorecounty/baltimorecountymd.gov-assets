jasmine.getFixtures().fixturesPath = '/spec/js/fixtures';

describe('NiftyTables', function() {

    describe('getFirstTextFromCell', function() {

        beforeEach(function() {
            loadFixtures('nifty-tables-sortable.fixture.html');
        });

        it ('gets first text of the first column of the first row of the table', function() {
            var tableRow = $('.nifty-table.nifty-table-sortable tr').has('td').first().get(),
                clickedColumnIndex = 0,
                expected = 'aaaa',
                actual = baltimoreCounty.niftyTables.getFirstTextFromCell(tableRow, clickedColumnIndex);

            expect(actual).toEqual(expected);
        });

        it ('gets first text of the second column of the second row of the table', function() {
            var tableRow = $('.nifty-table.nifty-table-sortable tr').has('td').eq(1).get(),
                clickedColumnIndex = 1,
                expected = '3333',
                actual = baltimoreCounty.niftyTables.getFirstTextFromCell(tableRow, clickedColumnIndex);

            expect(actual).toEqual(expected);
        });

        it ('gets first text of the third column of the third row of the table', function() {
            var tableRow = $('.nifty-table.nifty-table-sortable tr').has('td').eq(2).get(),
                clickedColumnIndex = 2,
                expected = '$2222',
                actual = baltimoreCounty.niftyTables.getFirstTextFromCell(tableRow, clickedColumnIndex);

            expect(actual).toEqual(expected);
        });

    });
});