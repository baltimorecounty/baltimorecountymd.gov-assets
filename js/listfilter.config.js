$(function() {
    $('.bc-filter-content').listfilter({
        'filter': $('.bc-filter-form .bc-filter-form-filter'),
        'clearlink' : $('.bc-filter-form .bc-filter-form-clearButton'),
        'callback': function() {
            if ($('.bc-filter-content ul li[style="display: none;"]').length === $('.bc-filter-content ul li').length)
                $(".bc-filter-noResults").show();
            else    
                $(".bc-filter-noResults").hide();
        }
    });
});
