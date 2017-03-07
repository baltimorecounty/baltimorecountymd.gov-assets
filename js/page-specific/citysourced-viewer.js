namespacer("baltimoreCounty.pageSpecific");

baltimoreCounty.pageSpecific.citySourcedViewer = (function($, querystringer, maps, undefined) {
	'use strict';

	var getNearbyData = function(settings, callback) {
			$.ajax('//ba224964:1000/api/citysourced/getreportsbylatlng', {
				method: 'POST',
				data: settings
			})
				.done(function(data) {
					if (callback)
						callback(data);
				})
				.fail(function(error) {

				});
		},

		init = function() {

			var qs = querystringer.getAsDictionary(),
				reportId = qs.reportId;

			if (reportId) {
				$.ajax("//testservices.baltimorecountymd.gov/api/citysourced/getreport/" + reportId)
					.done(function (data, textStatus, jqXHR) {
						var endDate = new Date();
						endDate.setDate(-90);

						var nearbyDataSettings = {
							Latitude: data.Latitude,
							Longitude: data.Longitude,
							StartDate: endDate.toLocaleDateString('en-US')
						};

						baltimoreCounty.pageSpecific.citySourcedData = data;
				
						if (data && data.IsOpen) 
							data.IsOpen = data.IsOpen ? 'open' : 'closed';

						var sourceHtml = $('#citysourced-viewer-template').html(),
							template = Handlebars.compile(sourceHtml),
							html = template(data),
							$element = $('#citysourced-viewer');

						getNearbyData(nearbyDataSettings, function(nearbyData) {
							$element.hide();
							$element.html(html);
							$element.slideDown(300, function() {
								baltimoreCounty.pageSpecific.nearbyData = nearbyData;
								$('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8&libraries=places&callback=baltimoreCounty.pageSpecific.viewerGoogleMaps.initGoogle" async defer></script>');
							});
						});
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