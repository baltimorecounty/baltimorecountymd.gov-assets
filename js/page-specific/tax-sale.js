var form_element_container;
var prev_text;
var next_text;
var isIE8orBelow = document.all && !document.addEventListener;
var appServer = "http://egov.baltimorecountymd.gov/TaxSale/";
//var appServer = "http://localhost:1234/";
var resultsPage = "http://resources.baltimorecountymd.gov/Confirmations/Confirmationtaxsale.html";
//var form_element = $('div.taxStep div.seform table table tr td fieldset');
//Will check to determine if enable button should be clickable
//Also enables submit

var validationObj = null;
var CssEnableNext = function (step) {
    if (step === true) {
        $('#next').removeAttr('disabled');
        return true;
    } else {
        $('#next').attr('disabled', 'disabled');
        return false;
    }
};

function enableNextButton() {
    var proceed = {
        step1: false,
        step2: false,
        step3: false,
        step4: false
    };

    proceed.step1 = $(BcValidation.settings.step1.form.selector).valid();
    proceed.step2 = $(BcValidation.settings.step2.form.selector).valid();
    proceed.step3 = $(BcValidation.settings.step3.form.selector).valid();
    proceed.step4 = $(BcValidation.settings.step4.form.selector).valid();

    $('#next').attr('disabled', 'disabled');
    $('#submit').attr('disabled', 'disabled');

    var s = BcValidation.settings;


    //swtich to a case stament once i figure this out
    if ($(s.step1.form.selector).is(':visible')) {
        CssEnableNext(proceed.step1);
    }
    if ($(s.step2.form.selector).is(':visible')) {
        CssEnableNext(proceed.step2);
    }
    if ($(s.step3.form.selector).is(':visible')) {
        CssEnableNext(proceed.step3);
    }
    if ($(s.step4.form.selector).is(':visible')) {
        var showSubmit = CssEnableNext(proceed.step4);
        if (showSubmit === true) {
            $('#submit').removeAttr('disabled');
        }
    }
}
//Hides or shows next or previous buttons based on where the progress bar is at
//text = text of next or previous element
//type = prev or next

function hideButton(text, type) {
    var selector;
    if (type == 'prev') {
        selector = 'first';
    } else {
        selector = 'last';
    }
    var pb_item_text = $('ul.progress-menu li:' + selector + ' p').text();
    if (text == pb_item_text) {
        $('#' + type + '').hide();
        if (type == 'next') {
            $('#submit').show().attr('disabled', 'disabled');
        }
    } else {
        $('#' + type + '').show();
    }
}

//Gets a unique token from our servers for the form
function getToken() {
    $.ajax({
        type: "GET",
        url: appServer + "Intake/GetToken",
        contentType: "application/json; charset=utf-8",
        data: '{}',
        dataType: "jsonp",
        jsonpCallback: "updateToken",
        success: function (response) {},
        error: function (msg) {
            alert("Error: " + msg.d);
        }
    });
}
//JsonpCallback function for getToken
function updateToken(jsonpResult) {
    $('p.tax-sale').html(jsonpResult);
}

//Puts in values of unfilled radio buttons for form serialization
function fillEmptyRadios() {
    if ($('input[name=MarylandEntity]:checked').length == 0) {
			$('input[name=MarylandEntity][value=No]').attr('checked', 'checked');
		}
		if ($('input[name=InGoodStanding]:checked').length == 0) {
			$('input[name=InGoodStanding][value=No]').attr('checked', 'checked');
		}
}


