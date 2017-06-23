(function(app, querystringer) {
	'use strict';

	app.controller('BaltCoGoViewerCtrl', ['$http', '$scope', '$timeout', 'mapService', 'reportService', viewerController]);

	function viewerController($http, $scope, $timeout, mapService, reportService) {

		var self = this;
		var reportId = querystringer.getAsDictionary().reportId;
		var longitude;
		var latitude;
		var mapView;

		self.isError = false;
		self.isLoading = true;
		self.isMapLoading = true;
	
		if (!reportId) {
			return;
		}

		getReport(reportId, getReportSuccess, getReportError);		

		function getReportSuccess(data) {
			self.status = data.Status;
			self.isOpen = data.IsOpen === 'On Hold' ? 'on-hold' : data.IsOpen ? 'open' : 'closed';
			self.id = data.Id;
			self.issueType = data.IssueType;
			self.dateCreated = data.DateCreated;
			self.dateUpdated = data.DateUpdated;
			self.description = data.Description;
			self.comments = data.comments;		
			longitude = data.Longitude;
			latitude = data.Latitude;

			mapService.reverseGeocode(longitude, latitude, reverseGeocodeSuccess, function(err) {
				console.log(err);
			});	

			//mapService.createMap('map', mapCreationSuccess);

			window.map = new google.maps.Map(document.getElementById('map'), settings)
		}

		function mapCreationSuccess(view, Point, Graphic, pictureMarkerSymbol) {
			mapView = view;			
			self.isMapLoading = false;
			$scope.$apply();

			$timeout(function() {
				var startDate = new Date();
				startDate.setDate(-90);

				var nearbyDataSettings = {
					Latitude: latitude,
					Longitude: longitude,
					StartDate: startDate.toLocaleDateString('en-US')
				};

				reportService.getNearby(nearbyDataSettings, getNearbySuccess, function(err) {
					console.log(err);
				});
			}, 500);
		}

		function getNearbySuccess(nearbyReportData) {
			angular.forEach(nearbyReportData, function(nearbyReport) {
				mapService.dropMarker(mapView, nearbyReport.Longitude, nearbyReport.Latitude, false, true);
			});

			mapService.dropMarker(mapView, longitude, latitude, false, false);
		}

		function reverseGeocodeSuccess(responseData) {
			self.address = responseData.address.Street + ', ' + responseData.address.City + ', ' + responseData.address.State;
			self.isLoading = false;
			$scope.$apply();
		}

		function getReportError(err) {
			self.isError = true;
			$scope.$apply();
			console.log(err);
		}

		function getReport(reportId, successCallback) {
			reportService.getById(reportId, successCallback, function(err) {
				console.log(err);
			});
		}

		function getNearbyReports(settings, successCallback, errorCallback) {
			reportService.getNearby(settings, successCallback, errorCallback);
		}

	}

})(angular.module('baltcogoApp'), baltimoreCounty.utility.querystringer);