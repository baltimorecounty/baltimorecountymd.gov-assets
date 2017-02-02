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
    };

    return {
        getSubtree: getSubtree
    };

})();