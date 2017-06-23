namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.viewerGoogleMaps = (function (googleMaps, undefined) {

	var marker,
		autocomplete,
		apiKey = 'AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8',
		targetCounty = 'Baltimore County',
		spatialReferenceId = 4269,
		geocodeServerUrlBCGIS = 'http://bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/AddressPoint_NAD83/GeocodeServer',

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
		createMarker = function (settings) { //(latitude, longitude, imageUrl, zIndex, infoWindowHtml) {
			var markerSettings = {
					map: window.map,
					position: {
						lat: settings.Latitude * 1,
						lng: settings.Longitude * 1
					},
					animation: google.maps.Animation.DROP
				};

			if (settings.ImageUrl) 
				markerSettings.icon = settings.ImageUrl;
			
			if (settings.ZIndex) {
				markerSettings.zIndex = settings.ZIndex;
				markerSettings.optimized = false;
			}
			
			marker = new google.maps.Marker(markerSettings);

			if(settings.InfoWindowHtml)
				marker.html = settings.InfoWindowHtml;
			
			return marker;
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
					window.map.setZoom(14);

					google.maps.event.trigger(window.map, 'resize');
					map.setCenter(center);
				}
			});
		},		

		/**
		 * Looks up the street address from the latitude and longitude.
		 */
		reverseGeocode = function (latitude, longitude, successCallback) {
			/*$.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey)
				.done(function (data) {
					var address = getAddress(data.results).replace(', USA', '');
					callback(address);
				});*/

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

				locator.locationToAddress(point).then(successCallback, function(err) {
					console.log(err);
				});
			});

		},

		/**
		 * Returns the friendly address string from the reverse geocoding.
		 */
		getAddress = function (reverseGeocodeData) {
			var streetAddressArr = $.grep(reverseGeocodeData, filterStreetAddressResults),
				countyArr = $.grep(reverseGeocodeData, filterCountyResults);
			return isBaltimoreCounty(countyArr) ? streetAddressArr && streetAddressArr.length ? streetAddressArr[0].formatted_address : false : false;
		},

		isBaltimoreCounty = function (countyArr) {
			var county = '';
			if (countyArr && countyArr.length)
				county = countyArr[0].formatted_address;
			return county.indexOf(targetCounty) !== -1;
		},

		filterStreetAddressResults = function (item, index) {
			return filterResults(item, index, 'street_address');
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
		 * Remove "USA", since this is only for USA addresses.
		 */
		removeCountry = function(addressString) {
			return addressString.replace(', USA', '');
		},

		/**
		 * Created the info window for when you click on a map marker.
		 */
		getInfoWindowHtml = function(dataItem) {
			var html = '<div class="maps-info-window">'
					+ '<h4><a href="/CitySourced/preview/viewer?reportId=' + dataItem.Id + '">' + dataItem.IssueType + '</a></h4>'
					+ '<ul>'
					+ '<li>Status: ' + dataItem.StatusType + '</li>'
					+ '<li>Reported on ' + dataItem.DateCreated + '</li>'
					+ '</ul>'
					+ '</div>';
			return html;
		},

		/**
		 * Create the map and autocomplete, and attach up the click and place_changed handler.
		 */
		initGoogle = function () {
			var data = baltimoreCounty.pageSpecific.citySourcedData,
				nearbyData = baltimoreCounty.pageSpecific.nearbyData,
				markers = [],
				mapSettings = {
					center: {
						lat: data.Latitude,
						lng: data.Longitude
					},
					scrollwheel: false,
					zoom: 14,
					mapTypeId: 'roadmap',
					mapTypeControl: false,
					streetViewControl: false
				},
				autocompleteSettings = {
					types: ['geocode']
				},
				infoWindow = new google.maps.InfoWindow({
					content: "holding..."
				});

			createMap('map', mapSettings);

			var homeMarkerSettings = {
				Latitude: mapSettings.center.lat, 
				Longitude: mapSettings.center.lng, 
				ImageUrl: '/sebin/n/f/icon-marker-my-report.png', 
				ZIndex: 7999
			};

			createMarker(homeMarkerSettings);
			
			reverseGeocode(mapSettings.center.lat, mapSettings.center.lng, function(response) {
				$('#address').text(response.address.Street + ', ' + response.address.City + ', ' + response.address.State);
			});			

			if (nearbyData) {
				for (var i = 0; i < nearbyData.length; i++) {
					if (nearbyData[i].Latitude != data.Latitude && nearbyData[i].Longitude != data.Longitude) {
						var markerSettings = {
							Latitude: nearbyData[i].Latitude, 
							Longitude: nearbyData[i].Longitude, 
							ImageUrl: '/sebin/n/p/icon-marker-other.png', 
							InfoWindowHtml: getInfoWindowHtml(nearbyData[i])
						};

						markers[i] = createMarker(markerSettings);					

						google.maps.event.addListener(markers[i], 'click', function() {
							infoWindow.setContent(this.html);
							infoWindow.open(map, this);
						});
					}
				}
			}
		};

	return {
		initGoogle: initGoogle,
		centerMapOnLatLng: centerMapOnLatLng
	};

})();