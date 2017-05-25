namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.debounce = (function() {
    var debounce = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    return debounce;
});