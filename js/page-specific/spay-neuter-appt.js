(function($) {
	var locations = {
		baldwin: {
			href: "http://clinichq.org/Online/1238/Appointment/Create",
			address: "13800 Manor Rd Baldwin, MD 21013"
		},
		dundalk: {
			href: "http://clinichq.org/Online/1239/Appointment/Create",
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

