jasmine.getFixtures().fixturesPath = '/spec/js/fixtures';

describe('NumericStringTools', function() {

    describe('getIndexOfFirstDigit', function() {
        //getIndexOfFirstDigit = function(numberString)

        it('returns 1 when the first character is a dollar sign', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getIndexOfFirstDigit('$123');

            expect(actual).toEqual(1);
        });

        it('returns 0 when the first character is a digit', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getIndexOfFirstDigit('123');

            expect(actual).toEqual(0);
        });

        it('returns 0 when the first character is a period', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getIndexOfFirstDigit('.123');

            expect(actual).toEqual(0);
        });

        it('returns 0 when the first character is a letter', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getIndexOfFirstDigit('Q123');

            expect(actual).toEqual(0);
        });

    });

    describe('extractNumbersIfPresent', function() {

        it('returns a string if the first character is a letter', function() {
            var actual = baltimoreCounty.utility.numericStringTools.extractNumbersIfPresent('a111');

            expect(actual).toEqual('a111');
        });

        it('returns a number if the string is all numeric and starts with a number', function() {
            var actual = baltimoreCounty.utility.numericStringTools.extractNumbersIfPresent('111');

            expect(actual).toEqual(111);
        });

        it('returns a number if the string is all numeric and starts with a period', function() {
            var actual = baltimoreCounty.utility.numericStringTools.extractNumbersIfPresent('.111');

            expect(actual).toEqual(0.111);
        });

        it('returns a string if the string is partially numeric', function() {
            var actual = baltimoreCounty.utility.numericStringTools.extractNumbersIfPresent('11a11');

            expect(actual).toEqual('11a11');
        });

    });

    describe('getFirstSetOfNumbersAndRemoveNonDigits', function() {
        //getFirstSetOfNumbersAndRemoveNonDigits = function(numbersAndAssortedOtherCharacters)

        it('returns a number when input is all numeric and starts with a number', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('123456789');

            expect(actual).toEqual(123456789);
        });

        it('returns a number when input is all numeric and starts with a comma-separated number', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('123,456,789');

            expect(actual).toEqual(123456789);
        });

        it('returns the original string when input is all alphabetic', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('abcdef');

            expect(actual).toEqual('abcdef');
        });

        it('returns the original string when input is partially alphabetic and starts with a letter', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('abcd1234');

            expect(actual).toEqual('abcd1234');
        });

        it('returns the original string when input is partially alphabetic and starts with a number', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('1234abcd');

            expect(actual).toEqual('1234abcd');
        });

        it('returns the original string when input is partially alphabetic and starts with a decimal', function() {
            var actual = baltimoreCounty.utility.numericStringTools.getFirstSetOfNumbersAndRemoveNonDigits('.123abc');

            expect(actual).toEqual('.123abc');
        });
    });
});