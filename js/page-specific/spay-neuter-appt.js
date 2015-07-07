/*
Used on this page
http://www.baltimorecountymd.gov/Agencies/health/animalservices/spayneuter.html
*/
(function($) {
	var locations = {
		baldwin: {
			href: "https://clinichq.org/online/564cf872-6f61-476f-8ecd-61d574a8a06f",
			address: "13800 Manor Rd Baldwin, MD 21013"
		},
		dundalk: {
			href: "https://clinichq.org/online/144afb8f-6c15-4f15-8e16-9417a4f85823",
			address: "7702 Dunmanway Dundalk, MD 21222"
		}
	};

	var getLocation = function(location) {
	  return location = location ? location.toLowerCase() : null;
	};

	//Set the data attribute of the submit button based on the location selected
	$(document).on('click', '.location-form input', function(e) {
	  var $this = $(this),
	      location = getLocation($this.val());
	  $('#submit').data("location", "").data("location", location);
	});

	//Handle the submit 
	$(document).on('click', '#submit', function(e) {
	  e.preventDefault();
	  var $this = $(this),
	      location = getLocation($this.data('location')),
	      href = (locations[location] && locations[location].href) || alert('Please select a location.');
	  
	  if(location) {
	  	window.location.href = href;
	  }
	});
})(jQuery);

