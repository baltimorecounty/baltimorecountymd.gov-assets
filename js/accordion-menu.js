// Collapse the other items
(function accordionMenu($) {
  let clickedAccordionLevel = 0;

  /**
   * Add active class to any links inside the local navigation on the page
   */
  function addCurrentClass($elm) {
    const pathName = window.location.pathname;
    const elmHref = $elm.attr('href');

    if (elmHref.indexOf(pathName) > -1) {
      $elm.closest('panel').addClass('current');
    }
  }

  /* Returns whether this is a parent or child accordion link. */
  function getAccordionLevel($element) {
    return $element.parents('ul').length + 1;
  }

  function textNodeFilter(idx, element) {
    if (element.nodeType === 3 && element.nodeValue.trim() !== '') {
      return true;
    }
    return false;
  }

  function hideTextOnlyNodes($elm) {
    $elm
      .contents()
      .filter(textNodeFilter)
      .parent().css('display', 'none');
  }

  function openActiveItem(idx, item) {
    const itemHref = item.getAttribute('href');
    const $item = $(item);

    if (window.location.href.toLowerCase() === itemHref.toLowerCase()) {
      $item.addClass('current');
      const $collapsables = $(item).parentsUntil('.bc-accordion-menu', 'ul');
      $collapsables.addClass('in');
      const $siblings = $collapsables.siblings('.accordion-collapsed');

      if (!$siblings.hasClass('active')) { $siblings.addClass('active'); }
    } else {
      addCurrentClass($item);
    }
  }

  function toggleAccordion(e, action) {
    const $collapsable = $(e.currentTarget);
    const $siblings = $collapsable.siblings('.accordion-collapsed');
    const accordionLevel = getAccordionLevel($collapsable);

    if (accordionLevel === clickedAccordionLevel && $siblings.hasClass('active')) {
      if (action === 'hide') {
        $siblings.removeClass('active');
      }
      if (action === 'show') {
        $siblings.addClass('active');
      }
    }
  }

  function onAccordionHide(e) {
    toggleAccordion(e, 'hide');
  }

  function onAccordionShow(e) {
    toggleAccordion(e, 'show');
  }

  function setUpCollapse(e) {
    $(e.target).siblings('.collapse').collapse('toggle');
    return false;
  }

  function trackAccordionLevel(e) {
    const $currentTarget = $(e.currentTarget);

    clickedAccordionLevel = getAccordionLevel($currentTarget);
    $currentTarget.attr('aria-expanded', !$currentTarget.attr('aria-expanded'));
  }

  /**
   * When the page is ready
   */
  $(() => {
		/* Opens any items that match the current URL, so the user 
		 * sees the current page as being active. 
		 */
    $('.bc-accordion-menu a').each(openActiveItem);

    // Hide all text-only nodes.
    hideTextOnlyNodes($('.bc-accordion-menu .panel ul li'));

    /**
     * Events
     */
		/* Updates the tracked current accordion level, since Bootstrap Collapse
		 * wasn't exactly designed for nested menus.
		 */
    $(document).on('click', '.bc-accordion-menu .panel .accordion-collapsed', trackAccordionLevel);

    // Set up the DIVs to expand and collapse their siblings.
    $(document).on('click', '.bc-accordion-menu .accordion-collapsed', setUpCollapse);

    /* Ensure he active accordion level's "active" css class is cleared when the menu expands. */
    $('.bc-accordion-menu .collapse').on('show.bs.collapse', onAccordionShow);

    /* Ensure the active accordion level's "active" css class is cleared when the menu collapses. */
    $('.bc-accordion-menu .collapse').on('hide.bs.collapse', onAccordionHide);
  });
}(jQuery));
