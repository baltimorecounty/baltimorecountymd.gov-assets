(function(app) {
	'use strict';

	app.factory('mapServiceComposite', ['$http', mapServiceComposite]);

	function mapServiceComposite($http) {

		var apiKey = 'AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8',
			targetCounty = 'Baltimore County',
			marker,
			spatialReferenceId = 4269,
			geocodeServerUrlBCGIS = 'http://bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/AddressPoint_NAD83/GeocodeServer',
			originLongitude = -76.60652470000002, 
			originLatitude = 39.4003288,

			clearMarker = function () {
				if (marker)
					marker.setMap(null);
			},

			createAutoComplete = function (autocompleteElementId, settings) {
				return new google.maps.places.Autocomplete(document.getElementById(autocompleteElementId), settings);
			},

			createMap = function(mapElementId, settings) {
				return new google.maps.Map(document.getElementById(mapElementId), settings);
			},

			createMarker = function(map, latitude, longitude) {
				if (marker) {
					marker.setMap(null);
				}

				marker = new google.maps.Marker({
					position: { lat: latitude, lng: longitude},
					map: map,
					icon: '/sebin/n/f/icon-marker-my-report.png', 
					draggable: false,
					animation: google.maps.Animation.DROP
				});
			},

			reverseGeocode = function(latitude, longitude, successCallback, errorCallback) {				
				require([
					"esri/tasks/Locator",
					'esri/geometry/Point'				
				], function(Locator, Point) { 

					var point = new Point(longitude, latitude);

					var locatorSettings = {
						countryCode: 'US',
						outSpatialReference: spatialReferenceId,
						url: geocodeServerUrlBCGIS
					};

					var locator = new Locator(locatorSettings);

					var requestOptions = {
						responseType: 'json'
					};

					locator.locationToAddress(point).then(successCallback, errorCallback);
				});				
			},

			suggestAddresses = function(address, callback) {
				require(["esri/tasks/Locator", 'esri/geometry/Point'], 
					function(Locator, Point) { 

					var locatorSettings = {
						countryCode: 'US',
						outSpatialReference: spatialReferenceId,
						url: geocodeServerUrlBCGIS
					};

					var suggestParams = {
						location: new Point(originLongitude, originLatitude),
						text: address
					};

					var requestOptions = {
						responseType: 'json'
					};

					var locator = new Locator(locatorSettings);

					locator.suggestLocations(suggestParams, requestOptions).then(
						function(suggestedAddresses) {
							var results = [];
							angular.forEach(suggestedAddresses, function(suggestedAddress) {
								results.push(suggestedAddress.text.toLowerCase());
							});
							callback(results);
						}, 
						function(err) { console.log('err', err); }
					);
				});

			},


			addressLookup = function(addressQuery, successCallback, errorCallback) {			
			
				require(["esri/tasks/Locator"], 
					function(Locator) { 

					var locatorSettings = {
						countryCode: 'US',
						outSpatialReference: spatialReferenceId,
						url: geocodeServerUrlBCGIS
					};

					var addressToLocationsParams = {
						address: { 'Single Line Input': addressQuery },
						f: 'json'
					};

					var requestOptions = {
						responseType: 'json'
					};

					var locator = new Locator(locatorSettings);

					locator.addressToLocations(addressToLocationsParams, requestOptions).then(
						function(foundAddresses) {
							if (foundAddresses.length) {
								var sortedFoundAddresses = foundAddresses.sort(addressScoreComparer);						
								successCallback(sortedFoundAddresses[0]);
							} else {
								errorCallback('No location was found for this address.');
							}
						}, errorCallback);
				});
			},

			pan = function(map, latitude, longitude) {
				map.panTo({
					lat: latitude,
					lng: longitude
				});
			},

			addressScoreComparer = function(a, b) {
				if (a.score < b.score)
					return 1;

				if (a.score > b.score)
					return -1;
				
				return 0;
			};



		/*** Private Functions **********/

		function checkCounty(reverseGeocodeData) {
			var countyArr = $.grep(reverseGeocodeData, filterCountyResults),
				county = '';

			if (countyArr && countyArr.length)
				county = countyArr[0].formatted_address;

			return county.indexOf(targetCounty) !== -1 ? county : false;
		}

		function filterCountyResults(item, index) {
			return filterResults(item, index, 'administrative_area_level_2');
		}

		function filterResults(item, index, query) {
			var matchArr;
			if (item.types) {
				matchArr = $.grep(item.types, function (item, index) {
					return item === query;
				});
			}
			return matchArr.length ? matchArr : false;
		}

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
	};

})(angular.module('baltcogoApp'));