/* eslint global-require: 0 */

(function mapServiceCompositeWrapper(app) {
	app.factory('mapServiceComposite', ['$http', 'CONSTANTS', mapServiceComposite]);

	function mapServiceComposite($http, CONSTANTS) {
		var marker;
		var spatialReferenceId = 4269;

		var createMap = function createMap(mapElementId, settings) {
			return new google.maps.Map(document.getElementById(mapElementId), settings);
		};

		var createMarker = function createMarker(map, latitude, longitude) {
			if (marker) {
				marker.setMap(null);
			}

			marker = new google.maps.Marker({
				position: { lat: latitude, lng: longitude },
				map: map,
				icon: '/sebin/n/f/icon-marker-my-report.png',
				draggable: false,
				animation: google.maps.Animation.DROP
			});
		};

		var reverseGeocode = function reverseGeocode(latitude, longitude, onSuccess, onError) {
			$http.get(CONSTANTS.urls.geocodeServer + '/reverseGeocode?location=%7B%22x%22%3A' + longitude + '%2C+%22y%22%3A' + latitude + '%7D&f=pjson')
				.then(onSuccess, onError);
		};

		var suggestAddresses = function suggestAddresses(enteredAddress, callback) {
			var encodedAddress = encodeURIComponent(enteredAddress);

			$http.get(CONSTANTS.urls.suggestions + encodedAddress).then(
				function success(addressData) {
					var results = [];

					angular.forEach(addressData.data, function forEachAddress(address) {
						results.push({
							address: address.StreetAddress + ', ' + address.City + ', ' + address.Zip,
							longitude: address.Longitude,
							latitude: address.Latitude
						});
					});

					callback(results);
				},
				function error(err) {
					console.log(err);
				}
			);
		};

		var pan = function pan(map, latitude, longitude) {
			map.panTo({
				lat: latitude,
				lng: longitude
			});
		};

		/** Private Functions ********* */

		function removeCountry(addressString) {
			return addressString.replace(', USA', '');
		}

		return {
			createMap: createMap,
			createMarker: createMarker,
			pan: pan,
			removeCountry: removeCountry,
			reverseGeocode: reverseGeocode,
			suggestAddresses: suggestAddresses
		};
	}
}(angular.module('baltcogoApp')));

