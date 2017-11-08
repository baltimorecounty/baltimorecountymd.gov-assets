namespacer('baltimoreCounty.pageSpecific');

// eslint-disable-next-line no-unused-vars
baltimoreCounty.pageSpecific.docket = (function docket($, undefined) {
	'use strict';

	function loadDocketInfo(callback) {
		$.ajax('//services.baltimorecountymd.gov/api/docket')
			.done(function done(data) {
				callback(data);
			})
			.error(function onError(error) {
				console.log(error); // eslint-disable-line no-console
				callback(false);
			});
	}

	function reformatDocket(data) {
		return data.split(/\r\n/);
	}

	function fillTable($target) {
		loadDocketInfo(function docketInfo(docketData) {
			var isError = false;

			if (docketData) {
				var reformattedArr = reformatDocket(docketData);
				var $tbody = $target.detach('tbody');
				var $docketDate = $('#docketDate');
				var NAME_WIDTH = 32;
				var CASE_WIDTH = 13;
				var TIME_WIDTH = 9;
				var JUDGE_WIDTH = 19;
				var infoLine = reformattedArr.shift();
				var dateString = infoLine.split(' ')[1];

				if (reformattedArr.length) {
					var rowString;
					$docketDate.text(new Date(dateString).toLocaleDateString());

					$.each(reformattedArr, function formatArr(index, item) {
						if (item.trim().length > 0) {
							rowString = '<tr>'
                + '<td>' + item.slice(0, NAME_WIDTH - 1).trim() + '</td>'
                + '<td>' + item.slice(NAME_WIDTH, ((NAME_WIDTH + CASE_WIDTH) - 1)).trim() + '</td>'
                + '<td>' + item.slice(NAME_WIDTH + CASE_WIDTH, ((NAME_WIDTH + CASE_WIDTH + TIME_WIDTH) - 1)).trim() + '</td>'
                + '<td>' + item.slice(NAME_WIDTH + CASE_WIDTH + TIME_WIDTH, ((NAME_WIDTH + CASE_WIDTH + TIME_WIDTH + JUDGE_WIDTH) - 1)).trim() + '</td>'
                + '<td>' + item.slice(NAME_WIDTH + CASE_WIDTH + TIME_WIDTH + JUDGE_WIDTH).trim() + '</td>'
                + '</tr>';
							$tbody.append(rowString);
						}
					});

					$target.append($tbody);
				} else {
					isError = false;
				}
			} else {
				isError = true;
			}

			if (isError) {
				$target.parent().children().hide();
				$target.parent().find('.docket-error-message').show();
			}
		});
	}

	return {
		fillTable: fillTable
	};
}(jQuery));

$(function init() {
	baltimoreCounty.pageSpecific.docket.fillTable($('.docket'));
});
