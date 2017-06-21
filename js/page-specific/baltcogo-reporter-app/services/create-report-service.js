(function(app) {
	'use strict';

	app.factory('createReportService', ['$http', createReportService]);

	function createReportService($http) {

		function post(data, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http.post("https://testservices.baltimorecountymd.gov/api/baltcogo/createreport", data, postOptions)
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
			post: post
		};
	}

})(angular.module('baltcogoApp'));