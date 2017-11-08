(function ($) {
  function ratePage() {
    var urlElm = document.getElementById('url');
    
    if (urlElm) {
        urlElm.value = window.location.href;
    }

    if ($('input#website').val().length) {
      return false;
    }
  }
  /*Submit url to rate form*/
  $(document).on('submit', '#RateThisPageForm', ratePage);
})(jQuery);