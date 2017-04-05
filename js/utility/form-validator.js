namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.formValidator = (function($) {

    /*
     * Simple validation, just makes sure there's a value.
     */
    var requiredFieldValidator = function($field) {
            if (!$field || typeof $field.val() === 'undefined' || $field.val().length === 0)
                return false;
            return true;
        },

        /*
         * RequiredFieldValidator for radio buttons
         */
        requiredFieldRadioValidator = function($field) {
            var fieldName = $field.attr('name');
            var $radioButtonGroup = $field.closest('form').find('input[name=' + fieldName + ']');
            var $checkedRadioButton = $radioButtonGroup.filter(':checked');

            if ($checkedRadioButton.length > 0)
                return requiredFieldValidator($checkedRadioButton);
            return false;
        },

        /*
         * Makes sure there's a value, and that the value mates the supplied regex.
         */
        requiredFieldPatternValidator = function($field, patternRegex) {
            if (typeof patternRegex === 'string') {
                try {
                    patternRegex = new RegExp(patternRegex);
                } catch (exception) {
                    console.log(exception);
                    return false;
                }
            }

            if (requiredFieldValidator($field)) {
                var value = $field.val();
                return patternRegex.test(value);
            }

            return false;
        };

        return {
            requiredFieldValidator: requiredFieldValidator,
            requiredFieldRadioValidator: requiredFieldRadioValidator,
            requiredFieldPatternValidator: requiredFieldPatternValidator
        };
})(jQuery);