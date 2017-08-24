(function constantsWrapper(app, baltCoGoConstants) {
	'use strict';

	var constants = {
		urls: {
			geocodeServer: baltCoGoConstants.urls.api.geocodeServer,
			suggestions: baltCoGoConstants.urls.api.suggestions,
			createReport: baltCoGoConstants.urls.api.createReport,
			getReport: baltCoGoConstants.urls.api.getReport,
			getReportLatLng: baltCoGoConstants.urls.api.getReportLatLng,
			json: {
				animalBreeds: baltCoGoConstants.urls.json.animalBreeds,
				animalColors: baltCoGoConstants.urls.json.animalColors,
				animalTypes: baltCoGoConstants.urls.json.animalTypes,
				categories: baltCoGoConstants.urls.json.categories,
				petTypes: baltCoGoConstants.urls.json.petTypes
			}
		}
	};

	app.constant('CONSTANTS', constants);
}(angular.module('baltcogoApp'), baltimoreCounty.constants.baltCoGo));
