jasmine.getFixtures().fixturesPath = '/spec/js/fixtures';

describe('NiftyTables', function () {

    describe('getFirstTextFromCell', function () {

        beforeEach(function () {
            loadFixtures('nifty-tables-sortable.fixture.html');
        });

        it('gets first text of the first column of the first row of the table', function () {
            var tableRow = $('.nifty-table.nifty-table-sortable tr').has('td').first().get(),
                clickedColumnIndex = 0,
                expected = 'aaaa',
                actual = baltimoreCounty.niftyTables.getFirstTextFromCell(tableRow, clickedColumnIndex);

            expect(actual).toEqual(expected);
        });

        it('gets first text of the second column of the second row of the table', function () {
            var tableRow = $('.nifty-table.nifty-table-sortable tr').has('td').eq(1).get(),
                clickedColumnIndex = 1,
                expected = '3333',
                actual = baltimoreCounty.niftyTables.getFirstTextFromCell(tableRow, clickedColumnIndex);

            expect(actual).toEqual(expected);
        });

        it('gets first text of the third column of the third row of the table', function () {
            var tableRow = $('.nifty-table.nifty-table-sortable tr').has('td').eq(2).get(),
                clickedColumnIndex = 2,
                expected = '$2222',
                actual = baltimoreCounty.niftyTables.getFirstTextFromCell(tableRow, clickedColumnIndex);

            expect(actual).toEqual(expected);
        });

    });

    describe('tableSort', function () {

        var fakeEvent,
            $niftyTable,
            $niftyTableHeaderRow,
            getConcatinatedColumnString = function($table) {
                var actualFirstColumnTextArr = [];
                $.each($table.find('tr td:first-child'), function (idx, item) {
                    actualFirstColumnTextArr.push($(item).text());
                });
                return actualFirstColumnTextArr.join('');
            };

        beforeEach(function () {
            loadFixtures('nifty-tables-sortable.fixture.html');

            fakeEvent = {};
            $niftyTable = $('.nifty-table.nifty-table-sortable');
            $niftyTableHeaderRow = $niftyTable.find('tr').has('th');
        });

        it('sorts the table ascendingly when a column header link is clicked for the first time', function () {
            var expected = 'aaaabbbbcccc';

            fakeEvent.target = $niftyTableHeaderRow.find('a').first().get();
            
            baltimoreCounty.niftyTables.tableSort(fakeEvent);

            var actual = getConcatinatedColumnString($niftyTable);

            expect(actual).toEqual(expected);
        });

        it('sorts the table descendingly when a column header link is clicked for the second time', function () {
            var expected = 'ccccbbbbaaaa';
                
            fakeEvent.target = $niftyTableHeaderRow.find('a').first().get();
            
            baltimoreCounty.niftyTables.tableSort(fakeEvent);
            baltimoreCounty.niftyTables.tableSort(fakeEvent);

            var actual = getConcatinatedColumnString($niftyTable);

            expect(actual).toEqual(expected);
        });

    });

});