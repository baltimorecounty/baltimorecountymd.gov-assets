namespacer("baltimoreCounty.pageSpecific");

baltimoreCounty.pageSpecific.citySourcedViewer = (function($, querystringer, undefined) {
	'use strict';

	var init = function() {
		var qs = querystringer.getAsDictionary(),
			reportId = qs.reportId;

		if (reportId) {
			$.ajax("//ba224964:1000/api/citysourced/getreport/" + reportId)
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
				})
				.fail(function (jqXHR, textStatus, errorThrown) {
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

})(jQuery, baltimoreCounty.utility.querystringer);

$(function() { baltimoreCounty.pageSpecific.citySourcedViewer.init(); });