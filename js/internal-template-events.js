(function ($) {
  function ratePage() {
    document.getElementById('url').value = window.location.href;

    if ($('input#website').val().length) {
      return false;
    }
  }
  /*Submit url to rate form*/
  $('#RateThisPageForm').on('submit', ratePage);
})(jQuery);