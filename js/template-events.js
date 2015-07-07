(function($, TextResizer) {
	/*Prevent a search with no text*/
	$(document).on('click', '.search-button', function (e) {
        var val = $('.search-input').val();

        if (val.length === 0) {
            e.preventDefault();
        }
    });

	/*Toggle hamburger menu*/
    $(document).on('click', '.hamburger-btn', function(e) {
        e.preventDefault();
        $('.primary-nav, .secondary-nav').toggleClass('mobile-menu-visible');
    });

    /*Submit url to rate form*/
    $(document).on('submit', '#RateThisPageForm', function(){ 
        document.getElementById('url').value = window.location.href;
        
        if ($('input#website').val().length) {
            return false;
        } 
    });

    /*Initialize the Text Resizer*/
    $(document).ready(function () {
        var textResizer = new TextResizer({
            listClass: "resizer-list"
        });
    });
})(jQuery, TextResizer);