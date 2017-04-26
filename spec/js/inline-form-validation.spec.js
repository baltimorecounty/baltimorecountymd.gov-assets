jasmine.getFixtures().fixturesPath = '/spec/js/fixtures';

describe('InlineFormValidation', function() {

    describe('loadFieldErrorMessageData', function() {       
        beforeAll(function() {
 	        loadFixtures('inline-form-validation.fixture.html');
        });

        it('parses the field names and error messages from a string of JS', function() {
            var actual = baltimoreCounty.inlineFormValidation.loadFieldErrorMessageData('everyfieldtyperequired');

            expect(actual.plain).toEqual('Plain text error');
            expect(actual.email).toEqual('Email error');
            expect(actual.date).toEqual('Date error');
            expect(actual.time).toEqual('Time error');
            expect(actual.phone).toEqual('Phone error');
            expect(actual.numeric).toEqual('Numeric error');
            expect(actual.zipcode).toEqual('ZIP error');
            expect(actual.dropdown).toEqual('dropdown error');
            expect(actual.dropdownmulti).toEqual('dropdownmulti error');
            expect(actual.checkboxsingle).toEqual('checkboxsingle error');
            expect(actual.checkboxset).toEqual('checkboxset error');
            expect(actual.radio).toEqual('radio error');
            expect(actual.textarea).toEqual('textarea error');
            expect(actual.datepicker).toEqual('datepicker error');
        });

    });

    describe('attachErrorMessages', function() {

        var errorMessages, 
            $form;

        beforeEach(function() {
 	        loadFixtures('inline-form-validation.fixture.html');
            errorMessages = baltimoreCounty.inlineFormValidation.loadFieldErrorMessageData('everyfieldtyperequired');
            $form = $('#everyfieldtyperequired');
            baltimoreCounty.inlineFormValidation.attachErrorMessages($form, errorMessages);
        });

        it('attaches error messages to all single elements - plain', function() {          
            var actual = $('#plain').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - email', function() {           
            var actual = $('#email').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - date', function() {           
            var actual = $('#date').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - time', function() {           
            var actual = $('#time').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - phone', function() {           
            var actual = $('#phone').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - numeric', function() {           
            var actual = $('#numeric').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - zipcode', function() {           
            var actual = $('#zipcode').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - dropdown', function() {           
            var actual = $('#dropdown').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - dropdownmulti', function() {           
            var actual = $('#dropdownmulti').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - checkboxsingle', function() {           
            var actual = $('#checkboxsingle').parent().siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - textarea', function() {           
            var actual = $('#textarea').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to all single elements - datepicker', function() {           
            var actual = $('#datepicker').siblings('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to each set of elements - checkboxset', function() {
            var actual = $form.find('input[name=checkboxset]').closest('.seFieldCell').find('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

        it('attaches error messages to each set of elements - radio', function() {
            var actual = $form.find('input[name=radio]').closest('.seFieldCell').find('.inline-form-error-message').length;
            expect(actual).toEqual(1);
        });

    });

    describe('cleanWrappedText', function() {

        it('returns a string without another string that wraps, when given a single-character wrapped string and the wrapper', function() {
            var actual = baltimoreCounty.inlineFormValidation.cleanWrappedText('#test#', '#');
            expect(actual).toEqual('test');
        });

        it('returns a string without another string that wraps, when given a multiple-character wrapped string and the wrapper', function() {
            var actual = baltimoreCounty.inlineFormValidation.cleanWrappedText('##test##', '##');
            expect(actual).toEqual('test');
        });

        it('returns the original string when passed a string that does not wrap, given a non-wrapped string and a preceding string', function() {
            var actual = baltimoreCounty.inlineFormValidation.cleanWrappedText('#test', '#');
            expect(actual).toEqual('#test');
        });

        it('returns the original string when passed a string that does not wrap, given a non-wrapped string and a concluding string', function() {
            var actual = baltimoreCounty.inlineFormValidation.cleanWrappedText('test#', '#');
            expect(actual).toEqual('test#');
        });

        it('returns the original string when passed a string that does not wrap, given a non-wrapped string and a concluding string', function() {
            var actual = baltimoreCounty.inlineFormValidation.cleanWrappedText('test', '#');
            expect(actual).toEqual('test');
        });

    });

    describe('validateRequiredElementsInWrapper', function() {});

    describe('allFieldsKeyupClickHandler', function() {});

    describe('inputsSelectsTextboxesBlurHandler', function() {});

    describe('submitClickHandler', function() {});

});