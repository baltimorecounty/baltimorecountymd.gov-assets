namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.citySourcedReporter = (function (window, $, jsonTools, querystringer, undefined) {
	'use strict';

	var keys = {
			end: 35,
			home: 36,
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			delete: 46
		},
		fieldIds = ['categories[1]', 'categories[2]', 'categories[3]', 'description', 'address', 'map-latitude', 'map-longitude', 'firstName', 'lastName', 'email', 'deviceNumber'],

		init = function (jsonDocumentUrl) {

			var $wrapper = $('.bc-citysourced-reporter'),
				$form = $wrapper.find('#citysourced-reporter-form'),
				$categories = $form.find('#category-selection'),
				$panels = $form.find('.panel'),
				$steps = $wrapper.find('.bc-citysourced-reporter-steps li'),
				$deviceNumber = $wrapper.find('#deviceNumber'),
				queryString = querystringer.getAsDictionary(),
				handlerData = {
					$wrapper: $wrapper,
					animationFactor: 300,
					$form: $form,
					$categories: $categories,
					$panels: $panels,
					$steps: $steps,
					$firstPanel: $panels.first(),
					$lastPanel: $panels.last(),
					$prevButton: $('#prevButton'),
					$nextButton: $('#nextButton'),
					$fileReportButton: $('#fileReportButton')
				};

			$.ajax(jsonDocumentUrl).done(function (data) {
				if (queryString.categoryId)
					var categoryPathArr = jsonTools.getSubtreePath(data, 'id', 'types', queryString.categoryId);
				
				if (categoryPathArr)
					preloadCategory($categories, data, categoryPathArr);
				else 
					createSelectAndLoadOptions(data, $categories, 1);
			});

			handlerData.$nextButton.on('click', handlerData, nextButtonClickHandler);
			handlerData.$prevButton.on('click', handlerData, prevButtonClickHandler);
			handlerData.$fileReportButton.on('click', handlerData, fileReportButtonClickHandler);

			$form.find('input, textarea').on('blur keyup', function (event) {
				var keyupKey = event.which || event.keyCode;
				if (keyupKey !== 9)
					validate([event.target.id], event);
			});								
		},		

		/**
		 * Click handler for the 'File Your Report' button. Runs basic validation, then submits.
		 */
		fileReportButtonClickHandler = function (event) {
			if (!validate(fieldIds, event)) {

				$(event.target).prop('disabled', 'true').val('Submitting request...');

				var $form = event.data.$form,
					$wrapper = event.data.$wrapper,
					animationFactor = event.data.animationFactor,
					$firstCategory = event.data.$categories.find('select').first(),
					$lastCategory = event.data.$categories.find('select').last(),
					formData = {
						CategoryId: $firstCategory.val(),
						CategoryName: $firstCategory.find('option[value=' + $firstCategory.val() + ']').text(),
						IssueId: $lastCategory.val(),
						IssueName: $lastCategory.find('option[value=' + $lastCategory.val() + ']').text(),
						Details: $form.find('#details').val(),
						Longitude: $form.find('#map-longitude').val(),
						Latitude: $form.find('#map-latitude').val(),
						FirstName: $form.find('#firstName').val(),
						LastName: $form.find('#lastName').val(),
						Email: $form.find('#email').val(),
						DeviceNumber: $form.find('#deviceNumber').val()
					};

				var settings = {
					data: formData,
					dataType: 'json',
					method: 'POST',
					cache: false
				};

				$.ajax('//testservices.baltimorecountymd.gov/api/citysourced/createreport', settings)				
					.done(function (data, textStatus, jqXHR) {
						$wrapper.fadeOut(animationFactor, function () {
							var jsonResponse = JSON.parse(data);
							$("#issueId").text(jsonResponse.CsResponse.ReportId);
							$('.bc-citysourced-reporter-alert.alert-success').fadeIn(animationFactor);
						});
					})
					.fail(function (jqXHR, textStatus, errorThrown) {
						$wrapper.fadeOut(animationFactor, function () {
							$('.bc-citysourced-reporter-alert.alert-warning').fadeIn(animationFactor);
						});
						console.log(textStatus, errorThrown);
					});
			}
		},

		/**
		 * Click handler for the 'next' button, which flips to the next panel.
		 */
		nextButtonClickHandler = function (event) {
			if (validate(fieldIds, event)) {
				event.data.$form.find('[aria-invalid=true]').first().focus();
				return;
			}

			var $visiblePanel = event.data.$panels.filter(':visible'),
				$nextPanel = $visiblePanel.next('.panel').first();

			if ($nextPanel.is(event.data.$lastPanel)) {
				$(event.target).addClass('hidden');
				event.data.$fileReportButton.removeClass('hidden');
				event.data.$fileReportButton.attr('aria-hidden', false);
			} else {
				$(event.target).removeClass('hidden');
			}

			$(event.target).attr('aria-hidden', $(event.target).hasClass('hidden'));

			if ($nextPanel.length) {
				$visiblePanel.fadeOut(event.data.animationFactor, function () {
					$nextPanel.fadeIn(event.data.animationFactor);
					$visiblePanel.attr('aria-hidden', 'true');
					$nextPanel.attr('aria-hidden', 'false');
					event.data.$steps.eq($nextPanel.index()).toggleClass('highlight');
					event.data.$prevButton.removeClass('hidden');

					if ($nextPanel.find('#map').length) {
						if (google.maps) {
							var center = map.getCenter();
							google.maps.event.trigger(map, 'resize');
							map.setCenter(center);
						}
					}
				});
			}

			$('html, body').animate({
				scrollTop: $('#mainContent').offset().top
			}, event.data.animationFactor, function () {
				focusFirstFormElementOfActivePanel(event.data.$panels);
			});
		},

		/**
		 * Click handler for the 'previous' button, which flips to the previous panel.
		 */
		prevButtonClickHandler = function (event) {
			if (validate(fieldIds, event)) {
				event.data.$form.find('[aria-invalid=true]').first().focus();
				return;
			}

			var $visiblePanel = event.data.$panels.filter(':visible'),
				$nextPanel = $visiblePanel.prev('.panel').first();

			event.data.$fileReportButton.addClass('hidden');

			if ($nextPanel.is(event.data.$firstPanel))
				$(event.target).addClass('hidden');
			else
				$(event.target).removeClass('hidden');

			$(event.target).attr('aria-hidden', $(event.target).hasClass('hidden'));

			if ($nextPanel.length) {
				event.data.$steps.eq($nextPanel.index() + 1).toggleClass('highlight');
				$visiblePanel.fadeOut(event.data.animationFactor, function () {
					$nextPanel.fadeIn(event.data.animationFactor);
					event.data.$nextButton.removeClass('hidden');
				});
			}

			$('html, body').animate({
				scrollTop: $('#mainContent').offset().top
			}, event.data.animationFactor, function () {
				focusFirstFormElementOfActivePanel(event.data.$panels);
			});
		},

		/**
		 * Sets the focus to the first imput element of the active panel.
		 */
		focusFirstFormElementOfActivePanel = function ($panels) {
			$panels.filter(':visible').find('input, select, textarea').filter(':visible').first().focus();
		},

		/**
		 * Creates the series of dropdowns for the category selection.
		 */
		createSelectAndLoadOptions = function (data, $parent, depth, preselectId) {
			var $select = $('<select>', {
				id: 'categories[' + depth + ']',
				'aria-labelledby': 'categories-label',
				'aria-required': true
			});
			$select.insertBefore($parent.find('.error-message'));

			var $option = $('<option>', {
				value: -1,
				text: '--- Select a request category ---',
				selected: preselectId ? false : 'selected'
			});
			$select.append($option);

			$select.on('blur change', function (event) {
				validate([event.target.id]);
			});

			$.each(data, function (idx, item) {
				var $option = $('<option>', {
					value: item.id,
					text: item.name,
					selected: item.id === preselectId
				});
				$select.append($option);
			});

			$select.on('change', {
				fragment: data
			}, selectChangeHandler);
		},

		/**
		 * Updates the category dropdown options and visibility when the selected item changes.
		 */
		selectChangeHandler = function (event) {
			var $select = $(event.target),
				selectedValue = $select.val(),
				selectedName = $select.find('option[value=' + selectedValue + ']').text(),
				existingSelectCount,
				$trackingField = $('#report-category');

			$select.nextAll('select').remove();

			if (selectedValue === '-1') {
				$trackingField.val('');
				return;
			}

			existingSelectCount = $select.siblings('select').length + 1;

			var jsonSubtree = jsonTools.getSubtree(event.data.fragment, 'name', 'types', selectedName);

			if (jsonSubtree)
				createSelectAndLoadOptions(jsonSubtree, $select.parent(), existingSelectCount + 1);
			else
				$trackingField.val(selectedValue);
		},

		/**
		 * Loads the category ID from the "categoryId" querystring.
		 */
		preloadCategory = function($target, categoryData, categoryPathArr) {	
			var pathArr = $.map(categoryPathArr, function(n) {
				return n;
			});

			for (var x = 0; x < pathArr.length; x++) {
				createSelectAndLoadOptions(categoryData, $target, x + 1, pathArr[x]);
				for (var y = 0; y < categoryData.length; y++) {
					if (categoryData[y].id === pathArr[x]) {
						categoryData = categoryData[y].types;
						break;
					}
				}
			}

			$('#report-category').val(pathArr[pathArr.length-1]);
		},

		/**
		 * Validates a single field.
		 */
		validateField = function ($field, event) {
			var fieldId = $field.attr('id');

			if ($field.is(':visible')) {
				if (!$field.val() || $field.val() === '-1') {
					$field.parent().addClass('error');
					$field.attr('aria-invalid', 'true');
					return fieldId;
				} else {
					$field.parent().removeClass('error');
					$field.attr('aria-invalid', 'false');
				}

				if (fieldId === 'address') {
					if (!$('#map-latitude').val() && !$('#map-longitude').val()) {
						$field.parent().addClass('error');
						return fieldId;
					}
				}
				
				// Check that phone is composted of 10 digits on blur only
				if (fieldId=='deviceNumber' && event.type === 'blur') {
					var deviceNumber = $field.val(),
						digits = deviceNumber.match(/\d+/g),
						combinedDigits = digits ? digits.join('') : '';

					if (combinedDigits.length != 10) {
						$field.parent().addClass('error');
						return fieldId;
					}
				}

			}

			return;
		},

		/**
		 * Simple validation that only makes sure a value is present.
		 */
		validate = function (fieldIds, event) {
			var errorFieldIds = [],
				$field,
				validatedFieldId;

			if (fieldIds.length)
				$.each(fieldIds, function (idx, item) {
					// Hack, since jQuery doesn't "see" newly appended items, and some of these fields are dynamic.
					$field = $(document.getElementById(item.id ? item.id : item));
					validatedFieldId = validateField($field, event);
					if (validatedFieldId)
						errorFieldIds.push(validatedFieldId);
				});
			else {
				$field = $(document.getElementById(fieldIds.id));
				validatedFieldId = validateField($field, event);
				if (validatedFieldId)
					errorFieldIds.push(validatedFieldId);
			}

			return errorFieldIds.length;
		};

	return {
		init: init
	};

})(window, jQuery, baltimoreCounty.utility.jsonTools, baltimoreCounty.utility.querystringer);

$(function () {
	/* Auto-load the category data */
	//baltimoreCounty.pageSpecific.citySourcedReporter.init('/sebin/s/o/categories-v5.json');
	baltimoreCounty.pageSpecific.citySourcedReporter.init('/sebin/q/k/categories.json');
});