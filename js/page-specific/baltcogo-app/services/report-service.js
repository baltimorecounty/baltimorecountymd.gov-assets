(function reportServiceWrapper(app) {
	'use strict';

	function reportService($http) {
		function post(data, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http.post('//testservices.baltimorecountymd.gov/api/baltcogo/createreport', data, postOptions)
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
			$http.get('//testservices.baltimorecountymd.gov/api/citysourced/getreport/' + reportId)
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

			$http.post('//testservices.baltimorecountymd.gov/api/citysourced/getreportsbylatlng', settings, postOptions)
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

	app.factory('reportService', ['$http', reportService]);

}(angular.module('baltcogoApp')));
