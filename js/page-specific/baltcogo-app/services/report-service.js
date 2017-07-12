(function(app) {
	'use strict';

	app.factory('reportService', ['$http', reportService]);

	function reportService($http) {

		function post(data, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http.post("//testservices.baltimorecountymd.gov/api/baltcogo/createreport", data, postOptions)
				.then(
					function (response) {
						successCallback(response.data);
					},
					function (error) {
						errorCallback(error);
					}
				);
		}

		function getById(reportId, successCallback, errorCallback) {
			$http.get('//testservices.baltimorecountymd.gov/api/citysourced/getreport/' + reportId)
				.then(
					function(response) {
						successCallback(response.data);					
					}, 
					function (error) {
						errorCallback(error);
					}
				);
		};

		function getNearby(settings, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};		

			$http.post("//testservices.baltimorecountymd.gov/api/citysourced/getreportsbylatlng", settings, postOptions)
				.then(
					function (response) {
						successCallback(response.data);
					},
					function (error) {
						errorCallback(error);
					}
				);
		}


		return {
			post: post,
			getById: getById,
			getNearby: getNearby
		};
	}

})(angular.module('baltcogoApp'));