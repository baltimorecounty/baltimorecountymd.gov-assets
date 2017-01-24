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
                $item.text(textArr.join(settings.separator) + settings.suffix);  
            }
        });
    };
})(jQuery);