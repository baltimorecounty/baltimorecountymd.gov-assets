/*
    October 12, 2011 - Jim Neff

    This will contain the jquery necessary for the site executive forms to handle the
    status check functionality in the Intake controller for the ECMS project

*/

//  var _appServer = 'http://localhost:50851/ECMS/';
var _appServer = 'http://dprmmstr-dev.co.ba.md.us/ECMS/';
// var _appServer = 'http://dprmmaster.co.ba.md.us/ECMS/';
// var _appServer = 'http://egov.baltimorecountymd.gov/ECMS/';

$(document).ready(function () {

    // http://blueonionsoftware.com/blog.aspx?p=03aff202-4198-4606-b9d6-686fd13697ee
    jQuery.support.cors = true; // force cross-site scripting (as of jQuery 1.5)

    $('#Submit').click(function () {

        dataString = $(this).closest("form").serialize();
        inProcess = true;
        //alert(dataString);
        $.ajax({
            url: _appServer + 'Intake/Login',
            data: dataString,
            type: "GET",
            dataType: "jsonp",
            jsonpCallback: "formatJsonpResult",
            async: false
        });
    });

    //url: 'http://localhost:50851/ECMS/Intake/ProcessJprForm',
    // url: 'http://dprmmstr-dev.co.ba.md.us/ECMS/Intake/Login',
});


/* Due to the cross-domain scripting we can only return a result from the controller as a jsonP object
we will format that result here.  The return of this function will be a div.  If there were errors they will be enumerated
in a table.  Otherwise we will redirect user to a request submitted page.
*/
var errorCounter = 0;

var inProcess = false;

function formatJsonpResult(jsonpResult) {

    if (inProcess == true) {

        if (jsonpResult.ResponseStatus == 1) {
            var url = 'getstatus.html?correspondenceId=' + jsonpResult.ResponseError;
            $(window.location).attr('href', url);
        }
        else {
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
        inProcess = false;
    }
}