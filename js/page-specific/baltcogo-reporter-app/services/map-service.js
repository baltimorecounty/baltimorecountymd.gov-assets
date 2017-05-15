(function(app) {
	'use strict';

	app.factory('mapService', ['$http', mapService]);

	function mapService($http) {

		var apiKey = 'AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8',
			targetCounty = 'Baltimore County',
			marker,

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
					draggable: false,
					animation: google.maps.Animation.DROP
				});
			},

			reverseGeocode = function(latitude, longitude, callback) {
				var $target = angular.element('#address');

				$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey).then(function (response) {

					var address = getAddress(response.data.results);

					if (address) {
						$target.parent().removeClass('error');
						callback(removeCountry(address));
					} else {
						$target.parent().addClass('error');
						clearMarker();
						callback('');
					}
				});
			},

			addressLookup = function(addressQuery, callback) {
				$http.get('https://maps.googleapis.com/maps/api/geocode/json?bounds=39.4579705,-76.8882835|39.7264469,-76.3322764&region=US&address=' + addressQuery + '&key=' + apiKey)
					.then(function (response) {
						if (response.data.results.length) {
							var latitude = response.data.results[0].geometry.location.lat;
							var longitude = response.data.results[0].geometry.location.lng;
														
							callback(response.data.results[0].formatted_address, latitude, longitude);
						} else {
							callback('');
						}
					}, function (error) {
						console.log('error!', error);
					});		
			
			};


		/*** Private Functions **********/

		function getAddress(reverseGeocodeData) {
			var countyArr = $.grep(reverseGeocodeData, filterCountyResults);
			return isBaltimoreCounty(countyArr) ? reverseGeocodeData[0].formatted_address : false;
		}

		 function isBaltimoreCounty(countyArr) {
			var county = '';
			if (countyArr && countyArr.length)
				county = countyArr[0].formatted_address;
			return county.indexOf(targetCounty) !== -1;
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
			createMarker: createMarker,
			reverseGeocode: reverseGeocode,
			addressLookup: addressLookup,
			createMap: createMap,
			createAutoComplete: createAutoComplete,
			removeCountry: removeCountry
		};
	};

})(angular.module('baltcogoApp'));