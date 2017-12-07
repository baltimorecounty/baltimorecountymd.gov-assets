var icon = (function () {
	var classes = {
		icon: {
			canceled: 'fa-times',
			cancelled: 'fa-times',
			closed: 'fa-times',
			external: 'fa-external-link',
			seewebsite: 'fa-external-link',
			modified: 'fa-exclamation-triangle',
			open: 'fa-check',
			operating: 'fa-check'
		},
		size: {
			extraSmall: 'fa-1x icon-extra-small',
			small: 'fa-2x icon-small',
			medium: 'fa-3x icon-medium',
			large: 'fa-4x icon-large',
			extraLarge: 'fa-5x icon-extra-large'
		}
	};

	return function (type, size) {
		type = type.toLowerCase().replace(' ', '');
		// If the type does not match up wtih an icon, use modified icon as default
		type = classes.icon[type] ? type : 'modified';
		return '<i class="fa ' + classes.icon[type] + ' ' + classes.size[size] + ' icon-inline icon-' + type + '"></i>';
	};
}());

var getTodaysDate = function () {
	var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	var today = new Date(),
		day = days[today.getDay()],
		date = today.getDate(),
		month = monthNames[today.getMonth()],
		year = today.getFullYear();

	return day + ', ' + month + ' ' + date + ', ' + year;
};

(function closings($) {
	/* Number of Columns that Contain Data */
	var numOfTableCells = 3;

	// $closings consist of
	var addTableRow = function (data) {
			var $tableBody = $('#county-closings tbody'),
				tableRow = "<tr><td class='icon'>" + data.icon + '</td>' +
                '<td>' + data.status + '</td><td>' + data.link +
                '</td><td>' + data.message + '</td></tr>';

			$tableBody.append(tableRow);
		},
		addDataToTable = function ($closingsData) {
			$closingsData.each(function () {
				var $this = $(this),
					data = {};

				$this.remove();

				data.link = $this.find('a')[0].outerHTML;

				var dataArr = $this.html().split(data.link);
				data.status = cleanData(dataArr[0]);
				data.message = cleanData(dataArr[1]);
				data.icon = icon(data.status, 'small');

				addTableRow(data);
			});
		},
		cleanData = function (data) {
			// remove br|p|h1|h2|h3|strong tags along with html comments
			return $.trim(data.replace(/(<(br|p|h1|h2|h3|strong)>|<\/(br|p|h1|h2|h3|strong)>)/g, '').replace(/<!--[^>]*-->/g, ''));
		},
		isStatusColumn = function (recordNumber, numberOfCells) {
			return recordNumber % numberOfCells === 1;
		},
		updateCountyStatus = function () {
			updateTodaysDate();
			updateCountyStatusImage();
		},
		// Update the status icon for Baltiomre County Government in the hero Unit
		updateCountyStatusImage = function () {
			var $statusImage = $('.status-image'),
				$statusContainerData = $('.county-closings-status-container p'),
				status = $statusContainerData.length ? $statusContainerData[0].innerHTML.toLowerCase() : '';

			$statusContainerData.eq(0).prepend('<strong>Status: </strong>');

			$statusImage.replaceWith(icon(status, 'extraLarge'));
		},
		updateTodaysDate = function () {
			// Update Today's Date
			$('.todays-date').html('<p>' + getTodaysDate() + '</p>');
		};

	$(document).ready(function () {
		// Update the hero unit that contains the county status
		updateCountyStatus();

		var $closingsTable = $('#county-closings');

		$closingsTable.hide();

		// Add Inclusion Data to our HTML Table
		addDataToTable($('.closings-data-snippet'));

		/* Intialize the DataTable Plugin */
		if ($closingsTable.DataTable)
		{
 $closingsTable.DataTable({
			info: false,
			paging: false,
			'bFilter': false,
			processing: true,
			responsive: {
				details: {
					renderer: function (api, rowIdx) {
						// Select hidden columns for the given row
						var data = api.cells(rowIdx, ':hidden').eq(0).map(function (cell) {
							var header = $(api.column(cell.column).header());
							var idx = api.cell(cell).index();

							if (header.hasClass('control') || header.hasClass('never')) {
								return '';
							}

							// Use a non-public DT API method to render the data for display
							// This needs to be updated when DT adds a suitable method for
							// this type of data retrieval
							var dtPrivate = api.settings()[0];
							var cellData = dtPrivate.oApi._fnGetCellData(
								dtPrivate, idx.row, idx.column, 'display');
							var title = header.text();
							if (title) {
								title += ':';
							}

							if (header[0].innerHTML) {
								return '<li data-dtr-index="' + idx.column + '">' +
                                        '<span class="dtr-title">' + title +
                                        '</span> ' +
                                        '<span class="dtr-data">' + cellData +
                                        '</span>' +
                                        '</li>';
							}
						}).toArray()
.join('');

						return data ? $('<ul data-dtr-index="' + rowIdx + '"/>').append(data) : false;
					}
				}
			},
			autoWidth: false,
			order: [
				[1, 'asc']
			],
			/*Order by Agency/Program Name */
			columnDefs: [{
				targets: 0,
				orderable: false
			}, {
				targets: 3,
				orderable: false
			}],
			drawCallback: function (settings) {
				var api = this.api();
				var rows = api.rows({
					page: 'current'
				}).nodes();
				var last = null;

				api.column(1, {
					page: 'current'
				}).data().each(function (group, i) {
					$(rows).eq(i).addClass(group.toLowerCase().replace(' ', '-'));
					if (last !== group) {
						// $(rows).eq(i).before(
						// '<tr class="group"><td colspan="5">' + group + '</td></tr>');

						last = group;
					}
				});
			}
		}); 
}

		$closingsTable.show();
	});
}(jQuery));
