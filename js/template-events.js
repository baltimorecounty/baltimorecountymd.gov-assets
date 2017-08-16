(function ($, TextResizer) {

  function onDocumentReady() {
    var textResizer = new TextResizer({
      listClass: "resizer-list"
    });
  }

  function searchButtonClicked(e) {
    var val = $('.search-input').val();

    if (val.length === 0) {
      e.preventDefault();
    }
  }

  function toggleMobileNavigation(e) {
    e.preventDefault();
    $('.primary-nav, .secondary-nav').toggleClass('mobile-menu-visible');
  }

  /**
   * Stuff to kick off when the template is loaded
   */
  $(document).ready(onDocumentReady);

  /**
   * Events
   */
  /*Toggle hamburger menu*/
  $(document).on('click', '.hamburger-btn', toggleMobileNavigation);

  /*Prevent a search with no text*/
  $(document).on('click', '.search-button', searchButtonClicked);
})(jQuery, TextResizer);