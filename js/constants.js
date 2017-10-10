namespacer('baltimoreCounty');

baltimoreCounty.constants = (function constants() {
	'use strict';

	var rootUrl = 'https://services.baltimorecountymd.gov';
	// var rootUrl = 'http://localhost:1000';

	var baltCoGo = {
		urls: {
			api: {
				geocodeServer: '//bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/CompositeGeocode_CS/GeocodeServer',
				createReport: rootUrl + '/api/baltcogo/createreport',
				getReport: rootUrl + '/api/citysourced/getreport',
				getReportLatLng: rootUrl + '/api/citysourced/getreportsbylatlng',
				suggestions: rootUrl + '/api/gis/addressLookup/'
			},
			json: {
				animalBreeds: '/sebin/y/a/animal-breeds.json',
				animalColors: '/sebin/u/u/animal-colors.json',
				animalTypes: '/sebin/a/e/animal-types.json',
				categories: '/sebin/q/m/categories.json',
				petTypes: '/sebin/m/a/pet-types.json'
			}
		},
		locations: {
			courtHouse: {
				latitude: 39.4001526,
				longitude: -76.6074448
			}
		}
	};

	return {
		baltCoGo: baltCoGo
	};
}());
