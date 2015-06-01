(function($, Flickr) {
	$(document).ready(function () {
		var $flickFeedContainer = $('.county-photo-feed');

	    //Load the flickr feed into the Baltimore County Now Section of the page
	    //above the news
	    var photoFeed = new Flickr({
	        apiKey: "ee58ce6536e4b39a95ebdf000ae4adf3",
	        nsid: "56007743@N08",
	        searchTags: "featured", //comma seperated list
	        template: "{{#each this}}<div class='county-photo-container col-md-3 col-sm-3 hidden-xs'><a href='//www.flickr.com/photos/baltimorecounty/{{id}}/' title='View this photo on Baltimore County&apos;s Flickr Album'><img alt='{{title}}' class='county-photo-feed-item' src='//farm{{farm}}.static.flickr.com/{{server}}/{{id}}_{{secret}}_q.jpg' alt='{{title}}' /></a></div>{{/each}}",
	        $container: $flickFeedContainer
	    });

	    //Initialize the Slick Carousel for County Promotions
        $('.carousel').slick({
            autoplay: true,
            adaptiveHeight: true,
            autoplaySpeed: 5000,
            dots: true,
            /*Show dot navigation*/
            nextArrow: "<img src='//baltimorecountymd.gov/sebin/v/i/carousel-arrow-right.png' class='slick-next' />",
            /*Starts on slide 4*/
            prevArrow: "<img src='//baltimorecountymd.gov/sebin/f/m/carousel-arrow-left.png 'class='slick-prev' />"
        });

	});
	
	$(document).on('click', '.hamburger-btn', function(e) {
        e.preventDefault();
        $('.primary-nav, .secondary-nav').toggleClass('mobile-menu-visible');
    });

    var sendGoogleEvent = function(desc, act) {
        act = act || 'click';
        ga('send', 'event', 'button', act, desc);
    };

    /*Event handling*/
    //Search Button
    $(document).on('click', '.search-button', function() {
        sendGoogleEvent('search-button');
    });
    //Search Result
    $(document).on('click', '.gsc-table-result div.gs-title a.gs-title', function() {
        sendGoogleEvent('search-result');
    });

})(jQuery, Flickr);