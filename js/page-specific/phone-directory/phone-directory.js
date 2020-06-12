var jQuery = $.noConflict(true);
var pageCount = 0;

function __onPrevPage() {
    for (var i = 1; i <= pageCount; i++) {
        if (document.getElementById("Page" + i).style.display == "block") {
            document.getElementById("Page" + i).style.display = "none";
            document.getElementById("Page" + (i - 1)).style.display = "block";
            break;
        }
    }
    setNextPrevious(i - 1);
}

function setNextPrevious(pageNum) {
    if (pageNum < pageCount) {
        document.getElementById("Next").style.display = "block";
    } else {
        document.getElementById("Next").style.display = "None";
    }

    if (pageNum > 1) {
        document.getElementById("Previous").style.display = "block";
    } else {
        document.getElementById("Previous").style.display = "None";
    }
}

function validateForm() {
    var firstName = jQuery.trim(
        document.getElementById("txtFirst").value
    );
    var lastName = jQuery.trim(
        document.getElementById("txtLast").value
    );
    if (firstName == "" && lastName == "") {
        alert(
            "If Searching all Agencies, You must enter at least one letter of the last name or one letter of the first name"
        );
        return false;
    } else {
        return true;
    }
}

function __onNextPage() {
    for (var i = 1; i <= pageCount; i++) {
        if (document.getElementById("Page" + i).style.display == "block") {
            document.getElementById("Page" + i).style.display = "none";
            document.getElementById("Page" + (i + 1)).style.display = "block";
            break;
        }
    }
    setNextPrevious(i + 1);
}

jQuery(document).ready(function () {
    jQuery.support.cors = true; // force cross-site scripting (as of jQuery 1.5)

    jQuery("#btnSubmit").click(function (submitEvent) {
        submitEvent.preventDefault();

        //Hide next previous button incase they were visible from a previous search
        document.getElementById("Next").style.display = "None";
        document.getElementById("Previous").style.display = "None";
        if (validateForm()) {
            jQuery("#output").text("");
            dataString =
                jQuery(this).closest("form").serialize() +
                "&formId=" +
                jQuery(this).closest("form").attr("id");

            jQuery.ajax({
                url: "https://phonedirectorydev.baltimorecountymd.gov/PhoneDir/ProcessPhoneDirSearchForm",
                data: dataString,
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "formatJsonpResult",
            });
        } //end of if ValidForm
    });

    jQuery("#btnClear").click(function (clearEvent) {
        clearEvent.preventDefault();
        jQuery("#BACO_table,#prevNext,#output center").hide();
        jQuery("#txtLast").val("");
        jQuery("#txtFirst").val("");
        jQuery("#ddlAgency").val("0");
    });
});

function formatJsonpResult(jsonpResult) {

    console.log(jsonpResult);

    if (
        jsonpResult.ResponseError.length > 0 &&
        jsonpResult.ResponseStatus == 0
    ) {

        jQuery("#output").append(jsonpResult.ResponseError);


        //this element is actually being returned as part of the JSON Result
        if (document.getElementById("page_count"))
            pageCount = document.getElementById("page_count").value;

        if (pageCount > 1) {
            jQuery("#Next").show();
        }
    }
    if (
        jsonpResult.ResponseError.length == 0 &&
        jsonpResult.ResponseStatus == 0
    ) {
        jQuery("#output").append(
            "<font color='red'><center>No records found matching your search criteria</center></font>"
        );
    }
    if (
        jsonpResult.ResponseError.length > 0 &&
        jsonpResult.ResponseStatus < 0
    ) {
        jQuery("#output").append(
            "<font color='red'><center>Error: " +
            jsonpResult.ResponseError +
            "</center></font>"
        );
    }
    jQuery("#BACO_table,#prevNext").show();
}