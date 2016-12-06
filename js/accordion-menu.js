// Collapse the other items
(function($) {

    $(function() {

		var clickedAccordionLevel = 0;

		/* Opens any items that match the current URL, so the user 
		 * sees the current page as being active. 
		 */
		$('.bc-accordion-menu ul li a').each(function(idx, item) {
			var itemHref = item.getAttribute('href');
			if (window.location.href.toLowerCase() === itemHref.toLowerCase()) {
				$(item).addClass('current');
				var $collapsables = $(item).parentsUntil('.bc-accordion-menu', 'ul');
				$collapsables.addClass('in');
				var $siblings = $collapsables.siblings('a');
				
				if (!$siblings.hasClass('active'))
					$siblings.addClass('active');
			}      
		}); 

		/* Updates the tracked current accordion level, since Bootstrap Collapse
		 * wasn't exactly designed for nested menus.
		 */
		$('.bc-accordion-menu .panel a').on('click', function(e) {
			var $currentTarget = $(e.currentTarget);

			clickedAccordionLevel = getAccordionLevel($currentTarget);
			$currentTarget.attr('aria-expanded', !$currentTarget.attr('aria-expanded'));
		});

		/* Making sure only the active accordion level's "active" css class is cleared when the menu expands. */
		$('.bc-accordion-menu .collapse').on('show.bs.collapse', function() {
			var $collapsable = $(this);
			var $siblings = $collapsable.siblings('a');
			var accordionLevel = getAccordionLevel($collapsable);

			if (accordionLevel === clickedAccordionLevel && !$siblings.hasClass('active')) 
				$siblings.addClass('active');

		});

		/* Making sure only the active accordion level's "active" css class is cleared when the menu collapses. */
		$('.bc-accordion-menu .collapse').on('hide.bs.collapse', function() {
			var $collapsable = $(this);
			var $siblings = $collapsable.siblings('a');
			var accordionLevel = getAccordionLevel($collapsable);

			if (accordionLevel === clickedAccordionLevel && $siblings.hasClass('active')) 
				$siblings.removeClass('active');
		});
		
		// Hide all text-only nodes.
		$('.bc-accordion-menu .panel ul li').contents().filter(textNodeFilter).parent().css('display','none');

		/* Returns whether this is a parent or child accordion link. */
		function getAccordionLevel($element) {
			return $element.parents('ul').length + 1;
		}

		function textNodeFilter(idx, element) {
			if (element.nodeType === 3 && element.nodeValue.trim() !== '') {
				return true;
			}
		}

    });

})(jQuery);