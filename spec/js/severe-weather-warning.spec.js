jasmine.getFixtures().fixturesPath = '/spec/js/fixtures';

describe('Severe Weather Warning', function() {

    describe('displayIfStatusIsNot', function() {       
        beforeEach(function() {
 	        loadFixtures('severe-weather-warning.fixture.html');
        });

        it('does not display warning when the status is blank and the text is "Open"', function() {
            baltimoreCounty.severeWeatherWarning.displayIfStatusIsNot();

			var actual = $('#severeweatherclosing').parent().attr('style') === 'display: none';

            expect(actual).toBeTruthy();
        });

        it('does not display warning when the status is "open" and the text is "Open"', function() {
            baltimoreCounty.severeWeatherWarning.displayIfStatusIsNot('open');
			var actual = $('#severeweatherclosing').parent().attr('style') === 'display: none';
            expect(actual).toBeTruthy();
        });

        it('displays warning when the status is "closed" and the text is "Open"', function(done) {
			baltimoreCounty.severeWeatherWarning.displayIfStatusIsNot('closed');
			setTimeout(function() {
				var actual = $('#severeweatherclosing').parent().attr('style') !== 'display: none';
				expect(actual).toBeTruthy();
				done();
			}, 500);
        });

    });


});