namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.binarySearch = (function binarySearchClosure() {
	'use strict';

	var binarySearch = function binarySearch(list, item) {
		var min = 0;
		var max = list.length - 1;
		var guess;

		while (min <= max) {
			guess = Math.floor((min + max) / 2);

			if (list[guess] === item) {
				return guess;
			}

			if (list[guess] < item) {
				min = guess + 1;
			} else {
				max = guess - 1;
			}
		}

		return -1;
	};

	return {
		binarySearch: binarySearch
	};
}());

namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.cdnFallback = (function() {

    /*
     * This is to be used after your CDN call, and will load a local script if the 
     * CDN fails. Which never happens.
     * 
     * obj: The object to test for. You can pass in a string or the object itself.
     * path: The path to the local copy of the script file.
     * isHead: Indication of whether to load the script in the head or the body.
     */
    var load = function(obj, path, isHead) {
        var exists = typeof obj === 'string' ? window[obj] : obj;

        if (!exists)
            createScriptTag(path, isHead);
    },

    /*
     * Actual script tag creation. The tag iself will be added aboce the 
     * closing head or body tag.
     * 
     * path: Path to the local copy of the script.
     * isHead: Indication of whether to load the script in the head or the body.
     */
    createScriptTag = function(path, isHead) {
        var scriptTag = document.createElement('script');
        scriptTag.src = path;

        if (isHead)
            document.getElementsByTagName('head')[0].appendChild(scriptTag);
        else 
            document.getElementsByTagName('body')[0].appendChild(scriptTag);
    };

    return { 
        load: load
    };

})();
namespacer('baltimoreCounty.utility');

/* from https://davidwalsh.name/javascript-debounce-function */
baltimoreCounty.utility.debounce = (function(func, wait, immediate) {
    var timeout;
    return function(func, wait, immediate) {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
})();
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
namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.format = (function () {
    'use strict';

    function formatCurrency(input) {
        if (!input) {
            return;
        }

        if (input && typeof input === 'string') {
            input = parseFloat(input);
        }

        var currencyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            // the default value for minimumFractionDigits depends on the currency
            // and is usually already 2
        });

        return currencyFormatter.format(input);
    }

    function formatPhoneNumber(input, format) {
        if (typeof input === 'number') {
            input = input.toString();
        }

        var exp = /\d+/g;
        var numbersOnly = input.match(exp).join('').split('');
        var numberOfXs = format.split('').filter(function (char) {
            return char === 'x';
        }).length;
        var hasOneAsPrefix = numberOfXs + 1 === numbersOnly.length;

        // 1 has been included in the str, but is not in the desired format
        if (hasOneAsPrefix) {
            numbersOnly.shift();
        }

        if (numberOfXs === numbersOnly.length || hasOneAsPrefix) {
            numbersOnly.forEach(function (number) {
                format = format.replace('x', number);
            });
        }
        else {
            console.error("Incorrect Format. Double Check your values.");
            return null;
        }

        return format;
    }

    var _formatters = {
        currency: formatCurrency,
        phoneNumber: formatPhoneNumber
    };

    function format(key, val, strFormat) {
        return _formatters[key](val, strFormat);
    }

    return format;
})();
;(function($, undefined) {
    'use strict';

    $.fn.elliptical = function(options) {

        var settings = $.extend({
            separator: ' ',
            suffix: '...'
        }, options);

        return this.filter(function(index, item) { 
            return $(item).height() < item.scrollHeight;
        }).each(function(index, item) {
            var $item = $(item),
                textArr = $item.text().split(settings.separator);

            while (item.scrollHeight > $item.height()) {
                textArr.pop();
                $item.text(textArr.join(settings.separator));
            }
            textArr.pop();
            $item.text(textArr.join(settings.separator) + settings.suffix);
        });
    };
})(jQuery);
namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.jsonTools = (function(undefined) {

    /**
     * Extracts a subtree of a json document based on a property match.
     */
   var getSubtree = function(jsonData, matchPropertyName, subtreePropertyName, searchValue) {
        var match;
        $.each(jsonData, function(idx, item) {
            if (item[subtreePropertyName]) {
                if (item[matchPropertyName] === searchValue) {
                    match = item[subtreePropertyName];   
                    return false;                    
                } else {
                    match = getSubtree(item[subtreePropertyName], searchValue);
                }
			} 
        });
        return match;
    },
	
	getSubtreePath = function(data, matchProperty, subtreeProperty, searchValue) {
		for (var x = 0; x < data.length; x++) {
			if (data[x][matchProperty] == searchValue) {
				return data[x][matchProperty];
			}
			if (data[x][subtreeProperty] && getSubtreePath(data[x][subtreeProperty], 'id', 'types', searchValue))
				return [data[x][matchProperty], getSubtreePath(data[x][subtreeProperty], 'id', 'types', searchValue)];
		}
	};

    return {
        getSubtree: getSubtree,
		getSubtreePath: getSubtreePath
    };

})();
/*
 * Creates namespaces safely and conveniently, reusing 
 * existing objects instead of overwriting them.
 */
