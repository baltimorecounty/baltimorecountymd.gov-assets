const frisby = require('frisby');
const urls = require('./urls');

const responseData = {
	Id: 257703,
	DateCreated: '8/21/2017 12:28:03 PM',
	DateUpdated: '8/21/2017 12:35:01 PM',
	RequestType: 'Budget and Finance',
	IssueType: 'Bids, disbursements and vendors',
	Description: 'asd',
	Latitude: 39.4003873,
	Longitude: -76.605649,
	Status: 'Received',
	IsOpen: true,
	Comments: [{
		Created: '8/21/2017 12:29:03 PM',
		Text: 'Thank you for contacting Baltimore County. Your concerns are important to us. Someone will review your submission and contact you soon in regards to your purchasing inquiry.',
		Author: 'BALTCOGO Stage' }]
};

describe('CitySourced GetReport', function CreateReport() {
	it('will return 200 when passed a valid id', function validDataTest(done) {
		frisby.get(urls.getReport + '/257703')
			.expect('status', 200)
			.expect('json', responseData)
			.done(done);
	});

	it('will return 404 when passed an invalid id', function validDataTest(done) {
		frisby.get(urls.getReport + '/9999999')
			.expect('status', 404)
			.done(done);
	});
});
