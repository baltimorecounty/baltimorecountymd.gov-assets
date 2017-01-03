namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.inlineFormValidation = (function(window, $) {

    //
    // Loads up the field IDs and error messages that SE renders in inline JavaScript.
    function loadFieldErrorMessageData(formId) {
        var functionText = window['_CF_check' + formId].toString();
        var fieldValueRegExp = /_CF_onError\(_CF_this.+;/g;
        
        var matches = [], 
            tempArray = [],
            errorMessageDict = [];

        while ((tempArray = fieldValueRegExp.exec(functionText)) !== null) {
            if (matches.indexOf(tempArray[0]) === -1)
                matches.push(tempArray[0]);
        }

        for (var i = 0; i < matches.length; i++) {
            var exists = false,
                matchParts = matches[i].split(','),
                matchFieldNameIndex = 1,
                matchErrorMessageIndex = 3,
                fieldName = cleanWrappedText(matchParts[matchFieldNameIndex], '"'),
                errorMessage = cleanWrappedText(matchParts[matchErrorMessageIndex], '"'),
                errorObject = {
                    fieldName: fieldName,
                    errorMessage: errorMessage
                };

            $.each(errorMessageDict, function(idx, item) {
                if (item.fieldName === errorObject.fieldName) {
                    exists = true;                    
                }
            });

            if (!exists)
                errorMessageDict[errorObject.fieldName] = errorObject.errorMessage;
        }

        return errorMessageDict;
    }

    //
    // Removes a string that wraps another string. For example, changes '"test"' to 'test'.
    function cleanWrappedText(text, stringToRemove) {
        return text.slice(text.indexOf(stringToRemove) + 1, text.lastIndexOf(stringToRemove));
    }
    
    //
    // Validation based on CSS class. 
    function isValid($field) {
        validate.extend(validate.validators.datetime, {      
            parse: function(value, options) {
                return moment(value)
            },
            format: function(value, options) {
                var format = options.dateOnly ? "DD-MM-YYYY" : "DD-MM-YYYY hh:mm:ss";
                return moment(value).format(format);
            }
        });

        if ($field.hasClass('required-email')) 
            return typeof validate.single($field.val(), {presence: true, email: true}) === 'undefined';

        if ($field.hasClass('required-date')) 
            return typeof validate.single($field.val(), {presence: true, datetime: true, format: /\d{1,2}[\/-]\d{1,2}[\/-]\d{4}/ }) === 'undefined';

        if ($field.hasClass('required-numeric')) 
            return typeof validate.single($field.val(), {presence: true, format: /^\d+$/ }) === 'undefined';

        if ($field.hasClass('required-phone')) 
            return typeof validate.single($field.val(), {presence: true, format: /^\d{3}-\d{3}-\d{4}$/ }) === 'undefined';
        
        if ($field.hasClass('required-zip')) 
            return typeof validate.single($field.val(), {presence: true, format: /^\d{5}$/ }) === 'undefined';
        
        if ($field.hasClass('required-zipPlusFour')) 
            return typeof validate.single($field.val(), {presence: true, format: /^\d{5}-\d{4}$/ }) === 'undefined';
 
         if ($field.hasClass('required-datepicker'))
            return typeof validate.single($field.val(), {presence: true}) === 'undefined';

       



        if ($field.hasClass('required-SOMETHING'))
            return typeof validate.single($field.val(), {presence: true}) === 'undefined';

        if ($field.hasClass('required-SOMETHING'))
            return typeof validate.single($field.val(), {presence: true}) === 'undefined';

        if ($field.hasClass('required-SOMETHING'))
            return typeof validate.single($field.val(), {presence: true}) === 'undefined';

        if ($field.hasClass('required-SOMETHING'))
            return typeof validate.single($field.val(), {presence: true}) === 'undefined';

        if ($field.hasClass('required-SOMETHING'))
            return typeof validate.single($field.val(), {presence: true}) === 'undefined';

        if ($field.hasClass('required-SOMETHING'))
            return typeof validate.single($field.val(), {presence: true}) === 'undefined';

        return typeof validate.single($field.val(), {presence: true}) === 'undefined';
    }

    //
    // Initialize and attach handlers.
    function init(formId) {
        var errorMessages = loadFieldErrorMessageData(formId);
        var $form = $('#' + formId);

        $form.find('.seRequiredElement').on('keyup blur', function(e) {
            var $target = $(e.target);

            if (!isValid($target)) {
                if ($target.siblings('.inline-form-error-message').length === 0) {
                    $target.parent().append('<i class="seRequiredMarker fa fa-times-circle inline-form-error-icon" aria-hidden="true"></i>');
                    $target.parent().append('<p class="seRequiredMarker inline-form-error-message">' + errorMessages[$target.attr('id')] + '</p>');
                }
            } else 
                $target.parent().find('.inline-form-error-message, .inline-form-error-icon').remove();
        });
    }

    // 
    // Revealed methods
    return {
        init: init
    };

})(window, jQuery);