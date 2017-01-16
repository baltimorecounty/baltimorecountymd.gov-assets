jasmine.getFixtures().fixturesPath = '/spec/js/fixtures';

describe('NiftyForms', function() {

	beforeEach(function() {
		loadFixtures('nifty-forms.fixture.html');
	});

	describe('toggleChecked', function() {
		//toggleChecked = function($label)

		it('adds the "checked" css class to the label', function() {
			var $label = $('#testLabel1');
			
			baltimoreCounty.niftyForms.toggleChecked($label);
			var actual = $label.hasClass('checked');

			expect(actual).toBe(true);
		});

	});

});