namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.reporterGoogleMaps = (function (googleMaps, undefined) {

	var marker,
		autocomplete,
		apiKey = 'AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8',
		targetCounty = 'Baltimore County',

		/**
		 * Creates the map, and renders it in the mapElementId element.
		 */
		createMap = function (mapElementId, settings) {
			window.map = new google.maps.Map(document.getElementById(mapElementId), settings);
		},

		/**
		 * Creates the autocomplete, and attaches it to the autocompleteElementId element.
		 */
		createAutoComplete = function (autocompleteElementId, settings) {
			autocomplete = new google.maps.places.Autocomplete(document.getElementById(autocompleteElementId), settings);
		},

		/**
		 * Adds a marker to the map.
		 */
		createMarker = function (latitude, longitude) {
			marker = new google.maps.Marker({
				map: window.map,
				position: {
					lat: latitude,
					lng: longitude
				},
				animation: google.maps.Animation.DROP
			});
		},

		/**
		 * Clears a marker from the map.
		 */
		clearMarker = function () {
			if (marker)
				marker.setMap(null);
		},

		/**
		 * Handler for the map's 'click' event. Drops a pin on the map wherever you click, 
		 * and and tracks the latitude and longitude of the pin. Makes sure only one pin 
		 * can exist at a time.
		 */
		mapClickHandler = function (event) {
			var latitude = event.latLng.lat(),
				longitude = event.latLng.lng();
			placeMarker(latitude, longitude, true);
		},

		/**
		 * Puts a market on the map.
		 */
		placeMarker = function(latitude, longitude, shouldUpdateTextbox, callback) {
			clearMarker();

			var isCounty = reverseGeocode(latitude, longitude, shouldUpdateTextbox, function(isCounty) {
				if (isCounty) {
					createMarker(latitude, longitude);
					trackLatLng(latitude, longitude);
				}

				if(callback)
					callback(isCounty);
			});
		},

		/**
		 * Handler for the autocomplete's 'place_changed' event. When the autocomplete populates 
		 * with a selected address, this will center the map on that location and drop a pin.
		 */
		autocompletePlaceChangedHandler = function () {
			$('#address').val(removeCountry($('#address').val()));
			
			var place = autocomplete.getPlace();

			if (place.geometry) {
				latitude = place.geometry.location.lat(),
				longitude = place.geometry.location.lng();

				centerMapOnLatLng(latitude, longitude);
			}
		},

		/**
		 * Centers the map on the given latitude and longitude, them places a marker.
		 */
		centerMapOnLatLng = function(latitude, longitude) {
			placeMarker(latitude, longitude, false, function(isCounty) {
				if (isCounty) {
					var center = new google.maps.LatLng(latitude, longitude);

					window.map.panTo(center);
					window.map.setZoom(16);

					google.maps.event.trigger(window.map, 'resize');
					map.setCenter(center);
				}
			});
		},

		/**
		 * Searches for the address when enter is pressed.
		 */
		addressKeyupHandler = function(event) {
			var keyCode = event.which || event.keyCode;

			if (keyCode === 13) {
				var $target = $('#address');

				searchForAddress($target, $target.val());
			}
		},

		/**
		 * Handler for the address search button's click event. Forces a Places search
		 * and updates the map.
		 */
		addressSearchButtonClickHandler = function (event) {
			var $target = $('#address');

			searchForAddress($target, $target.val());
		},

		/**
		 * Performs the address search.
		 */
		searchForAddress = function($addressBox, addressQuery) {
			$.ajax('https://maps.googleapis.com/maps/api/geocode/json?address=' + addressQuery + '&key=' + apiKey)
				.done(function (data) {
					if (data.results.length) {
						var latitude = data.results[0].geometry.location.lat;
						var longitude = data.results[0].geometry.location.lng;
						centerMapOnLatLng(latitude, longitude);

						$addressBox.parent().removeClass('error');
						$addressBox.val(data.results[0].formatted_address);
					} else {
						$addressBox.parent().addClass('error');
						$addressBox.val('');
					}
				}).fail(function (error) {
					console.log('error!', error);
				});		
		},

		/**
		 * Looks up the street address from the latitude and longitude.
		 */
		reverseGeocode = function (latitude, longitude, shouldUpdateTextboxn, callback) {
			var $target = $('#address');

			$.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey).done(function (data) {
				var address = getAddress(data.results);

				if (address) {
					$target.parent().removeClass('error');
					$target.val(removeCountry(address));
				} else {
					$target.parent().addClass('error');
					$target.val('');
				}

				callback(!!address);
			});
		},

		/**
		 * Returns the friendly address string from the reverse geocoding.
		 */
		getAddress = function (reverseGeocodeData) {
			var streetAddressArr = $.grep(reverseGeocodeData, filterStreetAddressResults),
				countyArr = $.grep(reverseGeocodeData, filterCountyResults);
			return isBaltimoreCounty(countyArr) ? reverseGeocodeData[0].formatted_address : false;
		},

		isBaltimoreCounty = function (countyArr) {
			var county = '';
			if (countyArr && countyArr.length)
				county = countyArr[0].formatted_address;
			return county.indexOf(targetCounty) !== -1;
		},

		filterCountyResults = function (item, index) {
			return filterResults(item, index, 'administrative_area_level_2');
		},

		filterResults = function (item, index, query) {
			var matchArr;
			if (item.types) {
				matchArr = $.grep(item.types, function (item, index) {
					return item === query;
				});
			}
			return matchArr.length ? matchArr : false;
		},

		/**
		 * Updates the hidden fields with the values of the latitude and longitude from 
		 * a dropped pin or an address search.
		 */
		trackLatLng = function (latitude, longitude) {
			document.getElementById('map-latitude').value = latitude;
			document.getElementById('map-longitude').value = longitude;
		},

		/**
		 * Remove "USA", since this is only for USA addresses.
		 */
		removeCountry = function(addressString) {
			return addressString.replace(', USA', '');
		},

		/**
		 * Create the map and autocomplete, and attach up the click and place_changed handler.
		 */
		initGoogle = function () {
			var mapSettings = {
					center: {
						lat: 39.4003288,
						lng: -76.60652470000002
					},
					scrollwheel: false,
					zoom: 14,
					mapTypeId: 'roadmap',
					mapTypeControl: false,
					streetViewControl: false
				},
				autocompleteSettings = {
					types: ['geocode']
				};

			createMap('map', mapSettings);
			createAutoComplete('address', autocompleteSettings);
			google.maps.event.addListener(map, 'click', mapClickHandler);
			autocomplete.addListener('place_changed', autocompletePlaceChangedHandler);
			document.getElementById('addressSearch').addEventListener('click', addressSearchButtonClickHandler);
			document.getElementById('address').addEventListener('keyup', addressKeyupHandler);
		};

	return {
		initGoogle: initGoogle
	};

})();