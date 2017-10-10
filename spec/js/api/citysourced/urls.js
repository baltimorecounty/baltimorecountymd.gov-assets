const urlRoot = 'https://testservices.baltimorecountymd.gov';
// const urlRoot = 'http://localhost:1000';

const urls = {
	createReport: urlRoot + '/api/baltcogo/createreport',
	getReport: urlRoot + '/api/citysourced/getreport',
	getReportLatLng: urlRoot + '/api/citysourced/getreportsbylatlng'
};

module.exports = urls;
