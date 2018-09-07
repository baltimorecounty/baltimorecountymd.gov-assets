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

	var getUrlParameter = function(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};

    return {
		getAsDictionary: getAsDictionary,
		getUrlParameter: getUrlParameter
    };

})();