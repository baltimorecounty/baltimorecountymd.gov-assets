(function constantsWrapper(app) {
	'use strict';

	var constants = {
		urls: {
			geocodeServer: '//bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/CompositeGeocode_CS/GeocodeServer',
			suggestions: '//testservices.baltimorecountymd.gov/api/gis/addressLookup/',
			createReport: '//testservices.baltimorecountymd.gov/api/baltcogo/createreport',
			getReport: '//testservices.baltimorecountymd.gov/api/citysourced/getreport/',
			getReportLatLng: '//testservices.baltimorecountymd.gov/api/citysourced/getreportsbylatlng',
			json: {
				animalBreeds: '/sebin/y/a/animal-breeds.json',
				animalColors: '/sebin/u/u/animal-colors.json',
				animalTypes: '/sebin/a/e/animal-types.json',
				categories: '/sebin/q/m/categories.json',
				petTypes: '/sebin/m/a/pet-types.json'
			}
		}
	};

	var localConstants = {
		urls: {
			geocodeServer: '//bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/CompositeGeocode_CS/GeocodeServer',
			suggestions: '//ba224964/api/gis/addressLookup/',
			createReport: '//ba224964/api/baltcogo/createreport',
			getReport: '//ba224964/api/citysourced/getreport/',
			getReportLatLng: '//ba224964/api/citysourced/getreportsbylatlng',
			json: {
				animalBreeds: '/sebin/y/a/animal-breeds.json',
				animalColors: '/sebin/u/u/animal-colors.json',
				animalTypes: '/sebin/a/e/animal-types.json',
				categories: '/sebin/q/m/categories.json',
				petTypes: '/sebin/m/a/pet-types.json'
			}
		}
	};

	app.constant('CONSTANTS', constants);
}(angular.module('baltcogoApp')));
