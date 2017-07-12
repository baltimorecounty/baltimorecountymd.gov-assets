namespacer('baltimoreCounty');

baltimoreCounty.internalCarousel = (function($) {

	var fixLinks = function() {
			var $links = $('.carousel selink');

			$links.each(function(index, selink) {
				var $selink = $(selink);
				var href = $selink.attr('externallink') ? $selink.attr('externallink') : $selink.attr('href');
				var $newLink = $('<a>').attr('href', href).attr('title', $selink.attr('title')).text($selink.text());

				if ($selink.attr('newwindow') && $selink.attr('newwindow') != 'false') {
					$newLink.attr('target', '_blank');
				}

				$selink.after($newLink);
				$selink.detach();
			});

		},
	
		init = function() {
			fixLinks();

			$('#mainContent .carousel').slick({ 
				autoplay: true,
				adaptiveHeight: true,
				autoplaySpeed: 5000,
				dots: true,
				/*Show dot navigation*/
				nextArrow: "<img src='//baltimorecountymd.gov/sebin/v/i/carousel-arrow-right.png' class='slick-next' />",
				/*Starts on slide 4*/
				prevArrow: "<img src='//baltimorecountymd.gov/sebin/f/m/carousel-arrow-left.png 'class='slick-prev' />"
			});
		};

	return {
		init: init
	};
	
})(jQuery);

$(function() { 
	baltimoreCounty.internalCarousel.init(); 
});