function namespacer(ns) {
  var nsArr = ns.split('.');
  var parent = window;

  if (!nsArr.length) {
    return;
  }

  for (var i = 0, len = nsArr.length; i < len; i++) {
    var nsPart = nsArr[i];

    if (typeof parent[nsPart] === 'undefined') {
      parent[nsPart] = {};
    }

    parent = parent[nsPart];
  }
}
namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.numericStringTools = (function() {
	'use strict';

	var
		/*
         * We want to consider the column text to be a number if it starts with a dollar 
         * sign, so let's peek at the first character and see if that's the case.
         * Don't worry, if it's just a normal number, it's handled elsewhere.
         */
    	getIndexOfFirstDigit = function(numberString) {
            var startsWithCurrencyRegex = /[\$]/;
            return startsWithCurrencyRegex.test(numberString[0]) && numberString.length > 1 ? 1 : 0;
        },

        /*
         * Is the first character of the value in question a number (without the dollar sign, if present)? 
         * If so, return the value as an actual number, rather than a string of numbers.
         */
        extractNumbersIfPresent = function(stringOrNumber) {
            var firstCharacterIndex = getIndexOfFirstDigit(stringOrNumber),
                stringOrNumberPossiblyWithoutFirstCharacter = stringOrNumber.slice(firstCharacterIndex),
                firstSetOfNumbers = getFirstSetOfNumbersAndRemoveNonDigits(stringOrNumberPossiblyWithoutFirstCharacter);                
            return typeof firstSetOfNumbers === 'number' ? firstSetOfNumbers : stringOrNumber;
        },

        /*
         * Here, we're converting the first group of characters to a number, so we can sort 
         * numbers numerically, rather than alphabetically.
         */
        getFirstSetOfNumbersAndRemoveNonDigits = function(numbersAndAssortedOtherCharacters) {
            var allTheDigitsRegex = /^\.{0,1}(\d+[\,\.]{0,1})*\d+\b/,
                extractedNumerics = numbersAndAssortedOtherCharacters.match(allTheDigitsRegex);
            return extractedNumerics ? parseFloat(extractedNumerics[0].split(',').join('')) : numbersAndAssortedOtherCharacters;
        };

	return {
		getIndexOfFirstDigit: getIndexOfFirstDigit,
		extractNumbersIfPresent: extractNumbersIfPresent,
		getFirstSetOfNumbersAndRemoveNonDigits: getFirstSetOfNumbersAndRemoveNonDigits
	};		
})();
namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.querystringer = (function(undefined) {
    'use strict';

	/**
	 * Turns the querystring key/value pairs into a dictionary.
	 * 
	 * Important: All of the returned dictionary's keys will be lower-cased.
	 */
    var getAsDictionary = function() {

        if (window.location.search) {
            var qs = window.location.search.slice(1),
                qsArray = qs.split('&'),
                qsDict = {};

            for (var i = 0; i < qsArray.length; i++) {            
                var KEY = 0,
                    VALUE = 1,
                    keyValueArr = qsArray[i].split('='),
                    entry = {};

                qsDict[keyValueArr[KEY].toLowerCase()] = keyValueArr.length === 2 ? keyValueArr[VALUE] : '';
            }

            return qsDict;
        }

        return false;
    };

    return {
        getAsDictionary: getAsDictionary
    };

})();
namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.validate = (function validateWrapper() {
	'use strict';

	function validatePhoneNumber(str) {
		/**
             * Valid Formats:
                (123)456-7890
                (123) 456-7890
                123-456-7890
                123.456.7890
                1234567890
                +31636363634 (not working)
                075-63546725 (not working)
            */
		// var exp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
		var exp = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
		return exp.test(str);
	}

	var validatorDictionary = {
		phoneNumber: validatePhoneNumber
	};

	function validate(key, val) {
		return validatorDictionary[key](val);
	}

	return validate;
}());