//Processing we need to do when we want to submit the form
function bindSubmit() {
    var formData;
    $(document).on('click', '#submit',function () {

        //Makes sure mdentity and ingoodstanding show up in the querystring
        fillEmptyRadios();

        //Add token to query string
        formData = "token=" + $('p.tax-sale').text() + "&";
		
		$('input[name=BusinessType]').attr('disabled','');
		
        //Loop through the entire form for input boxes
        $('div.taxStep form').each(function () {
            formData += $('input[type!=hidden]', this).serialize() + "&";
        });
		
		
		$('input[name=BusinessType]').attr('disabled','disabled');
		
        //Make sure selects are serialized
        formData += $('div.taxStep select').serialize();
        var moreinfo = '';
        //Include things that are not checked
        $('input[type=checkbox]').each(function () {
            if (!this.checked) {
                formData += '&' + this.name + '=0';
            }
        });
        //For testing locally
        //formData = $('#data').val();
        $.ajax({
            type: "GET",
            url: appServer + "Intake/SubmitForm",
            contentType: "application/json; charset=utf-8",
            data: formData,
            dataType: "jsonp",
            jsonpCallback: "SumbitFormResult",
            success: function (response) {
                //alert(response.d);
            },
            error: function (msg) {
                //alert("Error: " + msg.d);
            }
        });
    });
}
//Callback funciton for submitForm();
//Redirects user to confirmation page based on the status returned by submitForm()
function SumbitFormResult(jsonpResult) {
    var status = jsonpResult.ResponseStatus;
    //If status == 1, error is actually the registration id.
    var error = jsonpResult.ResponseError;
    var resultLink = resultsPage + "?status=" + status;
    if (status == 1) {
        resultLink += "&regId=" + error;
    }
    window.location = resultLink;
}


