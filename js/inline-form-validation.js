namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.inlineFormValidation = (function(window, $) {

    var $currentEventObject,
        $lastEventObject,
        $currentWrapper, 
        $lastWrapper,
        REQUIRED_TEXTBOX_SELECT_TEXTAREA_SELECTOR = 'input.seRequiredElement[type=text]:not(:disabled), select.seRequiredElement:not(:disabled), textarea.seRequiredElement:not(:disabled)',
        REQUIRED_CHECKBOX_RADIO_SELECTOR = 'input.seRequiredElement[type=radio]:not(:disabled), input.seRequiredElement[type=checkbox]:not(:disabled)',
        REQUIRED_ALL_FIELDS_SELECTOR = 'input.seRequiredElement:not(:disabled), select.seRequiredElement:not(:disabled), textarea.seRequiredElement:not(:disabled)',
        FIELD_WRAPPER_CLASS = '.seFieldCell',
        REQUIRED_FIELD_ERROR_MESSAGE_SELECTOR = '.inline-form-error-message';

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
    // Attaches the error messages to their respective required elements.
    function attachErrorMessages($form, errorMessages) {
        var $requiredElements = $form.find(REQUIRED_ALL_FIELDS_SELECTOR);

        $requiredElements.each(function(idx, item) {
            var $currentElement = $(item);

            if ($currentElement.is(REQUIRED_CHECKBOX_RADIO_SELECTOR)) {
                var $listWrapper = $currentElement.closest(FIELD_WRAPPER_CLASS);
                if (!$listWrapper.find(REQUIRED_FIELD_ERROR_MESSAGE_SELECTOR).length) {
                    $listWrapper.append('<p class="seRequiredMarker inline-form-error-message hidden">' + errorMessages[$currentElement.attr('name')] + '</p>');
                }
            } else {
                $currentElement.parent().append('<p class="seRequiredMarker inline-form-error-message hidden">' + errorMessages[$currentElement.attr('id')] + '</p>');
            }            
        });
    }
    

    //
    // Removes a string that wraps another string. For example, changes '"test"' to 'test'.
    function cleanWrappedText(text, stringToRemove) {
        return text.slice(text.indexOf(stringToRemove) + 1, text.lastIndexOf(stringToRemove));
    }
    
    //
    // Validation based on CSS class. 
    function isValid($field) {
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

        if ($field.hasClass('required-list')) {
            var fieldName = $field.attr('name');
            var $checkedFields = $('input[name=' + fieldName + ']:checked');
            return $checkedFields.length > 0;
        }

        if ($field.hasClass('required-checkbox-single'))
            return $field.is(':checked');

        return typeof validate.single($field.val(), {presence: true}) === 'undefined';
    }

    //
    // Handler for text box validation events
    function basicInputHandler(validationEvent, errorMessages) {     

        // So we don't throw an error when initially tabbing TO the field. 
        if (validationEvent.type.toLowerCase() === "keyup" && validationEvent.keyCode === 9)
            return;

        var $target = $(validationEvent.target),
            $errorMessage = $target.siblings(REQUIRED_FIELD_ERROR_MESSAGE_SELECTOR);

        if (!isValid($target)) {
            $errorMessage.removeClass('hidden');
        } else {
            $errorMessage.addClass('hidden');
        }

    }

    //
    // Handler for checkbox list and radiobutton list validation events
    function listInputHandler(validationEvent, errorMessages, $listWrapper) {   
        
        var $targets = $listWrapper.find(REQUIRED_CHECKBOX_RADIO_SELECTOR),
            $errorMessage = $listWrapper.find(REQUIRED_FIELD_ERROR_MESSAGE_SELECTOR);

        if (!isValid($targets)) {
            $errorMessage.removeClass('hidden');
        } else {
            $errorMessage.addClass('hidden');
        }

    }




    function validateRequiredElementsInLastWrapper($wrapper) {
        var $targets = $wrapper.find(REQUIRED_ALL_FIELDS_SELECTOR),
            $errorMessage = $wrapper.find(REQUIRED_FIELD_ERROR_MESSAGE_SELECTOR);

        if (!isValid($targets)) {
            $errorMessage.removeClass('hidden');
        } else {
            $errorMessage.addClass('hidden');
        }
    }







    //
    // Initialize and attach handlers.
    function init(formId) {
        var errorMessages = loadFieldErrorMessageData(formId),
            $form = $('#' + formId),
            $inputsSelectsTextboxes = $form.find(REQUIRED_TEXTBOX_SELECT_TEXTAREA_SELECTOR),
            $checkboxesRadios = $form.find(REQUIRED_CHECKBOX_RADIO_SELECTOR),
            $allRequiredFields = $form.find(REQUIRED_ALL_FIELDS_SELECTOR);

        attachErrorMessages($form, errorMessages);

        validate.extend(validate.validators.datetime, {      
            parse: function(value, options) {
                return moment(value)
            },
            format: function(value, options) {
                var format = options.dateOnly ? "DD-MM-YYYY" : "DD-MM-YYYY hh:mm:ss";
                return moment(value).format(format);
            }
        });

        // Set up textboxes, selects, and textareas to be validated as the user types.
        $inputsSelectsTextboxes.on('keyup', function(e) { 
            //basicInputHandler(e, errorMessages); 
        });            

        $allRequiredFields.on('keyup click', function(e) {
            $currentEventObject = $(e.target);
            $currentWrapper = $currentEventObject.closest(FIELD_WRAPPER_CLASS);
            $lastWrapper = $lastWrapper || $currentWrapper;
            
            var isSameWrapper = $currentWrapper.is($lastWrapper);
console.log('isSameWrapper', isSameWrapper);
            if (!isSameWrapper)
                validateRequiredElementsInLastWrapper($lastWrapper);

            $lastWrapper = $currentWrapper;
        });
    }

    // 
    // Revealed methods
    return {
        init: init
    };

})(window, jQuery);