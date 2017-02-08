describe('Form validation library', function() {

    var ns = baltimoreCounty.utility;

    describe('requiredFieldValidator', function() {
        
        var $input;

        beforeEach(function() {
            $input = $(document.createElement('input'));
        });

        it('returns false when there is an empty value', function() {
            $input.attr('value', '');

            var actual = ns.formValidator.requiredFieldValidator($input);

            expect(actual).toBe(false);
        });

        it('returns false when there is an undefined value', function() {
            var actual = ns.formValidator.requiredFieldValidator($input);

            expect(actual).toBe(false);
        });

        it('returns false when the field is undefined', function() {
            var actual = ns.formValidator.requiredFieldValidator(undefined);

            expect(actual).toBe(false);
        });

        it('returns true when there is a value', function() {
            $input.attr('value', 'test');

            var actual = ns.formValidator.requiredFieldValidator($input);

            expect(actual).toBe(true);
        });

    });

    describe('requiredFieldPatternValidator', function() {

        var $input;

        beforeEach(function() {
            $input = $(document.createElement('input'));
        });

        it('returns true when the pattern is a regexp object that matches the input value', function() {
            $input.attr('value', 'test');

            var actual = ns.formValidator.requiredFieldPatternValidator($input, /^test$/);

            expect(actual).toBe(true);
        });

        it('returns false when the pattern is a regexp object that does not match the input value', function() {
            $input.attr('value', 'test');

            var actual = ns.formValidator.requiredFieldPatternValidator($input, /^badtest$/);

            expect(actual).toBe(false);
        });

        it('returns true when the pattern is a string representing a regexp object that matches the input value', function() {
            $input.attr('value', 'test');

            var actual = ns.formValidator.requiredFieldPatternValidator($input, '^test$');

            expect(actual).toBe(true);            
        });

        it('returns false when the pattern is a string representing a regexp object that does not match the input value', function() {
            $input.attr('value', 'test');

            var actual = ns.formValidator.requiredFieldPatternValidator($input, '^badtest$');

            expect(actual).toBe(false);            
        });

    });

});