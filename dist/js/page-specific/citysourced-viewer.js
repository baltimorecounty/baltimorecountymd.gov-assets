namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.citySourcedViewer = (function viewer($, querystringer, moment) {
	'use strict';

	var getNearbyData = function getNearbyData(settings, callback) {
		$.ajax('//testservices.baltimorecountymd.gov/api/citysourced/getreportsbylatlng', {
			method: 'POST',
			data: settings
		})
			.done(function done(data) {
				if (callback) {
					callback(data);
				}
			})
			.fail(function fail(error) {
				console.log(error);
			});
	};

	/**
	 * Descending date sort.
	 */
	var commentDateComparer = function commentDateComparer(a, b) {
		var aMoment = moment(a.Created);
		var bMoment = moment(b.Created);

		if (aMoment.isAfter(bMoment)) {
			return -1;
		}
		return 1;
	};

	/**
	 * Hides all but the top `numberToShow` comments in the `$target` list.
	 */
	var hideMostComments = function hideMostComments($target, commentData, numberToShow) {
		if (commentData && commentData.length > numberToShow) {
			$target.find('li').not(function lisItemHider(index) {
				return index <= numberToShow - 1;
			}).hide();
			$target.after('<p><a href="javascript:;" id="show-comments" aria-role="button">Load ' + (commentData.length - numberToShow) + ' more comments</a></p>');
			$('#show-comments').on('click', function showComments() {
				$target.find('li').slideDown(500);
				$(this).hide();
			});
		}
	};

	/**
	 * Removes seconds from the date strings of a data item.
	 */
	var processTimeForViewerDataItem = function processTimeForViewerDataItem(data) {
		var viewerDataItem = data;

		if (viewerDataItem.DateCreated) {
			viewerDataItem.DateCreated = removeSeconds(data.DateCreated);
		}

		if (viewerDataItem.DateUpdated) {
			viewerDataItem.DateUpdated = removeSeconds(data.DateUpdated);
		}

		if (data.Comments) {
			for (var n = 0; n < viewerDataItem.Comments.length; n += 1) {
				viewerDataItem.Comments[n].Created = removeSeconds(viewerDataItem.Comments[n].Created);
			}
		}

		return data;
	};

	/**
	 * Runs processTimeForViewerDataItem for each item in the array.
	 */
	var processTimeForMapDataArray = function processTimeForMapDataArray(dataArr) {
		var processedDataArr = dataArr;

		for (var i = 0; i < dataArr.length; i += 1) {
			processedDataArr[i] = processTimeForViewerDataItem(dataArr[i]);
		}
		return processedDataArr;
	};

	/**
	 * Removes the seconds from a date string.
	 */
	var removeSeconds = function removeSeconds(dateString) {
		var secondsRegex = /:\d+ (\w\w)$/;
		return dateString.replace(secondsRegex, ' $1');
	};

	var init = function init() {
		var qs = querystringer.getAsDictionary();
		var reportId = qs.reportid;

		if (reportId) {
			$.ajax('//testservices.baltimorecountymd.gov/api/citysourced/getreport/' + reportId)
				.done(function done(data) {
					var reportData = data;
					var startDate = new Date();
					startDate.setDate(-90);

					var nearbyDataSettings = {
						Latitude: data.Latitude,
						Longitude: data.Longitude,
						StartDate: startDate.toLocaleDateString('en-US')
					};

					reportData = processTimeForViewerDataItem(data);

					baltimoreCounty.pageSpecific.citySourcedData = data;

					if (data) {
						reportData.IsOpen = data.IsOpen ? 'open' : 'closed';
						if (data.Status === 'On Hold') {
							reportData.IsOpen = 'on-hold';
						}

						if (data.Comments && data.Comments.length > 0) {
							data.Comments.sort(commentDateComparer);
						}
					}

					var sourceHtml = $('#citysourced-viewer-template').html();
					var template = Handlebars.compile(sourceHtml);
					var html = template(data);
					var $element = $('#citysourced-viewer');

					getNearbyData(nearbyDataSettings, function nearbyDataInternal(nearbyData) {
						var processedNearbyData = processTimeForMapDataArray(nearbyData);
						$element.hide();
						$element.html(html);
						hideMostComments($('#comments'), data.Comments, 3);
						$element.slideDown(300, function addNearbyData() {
							baltimoreCounty.pageSpecific.nearbyData = processedNearbyData;
							$('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8&libraries=places&callback=baltimoreCounty.pageSpecific.viewerGoogleMaps.initGoogle" async defer></script>');
						});
					});
				})
				.fail(function fail() {
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
}(jQuery, baltimoreCounty.utility.querystringer,
	baltimoreCounty.pageSpecific.viewerGoogleMaps, moment)); // eslint-disable-line no-undef

$(function runInit() {
	baltimoreCounty.pageSpecific.citySourcedViewer.init();
});
