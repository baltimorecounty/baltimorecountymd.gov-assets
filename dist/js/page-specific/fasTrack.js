namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.fasTrack = (function($, undefined) {
	'use strict';

	var self = this,
	
		/**
		 * Determines based on ID format if this is a FasTrack ID.
		 */
		isFasTrack = function(input) {
			var fasTrackRegex = /^ex\d+$/i;
			return fasTrackRegex.test(input);
		},

		/**
		 * Determined based on ID format if this is a CitySourced ID.
		 */
		isCitySourced = function(input) {		
			var citySourcedRegex = /^\d+$/;
			return citySourcedRegex.test(input);
		},

		/**
		 * Submits form data to FasTrack.
		 */
		submitToFasTrack = function($form) {
			//var _appServer = 'http://localhost:50851/ECMS/',
			//var _appServer = 'http://dprmmstr-dev.co.ba.md.us/ECMS/',
			//var _appServer = 'http://dprmmaster.co.ba.md.us/ECMS/',
			var _appServer = 'http://egov.baltimorecountymd.gov/ECMS/',
				dataString = $form.serialize();

			$.ajax({
				url: _appServer + 'Intake/Login',
				data: dataString,
				type: "GET",
				dataType: "jsonp",
				async: false
			})
			.done(function(data) {
				formatJsonpResult(data);
			})
			.fail(function(error) {

			});
		},

		/**
		 * Formats the response from the AJAX call. Move to promise to avoid race condition?
		 */
		formatJsonpResult = function(jsonpResult) {
			var errorCounter = 0;

			if (jsonpResult.ResponseStatus == 1) {
				var url = '/iwant/getstatus.html?correspondenceId=' + jsonpResult.ResponseError;
				$(window.location).attr('href', url);
			} else {
				// bug # 2127
				// pop-up instead of a red error
				//$('#errorDiv').html(jsonpResult.ResponseError);
				// not sure why but this is getting called twice,
				// there is a bug I think in jQuery for this.  For now work-around is set counter to 2
				var errorMsg = "";            
				if (errorCounter == 0) {
					errorMsg = "The information you have entered is incorrect. Please verify that the " +
						" tracking number and email address you have entered are correct.";
					errorCounter += 1;
					alert(errorMsg);
					
				}
				else {
					errorMsg = " The information you have entered is incorrect. Please call" +
						" 410-887-2450 to verify your tracking number."
					alert(errorMsg);
				}
			}
		},

		testAndProceed = function(testFunction, testParameter, successCallback, failureCallback) {		
			if (testFunction(testParameter))
				successCallback();
			else 
				failureCallback();
		},

		/**
		 * The "submit" event handler for the "Track Now" button.
		 */
		submitHandler = function(event) {
			var $form = $('#FasTrack'),
				$TrackingNumber = $('#TrackingNumber'),
				trackingNumber = $TrackingNumber.val();

			testAndProceed(isCitySourced, trackingNumber, 
				function() {
					window.location = '/citysourced/preview/viewer?reportId=' + trackingNumber;
				},
				function() {
					testAndProceed(isFasTrack, trackingNumber, 
						function() {
							submitToFasTrack($form);
						},
						function() {
							alert("We're having trouble looking up this record. Please call 410-887-2450 to verify your tracking number.");
						});
				});
		};

	return {
		submitHandler: submitHandler
	};

})(jQuery);

$(function() {
	$('#Submit').on('click', baltimoreCounty.pageSpecific.fasTrack.submitHandler);
});