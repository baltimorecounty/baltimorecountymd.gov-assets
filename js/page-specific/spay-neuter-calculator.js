namespacer('baltimoreCounty.pageSpecific');

/*
 * Spaying and Neutering calculator module.
 * Used on http://www.baltimorecountymd.gov/Agencies/health/animalservices/spayneuter.html
 */
baltimoreCounty.pageSpecific.spayNeuterCalculator = (function ($) {
	'use strict';

	var zipsDundalk = ['21219', '21220', '21221', '21222', '21224', '21237'],
		zipsSwap = ['21207', '21227', '21244'],
		facilityList = {
			baldwin: {
				address: 'Baldwin, 13800 Manor Road',
				link: 'https://clinichq.org/online/564cf872-6f61-476f-8ecd-61d574a8a06f'
			},
			dundalk: {
				address: 'Dundalk, 7702 Dunmanway',
				link: 'https://clinichq.org/online/144afb8f-6c15-4f15-8e16-9417a4f85823'
			},
			swap: {
				address: 'Southwest Area Park, 3941 Klunk Drive',
				link: 'https://clinichq.org/online/3edba5a4-9922-4e2a-87a5-c138c8e8f4a8'
			}
		},
		$spayNeuterForm = $('#spayNeuterForm'),
		$isResidentField = $('#spayNeuterForm input[name=isBaltimoreCountyResident]'),
		$isPublicAssistanceField = $('#spayNeuterForm input[name=isPublicAssistance]'),
		$isCatPitBullField = $('#spayNeuterForm input[name=isCatPitBull]'),
		$zipCodeField = $('#spayNeuterForm #zipCode'),
		isResident = false,
		isPublicAssistance = false,
		isCatPitBull = false,
		zipCode = '',
		isDundalkZip = false,
		isSwapZip = false,
		textInputValidationRegExp = /^\d{5}$/,

		/*
		 * Form validation!
		 */
		isValid = function () {
			var validationErrorFlag = false;
			if (!baltimoreCounty.utility.formValidator.requiredFieldRadioValidator($isResidentField)) {
				errorNotification($isResidentField);
				validationErrorFlag = true;
			}

			if (!baltimoreCounty.utility.formValidator.requiredFieldRadioValidator($isPublicAssistanceField)) {
				errorNotification($isPublicAssistanceField);
				validationErrorFlag = true;
			}

			if (!baltimoreCounty.utility.formValidator.requiredFieldRadioValidator($isCatPitBullField)) {
				errorNotification($isCatPitBullField);
				validationErrorFlag = true;
			}

			if (!baltimoreCounty.utility.formValidator.requiredFieldPatternValidator($zipCodeField, textInputValidationRegExp)) {
				errorNotification($zipCodeField);
				validationErrorFlag = true;
			}

			return !validationErrorFlag;
		},

		/*
		 * Attaches validation to form field events so we can vlidate on the fly.
		 */
		setupValidation = function ($form) {
			var $formInputs = $form.find('input');

			for (var i = 0; i < $formInputs.length; i++) {
				var $input = $($formInputs[i]);
				var inputType = $input.attr('type');

				switch (inputType) {
					case 'radio':
						$input.on('click', validationClickHandler);
						break;
					case 'text':
						$input.on('keyup', validationKeyupHandler);
						break;
				}
			}
		},

		/**
		 * Handles the input "click" validation events.
		 */
		validationClickHandler = function (e) {
			var $current = $(e.target);
			if (baltimoreCounty.utility.formValidator.requiredFieldRadioValidator($current))
				clearErrorNotification($current);
			else
				errorNotification($current);
		},

		/**
		 * Handles the input "keyup" validation events.
		 */
		validationKeyupHandler = function (e) {
			var $current = $(e.target);
			if (baltimoreCounty.utility.formValidator.requiredFieldPatternValidator($current, textInputValidationRegExp))
				clearErrorNotification($current);
			else
				errorNotification($current);
		},

		/*
		 * Removes the error notification message.
		 */
		clearErrorNotification = function ($fieldWithError) {
			$fieldWithError.closest('div').find('.required-field-error-message').remove();
		},

		/*
		 * Renders the error notification message specified in the form element's "data-validation-message" attribute.
		 */
		errorNotification = function ($fieldWithError) {
			var $closestDiv = $fieldWithError.closest('div');
			var errorMessage = $fieldWithError.attr('data-validation-message');
			if ($closestDiv.find('.required-field-error-message').length === 0)
				$closestDiv.append('<div class="required-field-error-message">' + errorMessage + '</div>');
		},

		/*
		 * Reads for form data and hydrates the formData model.
		 */
		readForm = function () {
			var formData = {
				isResident: $isResidentField.length ? getRadioButtonValue($isResidentField) == 'true' : isResident,
				isPublicAssistance: $isPublicAssistanceField.length ? getRadioButtonValue($isPublicAssistanceField) == 'true' : isPublicAssistance,
				isCatPitBull: $isCatPitBullField.length ? getRadioButtonValue($isCatPitBullField) == 'true' : isCatPitBull,
				zipCode: $zipCodeField.length ? $zipCodeField.val() : zipCode,
			};

			setupValidation($spayNeuterForm);

			return formData;
		},

		/*
		 * Pulls Radio Button value safely.
		 */
		getRadioButtonValue = function ($radioButton) {
			if ($radioButton.length === 0)
				return undefined;

			var $selectedRadioButton = $radioButton.filter(':checked');

			if ($selectedRadioButton.length > 0) {
				return $selectedRadioButton.val();
			}

			return undefined;
		},

		/*
		 * Determines the fee for the procedure.
		 */
		determineCost = function (formData, isDundalkZip, isSwapZip) {
			if (!formData)
				return undefined;

			var cost;

			if (formData.isResident) {
				cost = 20;

				if (formData.isPublicAssistance) {
					cost = formData.isCatPitBull || isDundalkZip || isSwapZip ? 0 : 20;
				} else {
					cost = isDundalkZip || isSwapZip ? 0 : 20;
				}
			}

			return cost;
		},

		/*
		 * Selects the facility based on cost and ZIP code.
		 */
		facilityPicker = function (cost, isPublicAssistance, isDundalkZip, isSwapZip) {
			var facilityArr = [];

			if (typeof cost === 'undefined')
				return facilityArr;

			if (isDundalkZip) {
				facilityArr.push(facilityList.dundalk);
				return facilityArr;
			}

			if (isSwapZip) {
				facilityArr.push(facilityList.swap);
				return facilityArr;
			}

			if (cost === 20 || (cost === 0 && isPublicAssistance)) {
				facilityArr.push(facilityList.baldwin);
				facilityArr.push(facilityList.dundalk);
				facilityArr.push(facilityList.swap);
				return facilityArr;
			}

			return facilityArr;
		},

		/*
		 * Builds the HTML for the discount message.
		 */
		buildDiscountMessageHTML = function (facilities, cost) {
			if (typeof cost === 'undefined')
				return '<div class="alert-warning"><p>We\'re sorry. Only County residents are eligible for discount spay or neuter procedures.</p></div>';

			if (facilities.length === 1 && facilities[0] === facilityList.dundalk)
				return '<div class="alert-success"><p>Good news! You\'re eligible for a <strong>free procedure</strong> at our Dundalk facility at 7702 Dunmanway.</p></div>';

			if (facilities.length === 1 && facilities[0] === facilityList.swap)
				return '<div class="alert-success"><p>Good news! You\'re eligible for a <strong>free procedure</strong> at our Southwest Area Park facility at 3941 Klunk Drive.</p></div>';

			if (cost === 0)
				return '<div class="alert-success"><p>Good news! You\'re eligible for a <strong>free procedure</strong> at any of our facilities. Select a location to book your appointment.</p></div>';

			return '<div class="alert-success"><p>Good news! You\'re eligible for a <strong>$20 procedure</strong> at any of our facilities. Select a location to book your appointment. Make sure to continue to the payment screen after you book.</p></div>';
		},

		/*
		 * Builds the HTML for the facility message.
		 */
		buildFacilityListHTML = function (facilities) {
			if (!facilities || facilities.length === 0)
				return '';

			var facilityHTML = '';
			facilityHTML += '<ul>';

			if (facilities.length === 1)
				facilityHTML += '<li><a href="' + facilities[0].link + '">Book Now at ' + facilities[0].address.split(',')[0] + '</a></li>';

			if (facilities.length === 3)
				for (var i = 0; i < facilities.length; i++)
					facilityHTML += '<li><a href="' + facilities[i].link + '">' + facilities[i].address + '</a></li>';

			facilityHTML += '</ul>';

			return facilityHTML;
		},

		/*
		 * Pulls everything together, and calculated the procedure cost and locations.
		 */
		calculate = function () {
			var formData = readForm();
			var isDundalkZip = zipsDundalk.indexOf(formData.zipCode) > -1;
			var isSwapZip = zipsSwap.indexOf(formData.zipCode) > -1;
			var cost = determineCost(formData, isDundalkZip, isSwapZip);
			var facilities = facilityPicker(cost, formData.isPublicAssistance, isDundalkZip, isSwapZip);
			var discountMessageHTML = buildDiscountMessageHTML(facilities, cost);
			var facilityListHTML = buildFacilityListHTML(facilities);

			if (isValid()) {
				$('#spayNeuterFormResults').html(discountMessageHTML + facilityListHTML);
				$('#spayNeuterFormResults').removeClass('hidden');
				$('html, body').animate({
					scrollTop: $("#spayNeuterFormResults").offset().top
				}, 1000);
				return true;
			}
			return false;
		};

	return {
		/* test-code */
		determineCost: determineCost,
		facilityPicker: facilityPicker,
		buildDiscountMessageHTML: buildDiscountMessageHTML,
		buildFacilityListHTML: buildFacilityListHTML,
		/* end-test-code */
		calculate: calculate
	};

})(jQuery);

/*
 * Attach the module to the form's submit button, and kill the enter button.
 */
$(function () {
	$('#spayNeuterForm, #spayNeuterForm input').on('keyup keypress', function (e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode === 13) {
			e.preventDefault();
			return false;
		}
	});

	$('#spayNeuterFormButton').on('click', function (e) {
		baltimoreCounty.pageSpecific.spayNeuterCalculator.calculate();
		return false;
	});
});