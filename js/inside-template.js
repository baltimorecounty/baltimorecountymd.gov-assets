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
})(jQuery, TextResizer);