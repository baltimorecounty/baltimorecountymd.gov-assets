/*
        clickedColumnSorter : clickedColumnSorter,
        getFirstTextFromCell: getFirstTextFromCell,
        dollarSkipper : dollarSkipper,
        extractNumbersIfPresent: extractNumbersIfPresent,
        getFirstSetOfNumbersAndRemoveNonDigits : getFirstSetOfNumbersAndRemoveNonDigits,
*/

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

    describe('getIndexOfFirstDigit', function() {
        //getIndexOfFirstDigit = function(numberString)

        it('returns 1 when the first character is a dollar sign', function() {
            var actual = baltimoreCounty.niftyTables.getIndexOfFirstDigit('$123');

            expect(actual).toEqual(1);
        });

        it('returns 0 when the first character is a digit', function() {
            var actual = baltimoreCounty.niftyTables.getIndexOfFirstDigit('123');

            expect(actual).toEqual(0);
        });

        it('returns 0 when the first character is a period', function() {
            var actual = baltimoreCounty.niftyTables.getIndexOfFirstDigit('.123');

            expect(actual).toEqual(0);
        });

        it('returns 0 when the first character is a letter', function() {
            var actual = baltimoreCounty.niftyTables.getIndexOfFirstDigit('Q123');

            expect(actual).toEqual(0);
        });

    });

    describe('extractNumbersIfPresent', function() {

        it('returns a string if the first character is a letter', function() {
            var actual = baltimoreCounty.niftyTables.extractNumbersIfPresent('a111');

            expect(actual).toEqual('a111');
        });

        it('returns a number if the string is all numeric and starts with a number', function() {
            var actual = baltimoreCounty.niftyTables.extractNumbersIfPresent('111');

            expect(actual).toEqual(111);
        });

        it('returns a number if the string is all numeric and starts with a period', function() {
            var actual = baltimoreCounty.niftyTables.extractNumbersIfPresent('.111');

            expect(actual).toEqual(0.111);
        });

        it('returns a string if the string is partially numeric', function() {
            var actual = baltimoreCounty.niftyTables.extractNumbersIfPresent('11a11');

            expect(actual).toEqual('11a11');
        });

    });

    describe('getFirstSetOfNumbersAndRemoveNonDigits', function() {
        //getFirstSetOfNumbersAndRemoveNonDigits = function(numbersAndAssortedOtherCharacters)

        it('returns a number when input is all numeric and starts with a number', function() {
            var actual = baltimoreCounty.niftyTables.getFirstSetOfNumbersAndRemoveNonDigits('123456789');

            expect(actual).toEqual(123456789);
        });

        it('returns a number when input is all numeric and starts with a comma-separated number', function() {
            var actual = baltimoreCounty.niftyTables.getFirstSetOfNumbersAndRemoveNonDigits('123,456,789');

            expect(actual).toEqual(123456789);
        });

        it('returns the original string when input is all alphabetic', function() {
            var actual = baltimoreCounty.niftyTables.getFirstSetOfNumbersAndRemoveNonDigits('abcdef');

            expect(actual).toEqual('abcdef');
        });

        it('returns the original string when input is partially alphabetic and starts with a letter', function() {
            var actual = baltimoreCounty.niftyTables.getFirstSetOfNumbersAndRemoveNonDigits('abcd1234');

            expect(actual).toEqual('abcd1234');
        });

        it('returns the original string when input is partially alphabetic and starts with a number', function() {
            var actual = baltimoreCounty.niftyTables.getFirstSetOfNumbersAndRemoveNonDigits('1234abcd');

            expect(actual).toEqual('1234abcd');
        });

        it('returns the original string when input is partially alphabetic and starts with a decimal', function() {
            var actual = baltimoreCounty.niftyTables.getFirstSetOfNumbersAndRemoveNonDigits('.123abc');

            expect(actual).toEqual('.123abc');
        });
    });
});