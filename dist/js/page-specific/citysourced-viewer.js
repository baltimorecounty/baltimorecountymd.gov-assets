namespacer("baltimoreCounty.pageSpecific");

baltimoreCounty.pageSpecific.citySourcedViewer = (function($, querystringer, maps, undefined) {
	'use strict';

	var init = function() {

			var qs = querystringer.getAsDictionary(),
				reportId = qs.reportId;

			if (reportId) {
				$.ajax("//testservices.baltimorecountymd.gov/api/citysourced/getreport/" + reportId)
					.done(function (data, textStatus, jqXHR) {
										
						if (data && data.IsOpen) 
							data.IsOpen = data.IsOpen ? 'open' : 'closed';
						var sourceHtml = $('#citysourced-viewer-template').html(),
							template = Handlebars.compile(sourceHtml),
							html = template(data);

						var $element = $('#citysourced-viewer');
						$element.hide();
						$element.html(html);
						$element.slideDown(300);

						$('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8&libraries=places&callback=baltimoreCounty.pageSpecific.viewerGoogleMaps.initGoogle" async defer></script>');
					})
					.fail(function (jqXHR, textStatus, errorThrown) {
						$('#reportId').text(reportId);
						$('.bc-citysourced-reporter').hide();
						$('.bc-citysourced-viewer-alert').slideDown(300);
					});
			} else {
				$('.bc-citysourced-reporter').hide();
				$('.bc-citysourced-viewer-alert').slideDown(300);
			}
		};

	return {
		init: init
	};

})(jQuery, baltimoreCounty.utility.querystringer, baltimoreCounty.pageSpecific.viewerGoogleMaps);

$(function() { baltimoreCounty.pageSpecific.citySourcedViewer.init() });