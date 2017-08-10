require(['esri/tasks/Locator', 'esri/geometry/Point'], function esri(EsriLocator, EsriPoint) {
	(function mapServiceCompositeWrapper(app) {
		function mapServiceComposite($http) {
			var marker;
			var spatialReferenceId = 4269;
			var geocodeServerUrlBCGIS = 'http://bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/CompositeGeocode_CS/GeocodeServer';
			var originLongitude = -76.60652470000002;
			var originLatitude = 39.4003288;

			var clearMarker = function clearMarker() {
				if (marker) {
					marker.setMap(null);
				}
			};

			var createAutoComplete = function createAutoComplete(autocompleteElementId, settings) {
				return new google.maps.places.Autocomplete(document.getElementById(autocompleteElementId), settings);
			};

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

			var reverseGeocode = function reverseGeocode(latitude, longitude, successCallback, errorCallback) {
				var point = new EsriPoint(longitude, latitude);

				var locatorSettings = {
					countryCode: 'US',
					outSpatialReference: spatialReferenceId,
					url: geocodeServerUrlBCGIS
				};

				var esriLocator = new EsriLocator(locatorSettings);

				esriLocator.locationToAddress(point).then(successCallback, errorCallback);
			};

			var suggestAddresses = function suggestAddresses(address, callback) {
				var locatorSettings = {
					countryCode: 'US',
					outSpatialReference: spatialReferenceId,
					url: geocodeServerUrlBCGIS
				};

				var suggestParams = {
					location: new EsriPoint(originLongitude, originLatitude),
					text: address
				};

				var requestOptions = {
					responseType: 'json'
				};

				var esriLocator = new EsriLocator(locatorSettings);

				esriLocator.suggestLocations(suggestParams, requestOptions).then(
					function processSuggestedAddresses(suggestedAddresses) {
						var results = [];
						angular.forEach(suggestedAddresses, function foreachSuggestedAddresses(suggestedAddress) {
							results.push(suggestedAddress.text.toLowerCase());
						});
						callback(results);
					},
					function error(err) {
						console.log('err', err);
					}
				);
			};

			var addressScoreComparer = function addressScoreComparer(a, b) {
				if (a.score < b.score) { return 1; }

				if (a.score > b.score) { return -1; }

				return 0;
			};

			var addressLookup = function addressLookup(addressQuery, successCallback, errorCallback) {
				var locatorSettings = {
					countryCode: 'US',
					outSpatialReference: spatialReferenceId,
					url: geocodeServerUrlBCGIS
				};

				var addressToLocationsParams = {
					address: { SingleLine: addressQuery },
					f: 'json'
				};

				var requestOptions = {
					responseType: 'json'
				};

				var esriLocator = new EsriLocator(locatorSettings);

				esriLocator.addressToLocations(addressToLocationsParams, requestOptions).then(
					function processFoundAddresses(foundAddresses) {
						if (foundAddresses.length) {
							var sortedFoundAddresses = foundAddresses.sort(addressScoreComparer);
							successCallback(sortedFoundAddresses[0]);
						} else {
							errorCallback('No location was found for this address.');
						}
					}, errorCallback);
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
				addressLookup: addressLookup,
				createAutoComplete: createAutoComplete,
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
});
