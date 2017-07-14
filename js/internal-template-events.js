(function ($) {
  /*Submit url to rate form*/
  $(document).on('submit', '#RateThisPageForm', function () {
    document.getElementById('url').value = window.location.href;

    if ($('input#website').val().length) {
      return false;
    }
  });
})(jQuery);