(function(app) {
	'use strict';

	app.factory('createReportService', ['$http', createReportService]);

	function createReportService($http) {

		function post(data, callback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http.post("http://ba224964:1000/api/baltcogo/createreport", data, postOptions)
				.then(
					function (response) {
						callback(true);
					},
					function (error) {
						callback(false);
						console.log('error', error);
					}
				);
		}

		return {
			post: post
		}
	}

})(angular.module('baltcogoApp'));