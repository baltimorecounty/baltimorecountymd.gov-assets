/*
October 12, 2011 - Jim Neff

This will contain the jquery necessary for the site executive forms to handle the
status check functionality in the Intake controller for the ECMS project

*/

// var _appServer = 'http://localhost:50851/ECMS/';
//var _appServer = 'http://dprmmstr-dev.co.ba.md.us/ECMS/';
// var _appServer = 'http://dprmmaster.co.ba.md.us/ECMS/';
var _appServer = 'http://egov.baltimorecountymd.gov/ECMS/';

$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});

$(document).ready(function () {

    var correspondenceId = $.getUrlVar("correspondenceId");

    // http://blueonionsoftware.com/blog.aspx?p=03aff202-4198-4606-b9d6-686fd13697ee
    jQuery.support.cors = true; // force cross-site scripting (as of jQuery 1.5)

    var dataString = "&correspondenceId=" + correspondenceId;

    $.ajax({
        url: _appServer + 'Intake/GetStatus',
        data: dataString,
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "formatJsonpResult"
    });

});

/* Due to the cross-domain scripting we can only return a result from the controller as a jsonP object
we will format that result here.  The return of this function will be a div.  If there were errors they will be enumerated
in a table.  Otherwise we will redirect user to a request submitted page.
*/
function formatJsonpResult(jsonpResult) {
    
    if (jsonpResult.ResponseStatus == 1) {
        $('#statusDiv').html(jsonpResult.ResponseError);
    }
    else {
        $('#statusDiv').html(jsonpResult.ResponseError);
    }
}