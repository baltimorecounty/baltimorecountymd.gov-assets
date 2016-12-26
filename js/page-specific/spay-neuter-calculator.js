namespacer('baltimoreCounty.calculators');

/*
 * Spaying and Neutering calculator module.
 * Used on http://www.baltimorecountymd.gov/Agencies/health/animalservices/spayneuter.html
 */
baltimoreCounty.calculators.spayNeuter = (function($) {
	'use strict';

	var zipsDundalk = ['21219', '21220', '21221', '21222', '21224', '21237'],
		zipsSwap = ['21207', '21227', '21244'],
		facilityDundalk = 'Dundalk, 7702 Dunmanway',
		facilitySwap = 'Southwest Area Park, 3941 Klunk Drive',
		facilityBaldwin = 'Baldwin, 13800 Manor Road',
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

			if (cost === 20 || (cost === 0 && isPublicAssistance)) {
				facilityArr.push(facilityBaldwin);
				facilityArr.push(facilityDundalk);
				facilityArr.push(facilitySwap);
				return facilityArr;
			}

			if (isDundalkZip) {
				facilityArr.push(facilityDundalk);
				return facilityArr;
			}
			
			if (isSwapZip) {
				facilityArr.push(facilitySwap);
				return facilityArr;
			}
			
			return facilityArr;
		},

		buildMessage = function(facilities, cost) {
			if (typeof cost === 'undefined')
				return '<p>Unfortunately, you are not eligible to have your pet spayed or neutered at a Baltimore County facility.<p>';

			var message = '';
				message += '<p><strong>Congratulations!</strong> You qualify for a fee discount.</p>';
				message += '<p>The fee for you to spay or neuter your pet will be:</p>';
				message += '<p>$' + cost + '</p>';
				message += '<p>This rate is applicable only at the following location(s):</p>'
				message += '<ul>';
			
			for (var i = 0; i < facilities.length; i++) {
				message += '<li>' + facilities[i] + '</li>';
			}

			message += '</ul>';

			return message;
		},
		
		calculate = function() {
			var formData = readForm();
			var isDundalkZip = checkZipCode(formData.zipCode, zipsDundalk);
			var isSwapZip = checkZipCode(formData.zipCode, zipsSwap);
			var cost = determineCost(formData, isDundalkZip, isSwapZip);
			var facilities = facilityPicker(cost, formData.isPublicAssistance, isDundalkZip, isSwapZip);
			$('#spayNeuterFormResults').html(buildMessage(facilities, cost));
		};

	return {
		/* test-code */
		determineCost: determineCost,
		facilityPicker: facilityPicker,
		buildMessage: buildMessage,
		/* end-test-code */
		calculate: calculate
	};

})(jQuery);

/*
 * Attach the module to the form's submit button.
 */
(function($)  {
	'use strict';

	$('#spayNeuterFormButton').on('click', baltimoreCounty.calculators.spayNeuter.calculate);
})(jQuery);