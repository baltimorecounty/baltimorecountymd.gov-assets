namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.querystringer = (function(undefined) {
    'use strict';

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

                qsDict[keyValueArr[KEY]] = keyValueArr.length === 2 ? keyValueArr[VALUE] : '';
            }

            return qsDict;
        }

        return false;
    };

    return {
        getAsDictionary: getAsDictionary
    };

})();