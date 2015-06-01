(function ($, TextResizer) {
    $(document).ready(function () {
        /*Initialize the Text Resizer*/
        var textResizer = new TextResizer({
            listClass: "resizer-list"
        });
    });

    $(document).on('click', '.hamburger-btn', function(e) {
        e.preventDefault();

        $('.primary-nav, .secondary-nav').toggleClass('mobile-menu-visible');
    });

    $(document).on('submit', '#RateThisPageForm', function(){ 
            document.getElementById('url').value = window.location.href;
            
            if ($('input#website').val().length) {
                return false;
            } 
    });

    var sendGoogleEvent = function(desc, act) {
        act = act || 'click';
        ga('send', 'event', 'button', act, desc);
    };

    /*Event handling*/
    //Search Button
    $(document).on('click', '.search-button', function() {
        sendGoogleEvent('search-button');
    });
    //Search Result
    $(document).on('click', '.gsc-table-result div.gs-title a.gs-title', function() {
        sendGoogleEvent('search-result');
    });
})(jQuery, TextResizer);