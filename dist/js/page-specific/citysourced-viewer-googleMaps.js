namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.viewerGoogleMaps = (function (googleMaps, undefined) {

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
		 * Puts a market on the map.
		 */
		placeMarker = function(latitude, longitude, shouldUpdateTextbox, callback) {
			clearMarker();			
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
		 * Create the map and autocomplete, and attach up the click and place_changed handler.
		 */
		initGoogle = function () {
			var data = window.citySourcedData;
			var mapSettings = {
					center: {
						lat: data && data.Latitude ? data.Latitude : 39.4003288,
						lng: data && data.Longitude ? data.Longitude : -76.60652470000002
					},
					scrollwheel: false,
					zoom: 17,
					mapTypeId: 'roadmap',
					mapTypeControl: false,
					streetViewControl: false
				},
				autocompleteSettings = {
					types: ['geocode']
				};

			createMap('map', mapSettings);
			createMarker(mapSettings.center.lat, mapSettings.center.lng);
		};

	return {
		initGoogle: initGoogle,
		centerMapOnLatLng: centerMapOnLatLng
	};

})();