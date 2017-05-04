namespacer('baltimoreCounty');

baltimoreCounty.internalCarousel = (function($) {

	var init = function() {
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

$(function() { baltimoreCounty.internalCarousel.init(); });