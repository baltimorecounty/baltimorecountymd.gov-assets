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
    }

    return { 
        load: load
    };

})();