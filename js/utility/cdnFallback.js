namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.cdnFallback = (function($) {

    var load = function(obj, path, isHead) {
        if (!obj)
            scriptTag(path, isHead);
    },

    scriptTag = function(path, isHead) {
        if (isHead)
            $('head').append('<script src="' + path + '"><\/script>');
        else 
            $('body').append('<script src="' + path + '"><\/script>');
    }

    return { 
        load: load
    };

})(jQuery);