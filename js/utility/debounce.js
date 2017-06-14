namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.debounce = (function(callback, ms) {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();