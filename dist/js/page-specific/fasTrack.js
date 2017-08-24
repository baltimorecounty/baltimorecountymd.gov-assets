namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.fasTrack = (function fasTrack($) {
	'use strict';

	var trackingCodeTests = [{
		type: 'accela',
		pattern: /^(ACCMP|CC|CRH|CS|PP|TS|CE|CP|CB|CG)\d+$/i,
		action: function action() {
			window.location = 'https://citizenaccess.baltimorecountymd.gov/CitizenAccess/';
		}
	}, {
		type: 'baltcogo',
		pattern: /^\d+$/i,
		action: function action(trackingNumber) {
			window.location = '/baltcogo/viewer?reportId=' + trackingNumber;
		}
	}, {
		type: 'fastrack',
		pattern: /^ex\d+$/i,
		action: function action(trackingNumber, $form) {
			submitToFasTrack($form);
		}
	}];

	/**
	 * Submits form data to FasTrack.
	 */
	var submitToFasTrack = function submitToFasTrack($form) {
		var appServer = 'http://egov.baltimorecountymd.gov/ECMS/';
		var dataString = $form.serialize();

		$.ajax({
			url: appServer + 'Intake/Login',
			data: dataString,
			type: 'GET',
			dataType: 'jsonp',
			async: false
		})
			.done(function done(data) {
				formatJsonpResult(data);
			})
			.fail(function fail(error) {
				console.error(error);
			});
	};

	/**
	 * Formats the response from the AJAX call. Move to promise to avoid race condition?
	 */
	var formatJsonpResult = function formatJsonpResult(jsonpResult) {
		var errorCounter = 0;

		if (jsonpResult.ResponseStatus === 1) {
			var url = 'getstatus.html?correspondenceId=' + jsonpResult.ResponseError;
			$(window.location).attr('href', url);
		} else {
			// bug # 2127
			// pop-up instead of a red error
			// $('#errorDiv').html(jsonpResult.ResponseError);
			// not sure why but this is getting called twice,
			// there is a bug I think in jQuery for this.  For now work-around is set counter to 2
			var errorMsg = '';
			if (errorCounter === 0) {
				errorMsg = 'The information you have entered is incorrect. Please verify that the ' +
					' tracking number and email address you have entered are correct.';
				errorCounter += 1;
				alert(errorMsg);
			} else {
				errorMsg = ' The information you have entered is incorrect. Please call' +
					' 410-887-2450 to verify your tracking number.';
				alert(errorMsg);
			}
		}
	};

	/**
	 * The "submit" event handler for the "Track Now" button.
	 */
	var submitHandler = function submitHandler() {
		var $form = $('#FasTrack');
		var $TrackingNumber = $('#TrackingNumber');
		var trackingNumber = $TrackingNumber.val();
		var isSuccess = false;

		$.each(trackingCodeTests, function eachTrackingCodeTests(index, trackingCodeTest) {
			if (trackingCodeTest.pattern.test(trackingNumber)) {
				isSuccess = true;
				trackingCodeTest.action(trackingNumber, $form);
			}
		});

		if (!isSuccess) {
			alert("We're having trouble looking up this record. Please call 410-887-2450 to verify your tracking number.");
		}
	};

	return {
		submitHandler: submitHandler
	};
}(jQuery));

$(function submitHandler() {
	$('#Submit').on('click', baltimoreCounty.pageSpecific.fasTrack.submitHandler);
});
