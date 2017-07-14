(function ($) {
  function addActiveClass() {
    var pathName = window.location.pathname;
    var $localNav = $('#container_localnavigation');
    var $singleActiveLink = $localNav.find('a[href*="' + pathName + '"]');

    if (!$singleActiveLink.hasClass('current')) {
      $singleActiveLink.addClass('current');
    }
  }
  $(function () {
    addActiveClass();
  });
})(jQuery);