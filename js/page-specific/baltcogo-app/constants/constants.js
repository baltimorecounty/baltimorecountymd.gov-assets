(function constantsWrapper(app) {
	'use strict';

	app.factory('CONSTANTS', constants);

	function constants() {
		return {
			urls: {
				geocodeServer: 'http://bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/CompositeGeocode_CS/GeocodeServer',
				suggestions: '//testservices.baltimorecountymd.gov/api/gis/addressLookup/',
				createReport: '//testservices.baltimorecountymd.gov/api/baltcogo/createreport',
				getReport: '//testservices.baltimorecountymd.gov/api/citysourced/getreport/',
				getReportLatLng: '//testservices.baltimorecountymd.gov/api/citysourced/getreportsbylatlng'
			}
		};
	}
}(angular.module('baltcogoApp')));
