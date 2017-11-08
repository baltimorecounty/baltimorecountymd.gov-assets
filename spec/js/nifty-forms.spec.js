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

		it('checks the label\'s adjacent input', function() {
			var $label = $('#testLabel1');
			
			baltimoreCounty.niftyForms.toggleChecked($label);
			var actual = $label.siblings('input').is(':checked');

			expect(actual).toBe(true);
		});

		it('removes the "checked" css class from the adjacent label when run a second time', function() {
			var $label = $('#testLabel1');
			
			baltimoreCounty.niftyForms.toggleChecked($label);
			baltimoreCounty.niftyForms.toggleChecked($label);
			var actual = $label.hasClass('checked');

			expect(actual).toBe(false);
		});

		it('unchecks the label\'s adjacent input when run a second time', function() {
			var $label = $('#testLabel1');
			
			baltimoreCounty.niftyForms.toggleChecked($label);
			var actual = $label.siblings('input').is(':checked');

			expect(actual).toBe(true);
		});

		it('adds the "checked" css class to the wrapping div', function() {
			var $label = $('#inputWrapper2');
			
			baltimoreCounty.niftyForms.toggleChecked($label);
			var actual = $label.hasClass('checked');

			expect(actual).toBe(true);
		});

		it('checks the input inside the wrapping div', function() {
			var $label = $('#inputWrapper2');
			
			baltimoreCounty.niftyForms.toggleChecked($label);
			var actual = $label.find('input').is(':checked');

			expect(actual).toBe(true);
		});

		it('removes the "checked" css class from the wrapping div when run a second time', function() {
			var $label = $('#inputWrapper2');
			
			baltimoreCounty.niftyForms.toggleChecked($label);
			baltimoreCounty.niftyForms.toggleChecked($label);
			var actual = $label.hasClass('checked');

			expect(actual).toBe(false);
		});

		it('unchecks the input inside the wrapping div when run a second time', function() {
			var $label = $('#inputWrapper2');
			
			baltimoreCounty.niftyForms.toggleChecked($label);
			baltimoreCounty.niftyForms.toggleChecked($label);
			var actual = $label.find('input').is(':checked');

			expect(actual).toBe(false);
		});

	});

});