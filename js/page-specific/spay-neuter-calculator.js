namespacer('baltimoreCounty.calculators');

/*
 * Spaying and Neutering calculator module.
 * Used on http://www.baltimorecountymd.gov/Agencies/health/animalservices/spayneuter.html
 */
baltimoreCounty.calculators.spayNeuter = (function($) {
	'use strict';

	var zipsDundalk = ['21219', '21220', '21221', '21222', '21224', '21237'],
		zipsSwap = ['21207', '21227', '21244'],
		facilityList = {
			baldwin : {
				address : 'Baldwin, 13800 Manor Road',
				link : 'https://clinichq.org/online/564cf872-6f61-476f-8ecd-61d574a8a06f'
			},
			dundalk : {
				address : 'Dundalk, 7702 Dunmanway',
				link : 'https://clinichq.org/online/144afb8f-6c15-4f15-8e16-9417a4f85823'
			},
			swap : {
				address : 'Southwest Area Park, 3941 Klunk Drive',
				link : 'https://clinichq.org/online/3edba5a4-9922-4e2a-87a5-c138c8e8f4a8'
			}
		},
		$isResidentField = $('#spayNeuterForm #isBaltimoreCountyResident'),
		$isPublicAssistanceField = $('#spayNeuterForm #isPublicAssistance'),
		$isCatPitBullField = $('#spayNeuterForm #isCatPitBull'),
		$zipCodeField = $('#spayNeuterForm #zipCode'),
		isResident = false, 
		isPublicAssistance = false, 
		isCatPitBull = false, 
		zipCode = '',
		isDundalkZip = false,
		isSwapZip = false,

		readForm = function() {
			var formData = {
				isResident: $isResidentField.length ? $isResidentField.is(':checked') : isResident,
				isPublicAssistance: $isPublicAssistanceField.length ? $isPublicAssistanceField.is(':checked') : isPublicAssistance,
				isCatPitBull: $isCatPitBullField.length ? $isCatPitBullField.is(':checked') : isCatPitBull,
				zipCode: $zipCodeField.length ? $zipCodeField.val() : zipCode,
			};

			return formData;
		},		

		checkZipCode = function(zip, zipArrToMatch) {
			return zipArrToMatch.indexOf(zip) > -1;
		},

		determineCost = function(formData, isDundalkZip, isSwapZip) {
			if (!formData)
				return undefined; 

			if (formData.isResident) {
				var cost = 20;			

				if (formData.isPublicAssistance) {
					cost = formData.isCatPitBull || isDundalkZip || isSwapZip ? 0 : 20;
				} else {
					cost = isDundalkZip || isSwapZip ? 0 : 20;
				}		
			}

			return cost;
		},
		
		facilityPicker = function(cost, isPublicAssistance, isDundalkZip, isSwapZip) {
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

		buildDiscountMessageHTML = function(facilities, cost) {
			if (typeof cost === 'undefined')
				return '<p>We\'re sorry. Only County residents are eligible for discount spay or neuter procedures.<p>';

			if (facilities.length === 1 && facilities[0] === facilityList.dundalk) 
				return '<p>Good news! You\'re eligible for a <strong>free procedure</strong> at our Dundalk facility at 7702 Dunmanway.</p>';
			
			if (facilities.length === 1 && facilities[0] === facilityList.swap) 
				return '<p>Good news! You\'re eligible for a <strong>free procedure</strong> at our Southwest Area Park facility at 3941 Klunk Drive.</p>';
			
			if (cost === 0)
				return '<p>Good news! You\'re eligible for a <strong>free procedure</strong> at any of our facilities. Select a location to book your appointment.</p>'

			return '<p>Good news! You\'re eligible for a <strong>$20 procedure</strong> at any of our facilities. Select a location to book your appointment. Make sure to continue to the payment screen after you book.</p>';
		},
		
		buildFacilityListHTML = function(facilities) {			
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

		calculate = function() {
			var formData = readForm();
			var isDundalkZip = checkZipCode(formData.zipCode, zipsDundalk);
			var isSwapZip = checkZipCode(formData.zipCode, zipsSwap);
			var cost = determineCost(formData, isDundalkZip, isSwapZip);
			var facilities = facilityPicker(cost, formData.isPublicAssistance, isDundalkZip, isSwapZip);
			var discountMessageHTML = buildDiscountMessageHTML(facilities, cost);
			var facilityListHTML = buildFacilityListHTML(facilities);

			$('#spayNeuterFormResults').html(discountMessageHTML + facilityListHTML);
			$('#spayNeuterFormResults').removeClass('hidden');
			$('html, body').animate({scrollTop: $("#spayNeuterFormResults").offset().top}, 1000);
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
 * Attach the module to the form's submit button.
 */
$(function() { $('#spayNeuterFormButton').on('click', baltimoreCounty.calculators.spayNeuter.calculate); });