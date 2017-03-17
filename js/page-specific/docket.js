namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.docket = (function($, undefined) {
	'use strict';

	var loadDocketInfo = function(callback) {
		$.ajax('//services.baltimorecountymd.gov/api/docket')
			.done(function(data) {
				callback(data);
			})
			.error(function(error) {
				console.log(error);
			});
	},

	reformatDocket = function(data) {
		return data.split(/\r\n/);
	},

	fillTable = function($target) {
		var docketInfo = loadDocketInfo(function(docketData) {
			var reformattedArr = reformatDocket(docketData),
				$tbody = $target.detach('tbody'),
				$docketDate = $('#docketDate'),
				NAME_WIDTH = 32,
				CASE_WIDTH = 13,
				TIME_WIDTH = 9,
				JUDGE_WIDTH = 19,
				ROOM_WIDTH = 25,
				infoLine = reformattedArr.shift(),
				dateString = infoLine.split(' ')[1];

			$docketDate.text(new Date(dateString).toLocaleDateString());

			$.each(reformattedArr, function(index, item) {	
				if (item.trim().length > 0) {
					var rowString = "<tr>"
						+ "<td>" + item.slice(0, NAME_WIDTH - 1).trim() + "</td>"
						+ "<td>" + item.slice(NAME_WIDTH, NAME_WIDTH + CASE_WIDTH - 1).trim() + "</td>"
						+ "<td>" + item.slice(NAME_WIDTH + CASE_WIDTH, NAME_WIDTH + CASE_WIDTH + TIME_WIDTH - 1).trim() + "</td>"
						+ "<td>" + item.slice(NAME_WIDTH + CASE_WIDTH + TIME_WIDTH, NAME_WIDTH + CASE_WIDTH + TIME_WIDTH + JUDGE_WIDTH - 1).trim() + "</td>"
						+ "<td>" + item.slice(NAME_WIDTH + CASE_WIDTH + TIME_WIDTH + JUDGE_WIDTH).trim() + "</td>"
						+ "</tr>";
					$tbody.append(rowString);
				}
			});
			$target.append($tbody);
		});
	};

	return {
		fillTable: fillTable
	};

})(jQuery);

$(function() {
	baltimoreCounty.pageSpecific.docket.fillTable($('.docket'));
});