$(document).ready(function () {
    //Enable Cross site scripting
    $.support.cors = true;

    //Hide the last hr because it looks funky
    $('hr:last').hide();


    //Enable our custom validation
    BcValidation.init();


    //Get Token
    getToken();

    //Show the I am registering as inputs so we can choose one
    $('div.taxStep.first div.seform fieldset table:lt(2)').show();
    form_element_container = $('div.taxStep');

    //Create the menu based on the sections of the form
    //Needs ul with a class of progress-menu
    $(form_element_container).each(function () {
        $('ul.progress-menu').append('<li><p><span>' + $('legend:first', this).text() + '</span></p></li>');
    });

    //Add this class to change the background image
    $('ul.progress-menu li:first p').addClass('first active bold');


    //Adjust the padding on the labels for progress-bar to center vertically
    var label_height;
    $('ul.progress-menu li p:not(.first)').each(function () {
        label_height = $('span', this).height();
        if (label_height >= 20 && label_height < 40) {
            $('span', this).css('padding-top', '10%');
        } else if (label_height >= 40) {
            $('span', this).css('padding-top', '8%');
        }
    });

    //Determine what happens when progress bar is clikced
    $(document).on('click', 'ul.progress-menu li',function () {
        if ($('p', this).hasClass('active') || $('p', this).hasClass('completed') || $('div.taxStep:visible form').valid()) {
            $('#submit').hide();

            //Hide all the different forms
            $(form_element_container).hide();

            //Show the form for the selected progress-menu item
            
            $('div.taxStep').find('legend:contains(' + $(this).text() + ')').parents().eq(11).show();
            $('ul.progress-menu li p').removeClass('active');
            $('p', this).addClass('active');
            next_text = $('p', this).text();
            prev_text = $('p', this).text();
            hideButton(next_text, 'next');
            hideButton(prev_text, 'prev');
            enableNextButton();
        } else {
            alert('Please fill out the required fields');
        }
    });


    //What happens when the next button is clicked
    $(document).on('click', '#next', function () {
		var valid = $('.taxStep form:visible').valid();
		if (valid) {
			$('.taxStep input:visible:first').focus();
			next_text = $('ul.progress-menu li p.active').parent().next().text();
			//Get the text for the next item in the li
			hideButton(next_text, 'next');

			//This ensures nothing happens if the next button is clicked in the last element of the list
			if (next_text !== "") {
				//Add Classes to change status of list items to update the progress bar
				$('ul.progress-menu li p.active').removeClass('active').addClass('completed').parent().next().children('p').addClass('active');
				$('ul.progress-menu li p:first').removeClass('bold active').addClass('completed');
				$('#prev').show();

				//Show the appropriate form
				$(form_element_container).hide();

				//Show the right piece of the form
				$('div.taxStep').find('legend:contains(' + next_text + ')').parents().eq(11).fadeIn(function () {});

			}
			
			$('#next').attr('disabled', 'disabled');
		}
    });

    //What happens when the prev butotn is clicked
    $(document).on('click','#prev',function () {
        prev_text = $('ul.progress-menu li p.active').parent().prev().text();

        //Make sure next is always on teh screen when the previous button is clicked
        $('#next').show();
        $('#submit').hide();

        //Get the text for the previous item in the li
        hideButton(prev_text, 'prev');
        if (prev_text !== "") {
            $('ul.progress-menu li p.active').parent().prev().children('li p').addClass('active');
            $('ul.progress-menu li p.active:last').removeClass('active');
            //Modify progress bar to represent form progress
            //Show the appropriate form
            $(form_element_container).hide();

            //Show the right piece of the form
            $('div.taxStep').find('legend:contains(' + prev_text + ')').parents().eq(11).show();
            enableNextButton();
        }

    });

    //When business type is clicked at the begining of the registration.
    $(document).on('click', 'input[name="BusinessType"]', function () {
			$('input[name="BusinessType"]').attr('disabled','disabled');
		
		$('hr:last').show();

        //Reset the validation for the form
        $('.ignore').removeClass('ignore');

        if ($(this).val().indexOf("Individual") > -1) {

            //Hide everything but the radio check list
            $('div.taxStep.first div.seform fieldset table:not(:lt(2))').hide();

            //Don't require the hidden fields required
            //$('div.taxStep.first div.seform fieldset hr:first').prevAll().find('input').addClass('ignore').removeClass('required');
            $('div.taxStep.first div.seform fieldset hr:first').prevAll().find('input').addClass('ignore');

            $('div.taxStep.first div.seform fieldset hr:first').nextAll().fadeIn('1000', function () {});
        } else {
            $('hr:first').hide();
            //Hide everything but the radio check list
            $('div.taxStep.first div.seform fieldset table:not(:lt(2))').hide();

            //Don't require the hidden fields required
            $('div.taxStep.first div.seform fieldset hr:first').nextAll().find('input').addClass('ignore');


            //Hack
            //Shows the proper form and then must show radio buttons that are nested deep in form
			if (isIE8orBelow) {
				$('div.taxStep.first div.seform fieldset hr:first').prevAll().show();
				$('div.taxStep.first div.seform fieldset table:visible table').show();
			}
			else {
				$('div.taxStep.first div.seform fieldset hr:first').prevAll().fadeIn('1000', function () {
					$('div.taxStep.first div.seform fieldset table:visible table').show();
				});
			}
            
        }

        //Always show the email input field
        $('div.taxStep.first div.seform fieldset table:last').show();
		
    });

    //Show submit button when the last progress item is checked.
    $(document).on('click','ul.progress-menu li:last',function () {
        //Show the submit button
        $('#fieldName1').show();
    });

	
	
    $(document).on('click', 'div.taxStep:visible input.seRequiredElement[type="radio"], div.taxStep:visible input.seRequiredElement[type="checkbox"]',function () {
        enableNextButton();
    });
    if (!isIE8orBelow) {
        $(document).on('keyup', 'div.taxStep:visible input', function () {
            enableNextButton();
        });
    }
	else {
		$(document).on('focusout','div.taxStep:visible input', function () {
            enableNextButton();
        });
		
		$(document).on('focus', 'input[name=EmailAddress], input[name=TaxpayerID], input[name=ElectronicSignature]' ,function() {
			$('#next').attr('disabled', '');
		});
	}

    //Bind what happens when submit button is clicked.
    bindSubmit();
});