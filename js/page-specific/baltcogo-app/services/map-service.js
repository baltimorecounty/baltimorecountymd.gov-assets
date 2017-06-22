(function(app) {
	'use strict';

	app.factory('mapService', ['$http', mapService]);

	function mapService($http) {
		var pictureMarkerSymbol;
		var nearbyPictureMarkerSymbol;
		var spatialReferenceId = 4269;
		var originLongitude = -76.6063945;
		var originLatitude = 39.4001857;
		var geocodeServerUrlArcGIS = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';
		var geocodeServerUrlBCGIS = 'http://bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/AddressPoint_NAD83/GeocodeServer';

		var createMap = function(mapElementId, creationCallback) {

			require([
				'esri/Map',
				'esri/views/MapView',
				'esri/symbols/PictureMarkerSymbol',
				'esri/Graphic',
				'esri/geometry/Point',
				'dojo/domReady!'
			], function (Map, MapView, PictureMarkerSymbol, Graphic, Point) {

				pictureMarkerSymbol = new PictureMarkerSymbol({
					url: 'http://dev.baltimorecountymd.gov/sebin/n/f/icon-marker-my-report.png', 
					height: 60, 
					width: 35
				});

				nearbyPictureMarkerSymbol = new PictureMarkerSymbol({
					url: 'http://dev.baltimorecountymd.gov/sebin/n/p/icon-marker-other.png', 
					height: 55, 
					width: 35
				});

				var mapSettings = {
					basemap: "topo-vector"
				};
				var map = new Map(mapSettings);

				var mapViewSettings = {
					container: mapElementId,
					map: map,
					zoom: 13,
					center: [originLongitude, originLatitude]
				};
				var view = new MapView(mapViewSettings);

				creationCallback(view, Point, Graphic);
			});
		};

		var suggestAddresses = function(address, callback) {

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
							results.push(suggestedAddress.text);
						});
						callback(results);
					}, 
					function(err) { console.log('err', err); }
				);
			});

		};

		var lookupAddress = function(address, callback) {
			require(["esri/tasks/Locator"], 
				function(Locator) { 

				var locatorSettings = {
					countryCode: 'US',
					outSpatialReference: spatialReferenceId,
					url: geocodeServerUrlBCGIS
				};

				var addressToLocationsParams = {
					address: { 'Single Line Input': address },
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
							callback(sortedFoundAddresses[0]);
						}
					}, 
					function(err) { console.log('err', err); }
				);
			});
		};

		var reverseGeocode = function(longitude, latitude, successCallback, errorCallback) {
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
		};

		var dropMarker = function(view, longitude, latitude, clearMarkers, isNearbyReport) {
			require([
				'esri/Graphic',
				'esri/geometry/Point',
				'dojo/domReady!'
			], function (Graphic, Point) {
				var point = new Point(longitude, latitude);
				var marker = new Graphic(point, isNearbyReport ? nearbyPictureMarkerSymbol : pictureMarkerSymbol);
				
				view.goTo(point, { animate: true, duration: 250 });
				
				if (clearMarkers)
					view.graphics.removeAll();
				
				view.graphics.add(marker);
			});
		}

		var addressScoreComparer = function(a, b) {
			if (a.score < b.score)
				return 1;

			if (a.score > b.score)
				return -1;
			
			return 0;
		}

		/*** Private Functions **********/

		return {
			createMap: createMap,
			dropMarker: dropMarker,
			lookupAddress: lookupAddress,
			reverseGeocode: reverseGeocode,
			suggestAddresses: suggestAddresses
		};
	}

})(angular.module('baltcogoApp'));