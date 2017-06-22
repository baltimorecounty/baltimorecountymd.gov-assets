(function(app, querystringer) {
	'use strict';

	app.controller('BaltCoGoViewerCtrl', ['$http', '$scope', '$timeout', 'mapService', 'reportService', viewerController]);

	function viewerController($http, $scope, $timeout, mapService, reportService) {

		var self = this;
		var reportId = querystringer.getAsDictionary().reportId;

		self.isError = false;

		if (!reportId) {
			return;
		}

		getReport(reportId, getReportSuccess, getReportError);

		function getReportSuccess(data) {
			self.status = data.Status;
			self.id = data.Id;
			self.issueType = data.IssueType;
			self.dateCreated = data.DateCreated;
			self.dateUpdated = data.DateUpdated;
			self.description = data.Description;
			self.comments = data.comments;		

			mapService.reverseGeocode(data.Longitude, data.Latitude, reverseGeocodeSuccess, function(err) {
				console.log(err);
			});	
		}

		function reverseGeocodeSuccess(responseData) {
			self.address = responseData.address.Street + ', ' + responseData.address.City + ', ' + responseData.address.State;
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