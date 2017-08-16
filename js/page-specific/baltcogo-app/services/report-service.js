(function reportServiceWrapper(app) {
	'use strict';

	app.factory('reportService', ['$http', 'CONSTANTS', reportService]);

	function reportService($http, CONSTANTS) {
		function post(data, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http.post(CONSTANTS.urls.createReport, data, postOptions)
				.then(
					function success(response) {
						successCallback(response.data);
					},
					function error(err) {
						errorCallback(err);
					}
				);
		}

		function getById(reportId, successCallback, errorCallback) {
			$http.get(CONSTANTS.urls.getReport + reportId)
				.then(
					function success(response) {
						successCallback(response.data);
					},
					function error(err) {
						errorCallback(err);
					}
				);
		}

		function getNearby(settings, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http.post(CONSTANTS.urls.getReportLatLng, settings, postOptions)
				.then(
					function success(response) {
						successCallback(response.data);
					},
					function error(err) {
						errorCallback(err);
					}
				);
		}

		return {
			post: post,
			getById: getById,
			getNearby: getNearby
		};
	}
}(angular.module('baltcogoApp')));
