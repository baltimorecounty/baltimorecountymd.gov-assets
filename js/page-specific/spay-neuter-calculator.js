namespacer('baltimoreCounty.pageSpecific');

/*
 * Spaying and Neutering calculator module.
 * Used on http://www.baltimorecountymd.gov/Agencies/health/animalservices/spayneuter.html
 */
baltimoreCounty.pageSpecific.spayNeuterCalculator = (function spayNeuterCalculator($) {
	'use strict';

	var zipsDundalk = [];
	var zipsSwap = [];
	var facilityList = {
		baldwin: {
			address: 'Baldwin, 13800 Manor Road',
			link: 'https://clinichq.com/online/564cf872-6f61-476f-8ecd-61d574a8a06f'
		},
		dundalk: {
			address: 'Dundalk, 7702 Dunmanway',
			link: 'https://clinichq.com/online/144afb8f-6c15-4f15-8e16-9417a4f85823'
		},
		swap: {
			address: 'Southwest Area Park, 3941 Klunk Drive',
			link: 'https://clinichq.com/online/3edba5a4-9922-4e2a-87a5-c138c8e8f4a8'
		}
	};
	var $spayNeuterForm = $('#spayNeuterForm');
	var $spayNeuterFormInputElements = $('#spayNeuterForm input');
	var $residentField = $('#spayNeuterForm input[name=isBaltimoreCountyResident]');
	var $publicAssistanceField = $('#spayNeuterForm input[name=isPublicAssistance]');
	var $catPitBullField = $('#spayNeuterForm input[name=isCatPitBull]');
	var $zipCodeField = $('#spayNeuterForm #zipCode');
	var $spayNeuterFormButton = $('#spayNeuterFormButton');
	var $spayNeuterFormResults = $('#spayNeuterFormResults');
	var isResident = false;
	var isPublicAssistance = false;
	var isCatPitBull = false;
	var isCat = false;
	var zipCode = '';
	var textInputValidationRegExp = /^\d{5}$/;

	/*
		* Form validation!
		*/
	var isValid = function isValid() {
		var validationErrorFlag = false;

		if ($zipCodeField.is(':visible') && !baltimoreCounty.utility.formValidator.requiredFieldPatternValidator($zipCodeField, textInputValidationRegExp)) {
			errorNotification($zipCodeField);
			validationErrorFlag = true;
		}

		return !validationErrorFlag;
	};

	/*
		* Attaches validation to form field events so we can vlidate on the fly.
		*/
	var setupValidation = function setupValidation($form) {
		var $formInputs = $form.find('input');

		for (var i = 0; i < $formInputs.length; i += 1) {
			var $input = $($formInputs[i]);
			var inputType = $input.attr('type');

			switch (inputType) {
			case 'radio':
				// $input.on('click', validationClickHandler);
				break;
			case 'text':
				$input.on('keyup', validationKeyupHandler);
				break;
			default:
				break;
			}
		}
	};

	/**
	 * Handles the input "click" validation events.
	 */
	var validationClickHandler = function validationClickHandler(e) {
		var $current = $(e.target);
		if (baltimoreCounty.utility.formValidator.requiredFieldRadioValidator($current)) {
			clearErrorNotification($current);
		} else {
			errorNotification($current);
		}
	};

	/**
	 * Handles the input "keyup" validation events.
	 */
	var validationKeyupHandler = function validationKeyupHandler(e) {
		var $current = $(e.target);
		if (baltimoreCounty.utility.formValidator.requiredFieldPatternValidator($current, textInputValidationRegExp)) { // eslint-disable-line max-len
			clearErrorNotification($current);
		} else {
			errorNotification($current);
		}
	};

	/*
		* Removes the error notification message.
		*/
	var clearErrorNotification = function clearErrorNotification($fieldWithError) {
		$fieldWithError.closest('div').find('.required-field-error-message').remove();
	};

	/*
		* Renders the error notification message specified in the
		form element's "data-validation-message" attribute.
		*/
	var errorNotification = function errorNotification($fieldWithError) {
		var $closestDiv = $fieldWithError.closest('div');
		var errorMessage = $fieldWithError.attr('data-validation-message');
		if ($closestDiv.find('.required-field-error-message').length === 0) { $closestDiv.append('<div class="required-field-error-message">' + errorMessage + '</div>'); }
	};

	/*
		* Reads for form data and hydrates the formData model.
		*/
	var readForm = function readForm() {
		var formData = {
			isResident: $residentField.length ? getRadioButtonValue($residentField) : isResident,
			isPublicAssistance: $publicAssistanceField.length ?
				getRadioButtonValue($publicAssistanceField) : isPublicAssistance,
			isCatPitBull: $catPitBullField.length ? getRadioButtonValue($catPitBullField) : isCatPitBull,
			zipCode: $zipCodeField.length ? $zipCodeField.val() : zipCode
		};

		setupValidation($spayNeuterForm);

		return formData;
	};

	/*
		* Pulls Radio Button value safely.
		*/
	var getRadioButtonValue = function getRadioButtonValue($radioButton) {
		var YES_RADIO_INDEX = 0;

		if ($radioButton.length === 0) { return undefined; }

		var $selectedRadioButton = $radioButton.filter(':checked');

		return $radioButton.eq(YES_RADIO_INDEX).is($selectedRadioButton);
	};

	/*
		* Determines the fee for the procedure.
		*/
	var determineCost = function determineCost(formData, isDundalkZip, isSwapZip) {
		if (!formData) { return undefined; }

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
	};

	/*
		* Selects the facility based on cost and ZIP code.
		*/
	var facilityPicker = function facilityPicker(cost, isPublicAssistance, isDundalkZip, isSwapZip) {
		var facilityArr = [];

		if (typeof cost === 'undefined') { return facilityArr; }

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
	};

	/*
		* Builds the HTML for the discount message.
		*/
	var buildDiscountMessageHTML = function buildDiscountMessageHTML(facilities, cost) {
		if (typeof cost === 'undefined') { return '<p>We\'re sorry. Only County residents are eligible for discount spay or neuter procedures.</p>'; }

		if (facilities.length === 1 && facilities[0] === facilityList.dundalk) { return '<p>Good news! You\'re eligible for a <strong>free procedure</strong> at our Dundalk facility at 7702 Dunmanway.</p>'; }

		if (facilities.length === 1 && facilities[0] === facilityList.swap) { return '<p>Good news! You\'re eligible for a <strong>free procedure</strong> at our Southwest Area Park facility at 3941 Klunk Drive.</p>'; }

		if (cost === 0) { return '<p>Good news! You\'re eligible for a <strong>free procedure</strong> at any of our facilities. Select a location to book your appointment.</p>'; }

		return '<p>Good news! You\'re eligible for a <strong>$20 procedure</strong> at any of our facilities. Select a location to book your appointment. Make sure to continue to the payment screen after you book.</p>';
	};

	/*
		* Builds the HTML for the facility message.
		*/
	var buildFacilityListHTML = function buildFacilityListHTML(facilities) {
		if (!facilities || facilities.length === 0) { return ''; }

		var facilityHTML = '';
		facilityHTML += '<ul>';

		if (facilities.length === 1) { facilityHTML += '<li><a href="' + facilities[0].link + '">Book Now at ' + facilities[0].address.split(',')[0] + '</a></li>'; }

		if (facilities.length === 3) {
			for (var i = 0; i < facilities.length; i++) { facilityHTML += '<li><a href="' + facilities[i].link + '">' + facilities[i].address + '</a></li>'; }
		}

		facilityHTML += '</ul>';

		return facilityHTML;
	};

	/*
		* Pulls everything together, and calculated the procedure cost and locations.
		*/
	var calculate = function calculate() {
		var formData = readForm();
		var isDundalkZip = zipsDundalk.indexOf(formData.zipCode) > -1;
		var isSwapZip = zipsSwap.indexOf(formData.zipCode) > -1;
		var cost = determineCost(formData, isDundalkZip, isSwapZip);
		var facilities = facilityPicker(cost, formData.isPublicAssistance, isDundalkZip, isSwapZip);
		var discountMessageHTML = buildDiscountMessageHTML(facilities, cost);
		var facilityListHTML = buildFacilityListHTML(facilities);

		if (isValid()) { displayResults(discountMessageHTML, facilityListHTML); }
	};

	/**
	 * Displays the final judgement of the calculator.
	 */
	var displayResults = function displayResults(discountMessageHTML, facilityListHTML) {
		$spayNeuterFormResults.removeClass('alert-success alert-warning');
		$spayNeuterFormResults.addClass(facilityListHTML ? 'alert-success' : 'alert-warning').attr('role', 'alert');
		$spayNeuterFormResults.html(discountMessageHTML + facilityListHTML);
		$spayNeuterFormResults.attr('aria-hidden', false);

		setVisibility($spayNeuterFormResults, false);

		$('html, body').animate({
			scrollTop: $spayNeuterFormResults.offset().top
		}, 1000);
	};

	/**
	 * Sets the visibility of the target, and fires a callback when done.
	 */
	var setVisibility = function setVisibility($target, shouldHide, callback) {
		var ANIMATION_DURATION = 300;
		var visibilityFilterSelector = shouldHide ? ':hidden' : ':visible';
		var $formControlWrapper = $target.closest('.bc-form-control');

		if ($formControlWrapper.is(visibilityFilterSelector)) {
			if (callback && typeof callback === 'function') {
				callback();
			}
			return;
		}

		$formControlWrapper.attr('aria-hidden', shouldHide);

		if (shouldHide) {
			$formControlWrapper.fadeOut(ANIMATION_DURATION, callback);
		} else {
			$formControlWrapper.fadeIn(ANIMATION_DURATION, callback);
		}
	};

	/**
	 * Clears all hidden form elements, so they're not already filled out when they're revealed.
	 * This is really just a safeguard for anyone who gets click-happy.
	 */
	var clearEverythingOnTheFormAfterThis = function clearEverythingOnTheFormAfterThis($target) {
		var targetIndex = $spayNeuterFormInputElements.index($target);

		$spayNeuterFormInputElements.map(function mapElms(index, item) {
			var $item = $(item);

			if ($spayNeuterFormInputElements.index(item) > targetIndex) {
				$item.val('').removeAttr('checked');
			}
		});
	};

	/**
	 * Event binding.
	 */
	var init = function init() {
		var YES_RADIO_INDEX = 0;
		var NO_RADIO_INDEX = 1;

		/* eslint-disable */

		$residentField.eq(YES_RADIO_INDEX).on('click', function (event) {
			clearEverythingOnTheFormAfterThis(event.target);
			setVisibility($spayNeuterFormResults, true, function () {
				setVisibility($spayNeuterFormButton, true, function () {
					setVisibility($zipCodeField, true, function () {
						setVisibility($catPitBullField, true, function () {
							setVisibility($publicAssistanceField, false);
						});
					});
				});
			});
		});
		$residentField.eq(NO_RADIO_INDEX).on('click', function (event) {
			clearEverythingOnTheFormAfterThis(event.target);
			setVisibility($spayNeuterFormResults, true, function () {
				setVisibility($spayNeuterFormButton, true, function () {
					setVisibility($zipCodeField, true, function () {
						setVisibility($catPitBullField, true, function () {
							setVisibility($publicAssistanceField, true, function () {
								calculate();
							});
						});
					});
				});
			});
		});
		$publicAssistanceField.eq(YES_RADIO_INDEX).on('click', function (event) {
			clearEverythingOnTheFormAfterThis(event.target);
			setVisibility($spayNeuterFormResults, true, function () {
				setVisibility($spayNeuterFormButton, true, function () {
					setVisibility($zipCodeField, true, function () {
						setVisibility($catPitBullField, false);
					});
				});
			});
		});
		$publicAssistanceField.eq(NO_RADIO_INDEX).on('click', function (event) {
			clearEverythingOnTheFormAfterThis(event.target);
			setVisibility($spayNeuterFormResults, true, function () {
				setVisibility($zipCodeField, false, function () {
					setVisibility($spayNeuterFormButton, false, function () {
						setVisibility($catPitBullField, true);
					});
				});
			});
		});
		$catPitBullField.eq(YES_RADIO_INDEX).on('click', function (event) {
			clearEverythingOnTheFormAfterThis(event.target);
			setVisibility($spayNeuterFormResults, true, function () {
				setVisibility($spayNeuterFormButton, true, function () {
					setVisibility($zipCodeField, true, function () {
						calculate();
					});
				});
			});
		});
		$catPitBullField.eq(NO_RADIO_INDEX).on('click', function () {
			setVisibility($spayNeuterFormResults, true, function () {
				setVisibility($zipCodeField, false, function () {
					setVisibility($spayNeuterFormButton, false);
				});
			});
		});

		/* eslint-enable  */

		$spayNeuterFormButton.on('click', function onBtnClick() {
			calculate();
		});
	};

	return {
		/* test-code */
		determineCost: determineCost,
		facilityPicker: facilityPicker,
		buildDiscountMessageHTML: buildDiscountMessageHTML,
		buildFacilityListHTML: buildFacilityListHTML,
		/* end-test-code */
		init: init
	};
}(jQuery));

/*
 * Attach the module to the form's submit button, and kill the enter button.
 */
$(function onPageReady() {
	$('#spayNeuterForm, #spayNeuterForm input').on('keyup keypress', function onKeyPress(e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode === 13) {
			e.preventDefault();
			return false;
		}
	});

	baltimoreCounty.pageSpecific.spayNeuterCalculator.init();
});
