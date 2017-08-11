/* eslint global-require: 0 */

(function mapServiceCompositeWrapper(app) {
	function mapServiceComposite($http) {
		var marker;
		var spatialReferenceId = 4269;
		var geocodeServerUrlBCGIS = 'http://bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/CompositeGeocode_CS/GeocodeServer';

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
			require(['esri/tasks/Locator', 'esri/geometry/Point'], function esri(EsriLocator, EsriPoint) {
				var point = new EsriPoint(longitude, latitude);

				var locatorSettings = {
					countryCode: 'US',
					outSpatialReference: spatialReferenceId,
					url: geocodeServerUrlBCGIS
				};

				var esriLocator = new EsriLocator(locatorSettings);

				esriLocator.locationToAddress(point).then(onSuccess, onError);
			});
		};

		var suggestAddresses = function suggestAddresses(enteredAddress, callback) {
			var encodedAddress = encodeURIComponent(enteredAddress);

			$http.get('http://ba224964:1000/api/gis/addressLookup/' + encodedAddress).then(
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

	app.factory('mapServiceComposite', ['$http', mapServiceComposite]);
}(angular.module('baltcogoApp')));

