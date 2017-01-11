namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.inlineFormValidation = (function(window, $) {

    var $currentEventObject,
        $lastEventObject,
        $currentWrapper, 
        $lastWrapper,
        $inputsSelectsTextboxes,
        $checkboxesRadios,
        $allRequiredFields,
        REQUIRED_TEXTBOX_SELECT_TEXTAREA_SELECTOR = 'input.seRequiredElement[type=text]:not(:disabled), select.seRequiredElement:not(:disabled), textarea.seRequiredElement:not(:disabled)',
        REQUIRED_CHECKBOX_RADIO_SELECTOR = '.seRequiredElement[type=radio]:not(:disabled), .seRequiredElement[type=checkbox]:not(:disabled)',
        REQUIRED_ALL_FIELDS_SELECTOR = '.seRequiredElement:not(:disabled)',
        REQUIRED_CHECKBOX_RADIO_LABEL_SELECTOR = '.seCheckboxLabel, .seRadioLabel',
        FIELD_WRAPPER_CLASS = '.seFieldCell',
        REQUIRED_FIELD_ERROR_MESSAGE_SELECTOR = '.inline-form-error-message',

        /*
         * Loads up the field IDs and error messages that SE renders in inline JavaScript.
         */
        loadFieldErrorMessageData = function(formId) {
            var functionText = window['_CF_check' + formId].toString(),
                fieldValueRegExp = /_CF_onError\(_CF_this.+;/g,
                matches = [], 
                tempArray = [],
                errorMessageDict = [];

            // This makes sure we're only pushing distinct values into the "matches" array.
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

                for (var m = 0; m < errorMessageDict.length; m++) {
                    exists = errorMessageDict[m].fieldName === errorObject.fieldName;
                    if (exists)
                        break;
                }

                if (!exists)
                    errorMessageDict[errorObject.fieldName] = errorObject.errorMessage;
            }

            return errorMessageDict;
        },

        /*
         * Attaches the error messages to their respective required elements.
         */
        attachErrorMessages = function($form, errorMessages) {
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
        },
        

        /*
         * Removes a string that wraps another string. For example, changes '"test"' to 'test'.
         */
        cleanWrappedText = function(text, stringToRemove) {
            return text.slice(text.indexOf(stringToRemove) + 1, text.lastIndexOf(stringToRemove));
        },
        
        /*
         * Validation based on CSS class. 
         */
        isValid = function($field) {

            if ($field.is(REQUIRED_CHECKBOX_RADIO_LABEL_SELECTOR)) {
                $field = $field.closest(FIELD_WRAPPER_CLASS).find(REQUIRED_CHECKBOX_RADIO_SELECTOR);
            }

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

            if ($field.hasClass('required-list') || $field.hasClass('required-checkbox-single')) {
                var fieldName = $field.attr('name');
                var $checkedFields = $('input[name=' + fieldName + ']:checked');

                return $checkedFields.length > 0;
            }

            return typeof validate.single($field.val(), {presence: true}) === 'undefined';
        },        
        
        /*
         * Looks to the last element 
         */
        validateRequiredElementsInWrapper = function($wrapper) {

            var $targets = $wrapper.find(REQUIRED_ALL_FIELDS_SELECTOR),
                $errorMessage = $wrapper.find(REQUIRED_FIELD_ERROR_MESSAGE_SELECTOR),
                $label = $wrapper.siblings('.seLabelCell').find('label');
            
            if (!$label.length)
                $targets = $targets.siblings('label');

            if ($targets.hasClass('required-checkbox-single'))
                $targets = $targets.closest('.seCheckboxLabel');

            if (!isValid($targets)) {                
                $errorMessage.removeClass('hidden');
                $targets.addClass('error-field');
                $label.addClass('error-label');
            } else {
                $errorMessage.addClass('hidden');
                $targets.removeClass('error-field');
                $label.removeClass('error-label');
            }
        },

        /*
         * Handles the keyup and click events for all required fields.
         */
        allFieldsKeyupClickHandler = function(e) {
            $currentEventObject = $(e.target);
            $currentWrapper = $currentEventObject.closest(FIELD_WRAPPER_CLASS);
            $lastWrapper = $lastWrapper || $currentWrapper;

            var isClick = e.type === 'click',
                isTab = e.which === 9,
                isSameWrapper = $currentWrapper.is($lastWrapper),
                isLabel = $currentEventObject.is('label, .seCheckboxLabel, .seRadioLabel');

            if (!isSameWrapper || (isSameWrapper && !isTab && !isClick))
                validateRequiredElementsInWrapper($lastWrapper);

            if (isLabel && !isTab) 
                validateRequiredElementsInWrapper($currentWrapper);

            $lastWrapper = $currentWrapper;        
        },

        /*
         * Handles the blur event for textboxes, selects, and textareas.
         */
        inputsSelectsTextboxesBlurHandler = function(e) {
            var $eventTarget = $(e.target),
                $targetWrapper = $eventTarget.closest(FIELD_WRAPPER_CLASS);
            
            validateRequiredElementsInWrapper($lastWrapper);                
        },

        /*
         * Handles the submit button's click event.
         */
        submitClickHandler = function(e) {
            e.preventDefault();
            var $form = $(e.target.form);

            $.each($form.find(FIELD_WRAPPER_CLASS), function(index, item) {
                var $wrapper = $(item);
                validateRequiredElementsInWrapper($wrapper);                
            });
        },

        /*
         * Initialize and attach handlers.
         */
        init = function(formId) {
            var errorMessages = loadFieldErrorMessageData(formId),
                $form = $('#' + formId);
            
            $inputsSelectsTextboxes = $form.find(REQUIRED_TEXTBOX_SELECT_TEXTAREA_SELECTOR);
            $checkboxesRadios = $form.find(REQUIRED_CHECKBOX_RADIO_SELECTOR);
            $allRequiredFields = $form.find(REQUIRED_ALL_FIELDS_SELECTOR);

            attachErrorMessages($form, errorMessages);

            validate.extend(validate.validators.datetime, {      
                parse: function(value, options) {
                    return moment(value);
                },
                format: function(value, options) {
                    var format = options.dateOnly ? "DD-MM-YYYY" : "DD-MM-YYYY hh:mm:ss";
                    return moment(value).format(format);
                }
            });

            $form.on('keyup click', $allRequiredFields, allFieldsKeyupClickHandler);
            $form.on('blur', $inputsSelectsTextboxes, inputsSelectsTextboxesBlurHandler);
            $('#submit').on('click', submitClickHandler);
        };

    /*
     * Revealed methods
     */
    return {
        init: init
    };

})(window, jQuery);