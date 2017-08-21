namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.viewerGoogleMaps = (function viewerGoogleMaps() {
	var marker;
	var spatialReferenceId = 4269;
	var geocodeServerUrlBCGIS = '//bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/AddressPoint_NAD83/GeocodeServer';

	/**
	 * Creates the map, and renders it in the mapElementId element.
	 */
	var createMap = function createMap(mapElementId, settings) {
		window.map = new google.maps.Map(document.getElementById(mapElementId), settings);
	};

	/**
	 * Adds a marker to the map.
	 */
	var createMarker = function createMarker(settings) {
		var markerSettings = {
			map: window.map,
			position: {
				lat: settings.Latitude * 1,
				lng: settings.Longitude * 1
			},
			animation: google.maps.Animation.DROP
		};

		if (settings.ImageUrl) {
			markerSettings.icon = settings.ImageUrl;
		}

		if (settings.ZIndex) {
			markerSettings.zIndex = settings.ZIndex;
			markerSettings.optimized = false;
		}

		marker = new google.maps.Marker(markerSettings);

		if (settings.InfoWindowHtml) {
			marker.html = settings.InfoWindowHtml;
		}

		return marker;
	};

	/**
	 * Looks up the street address from the latitude and longitude.
	 */
	var reverseGeocode = function reverseGeocode(latitude, longitude, successCallback) {
		// eslint-disable-next-line global-require
		require([
			'esri/tasks/Locator',
			'esri/geometry/Point'
		], function locationToAddress(Locator, Point) {
			var point = new Point(longitude, latitude);

			var locatorSettings = {
				countryCode: 'US',
				outSpatialReference: spatialReferenceId,
				url: geocodeServerUrlBCGIS
			};

			var locator = new Locator(locatorSettings);

			locator.locationToAddress(point).then(successCallback, function error(err) {
				console.log(err);
			});
		});
	};

	/**
	 * Created the info window for when you click on a map marker.
	 */
	var getInfoWindowHtml = function getInfoWindowHtml(dataItem) {
		var html = '<div class="maps-info-window">' +
			'<h4><a href="/CitySourced/preview/viewer?reportId=' + dataItem.Id + '">' + dataItem.IssueType + '</a></h4>' +
			'<ul>' +
			'<li>Status: ' + dataItem.StatusType + '</li>' +
			'<li>Reported on ' + dataItem.DateCreated + '</li>' +
			'</ul>' +
			'</div>';
		return html;
	};

	/**
	 * Create the map and autocomplete, and attach up the click and place_changed handler.
	 */
	var initGoogle = function initGoogle() {
		var data = baltimoreCounty.pageSpecific.citySourcedData;
		var nearbyData = baltimoreCounty.pageSpecific.nearbyData;
		var markers = [];
		var mapSettings = {
			center: {
				lat: data.Latitude,
				lng: data.Longitude
			},
			scrollwheel: false,
			zoom: 14,
			mapTypeId: 'roadmap',
			mapTypeControl: false,
			streetViewControl: false
		};
		var infoWindow = new google.maps.InfoWindow({
			content: 'holding...'
		});

		createMap('map', mapSettings);

		var homeMarkerSettings = {
			Latitude: mapSettings.center.lat,
			Longitude: mapSettings.center.lng,
			ImageUrl: '/sebin/n/f/icon-marker-my-report.png',
			ZIndex: 7999
		};

		createMarker(homeMarkerSettings);

		reverseGeocode(
			mapSettings.center.lat, mapSettings.center.lng,
			function getAddressFromLatLng(response) {
				$('#address').text(
					response.address.Street.toLowerCase() + ', ' +
					response.address.City.toLowerCase() + ', ' +
					response.address.State.toLowerCase());
			});

		if (nearbyData) {
			for (var i = 0; i < nearbyData.length; i += 1) {
				if (nearbyData[i].Latitude !== data.Latitude
					&& nearbyData[i].Longitude !== data.Longitude) {
					var markerSettings = {
						Latitude: nearbyData[i].Latitude,
						Longitude: nearbyData[i].Longitude,
						ImageUrl: '/sebin/n/p/icon-marker-other.png',
						InfoWindowHtml: getInfoWindowHtml(nearbyData[i])
					};

					markers[i] = createMarker(markerSettings);

					// eslint-disable-next-line no-loop-func
					google.maps.event.addListener(markers[i], 'click', function mapsListener() {
						infoWindow.setContent(this.html);
						infoWindow.open(window.map, this);
					});
				}
			}
		}
	};

	return {
		initGoogle: initGoogle
	};
}());
