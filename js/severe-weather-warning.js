namespacer('baltimoreCounty');

baltimoreCounty.severeWeatherWarning = (function($, undefined) {

	var severeWeatherClosingElementSelector = '#severeweatherclosing';
	var firstParagraphSelector = 'p:first-child';
	var calloutBoxSelector = '.callout_box';
	var defaultStatus = 'open';

	function displayIfStatusIsNot(status) {
		var $severeWeatherClosingElement = $(severeWeatherClosingElementSelector);

		if ($severeWeatherClosingElement.find(firstParagraphSelector).text().toLowerCase() !== (status || defaultStatus)) { 
			$severeWeatherClosingElement.closest(calloutBoxSelector).slideDown(250); 
		}
	}

	return {
		displayIfStatusIsNot: displayIfStatusIsNot
	};

})(jQuery);

$(function() {
	baltimoreCounty.severeWeatherWarning.displayIfStatusIsNot('open');
});