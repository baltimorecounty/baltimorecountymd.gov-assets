const frisby = require('frisby');
const joi = frisby.Joi;

const validData = [{
	name: 'Category',
	id: 1023380,
	value: 'Budget and Finance'
},
{
	name: 'SubCategory',
	id: 1024925,
	value: 'Bids, disbursements and vendors'
},
{
	name: 'Description',
	id: 1024808,
	value: 'asd'
}, {
	name: 'Latitude',
	value: 39.37861646
},
{
	name: 'Longitude',
	value: -76.59712263
}, {
	name: 'FirstName',
	value: 'Michael'
},
{
	name: 'LastName',
	value: 'Snyder'
},
{
	name: 'Email',
	value: 'mxsnyder@baltimorecountymd.gov'
},
{
	name: 'DeviceNumber',
	value: '234-234-2342'
}];

const emptyData = [];

const wrongTypeData = '';

describe('CitySourced CreateReport', function CreateReport() {
	it('will return 200 when passed valid data', function validDataTest(done) {
		frisby.post('http://localhost:1000/api/baltcogo/createreport', validData)
			.expect('status', 200)
			.expect('jsonTypes', {
				CsResponse: {
					Message: joi.string(),
					ReportId: joi.string(),
					ReportIsOutOfBounds: joi.string(),
					AuthorId: joi.string(),
					ResponseTime: joi.string()
				}
			})
			.done(done);
	});

	it('will return a bad request (400) error when passed empty data', function invalidDataTest(done) {
		frisby.post('http://localhost:1000/api/baltcogo/createreport', emptyData)
			.expect('status', 400)
			.done(done);
	});

	it('will return a bad request (400) error when passed the wrong type of data', function invalidDataTest(done) {
		frisby.post('http://localhost:1000/api/baltcogo/createreport', wrongTypeData)
			.expect('status', 400)
			.done(done);
	});
});
