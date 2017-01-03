var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.cdnFallback = (function($) {

    function load(obj, path, isHead) {
        if (!obj)
            scriptTag(path, isHead);
    }

    function scriptTag(path, isHead) {
        if (isHead)
            $('head').append('<script src="' + path + '"><\/script>');
        else 
            $('body').append('<script src="' + path + '"><\/script>');
    }

    return { 
        fallback: fallback
    };

})(jQuery);