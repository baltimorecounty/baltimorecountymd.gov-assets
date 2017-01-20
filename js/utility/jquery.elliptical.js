;(function($, undefined) {
    'use strict';

    $.fn.elliptical = function(options) {

        var settings = $.extend({
            deepestDescendentSelector: 'a',
            separator: ' ',
            suffix: '...'
        }, options);

        return this.filter(function(index, item) { 
            return $(item).height() < item.scrollHeight;
        }).each(function(index, item) {
            var $item = $(item),
                textArr = $item.text().split(settings.separator),
                $deepestDescendent = $item.find(settings.deepestDescendentSelector);

            while (item.scrollHeight > $item.height()) {
                textArr.pop();
                $deepestDescendent.text(textArr.join(settings.separator));
            }
            textArr.pop();
            $deepestDescendent.text(textArr.join(settings.separator) + settings.suffix);
        });
    };
})(jQuery);