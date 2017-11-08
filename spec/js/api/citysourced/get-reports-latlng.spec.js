const frisby = require('frisby');
const urls = require('./urls');

const responseData = [{
	Id: '257702',
	DateCreated: '8/18/2017 3:49:07 PM',
	IssueType: 'Bids, disbursements and vendors',
	StatusType: 'Received',
	Longitude: '-76.6077518',
	Latitude: '39.4002546' }];

const goodParams = {
	Latitude: 39.4003873,
	Longitude: -76.605649,
	StartDate: '5/2/2017'
};

describe('CitySourced GetReportsByLatLng', function CreateReport() {
	it('will return 200 when passed valid data', function validDataTest(done) {
		frisby.post(urls.getReportLatLng, goodParams)
			.expect('status', 200)
			.done(done);
	});

	it('will return 400 when passed no data', function validDataTest(done) {
		frisby.post(urls.getReportLatLng)
			.expect('status', 400)
			.done(done);
	});
});
