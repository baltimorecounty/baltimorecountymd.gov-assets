var inlineFormValidator = (function(window, $) {
    
    var errorMessageDict = [];

    //
    // Loads up the field IDs and error messages that SE renders in inline JavaScript.
    function loadFieldErrorMessageData() {
        var functionText = _CF_checkbcpscleangreen15.toString();
        var fieldValueRegExp = /_CF_onError\(_CF_this.+;/g;
        
        var matches = [], 
            tempArray = [];

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
                errorMessageDict.push(errorObject);
        }
    }

    //
    // Removes a string that wraps another string. For example, changes '"test"' to 'test'.
    function cleanWrappedText(text, stringToRemove) {
        return text.slice(text.indexOf(stringToRemove) + 1, text.lastIndexOf(stringToRemove));
    }
    
})(window, jQuery);