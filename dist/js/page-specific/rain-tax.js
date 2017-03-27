/*Used on this page http://www.baltimorecountymd.gov/Agencies/budfin/customerservice/taxpayerservices/stormwatercommerical.html#calculate*/
var jQuery_1_9_1 = jQuery_1_9_1 || jQuery;

var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
		{
		    string: navigator.userAgent,
		    subString: "Chrome",
		    identity: "Chrome"
		},
		{ string: navigator.userAgent,
		    subString: "OmniWeb",
		    versionSearch: "OmniWeb/",
		    identity: "OmniWeb"
		},
		{
		    string: navigator.vendor,
		    subString: "Apple",
		    identity: "Safari",
		    versionSearch: "Version"
		},
		{
		    prop: window.opera,
		    identity: "Opera",
		    versionSearch: "Version"
		},
		{
		    string: navigator.vendor,
		    subString: "iCab",
		    identity: "iCab"
		},
		{
		    string: navigator.vendor,
		    subString: "KDE",
		    identity: "Konqueror"
		},
		{
		    string: navigator.userAgent,
		    subString: "Firefox",
		    identity: "Firefox"
		},
		{
		    string: navigator.vendor,
		    subString: "Camino",
		    identity: "Camino"
		},
		{		// for newer Netscapes (6+)
		    string: navigator.userAgent,
		    subString: "Netscape",
		    identity: "Netscape"
		},
		{
		    string: navigator.userAgent,
		    subString: "MSIE",
		    identity: "Explorer",
		    versionSearch: "MSIE"
		},
		{
		    string: navigator.userAgent,
		    subString: "Gecko",
		    identity: "Mozilla",
		    versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
		    string: navigator.userAgent,
		    subString: "Mozilla",
		    identity: "Netscape",
		    versionSearch: "Mozilla"
		}
	],
    dataOS: [
		{
		    string: navigator.platform,
		    subString: "Win",
		    identity: "Windows"
		},
		{
		    string: navigator.platform,
		    subString: "Mac",
		    identity: "Mac"
		},
		{
		    string: navigator.userAgent,
		    subString: "iPhone",
		    identity: "iPhone/iPod"
		},
		{
		    string: navigator.platform,
		    subString: "Linux",
		    identity: "Linux"
		}
	]

};
BrowserDetect.init();

String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
};

var beforePrint = function () {
    $('body').append($('#swc-results'));
};
var afterPrint = function () {
    $('.fancybox-inner').append( $('#swc-results') );
};

// if (window.matchMedia && window.matchMedia('print')) {
//     var mediaQueryList = window.matchMedia('print');

//     mediaQueryList.addListener(function (mql) {
//         if (mql.matches) {
//             beforePrint();
//         } else {
//             afterPrint();
//         }
//     });
// }

window.onbeforeprint = beforePrint;
window.onafterprint = afterPrint;



(function ($, jQuery) {
    var ws_url = "http://egov.baltimorecountymd.gov/RainTax/RecordLookup/";

    //Results Template
    var resultsTemplate = "";
    resultsTemplate += "<h1 class='title'>Stormwater Remediation Fee Detail<\/h1>";
    resultsTemplate += "{{#.}}{{#AccountNumber}}<a class=\"print-data\" href=\"\">";
    resultsTemplate += "<img src=\"http:\/\/www.baltimorecountymd.gov\/sebin\/w\/w\/print-button.gif\" width=\"59\" height=\"20\" border=\"0\" alt=\"Print this page.\" title=\"Print this page.\" \/>";
    resultsTemplate += "<\/a>{{\/AccountNumber}}";
    resultsTemplate += "<div class=\"property-info\">";
    resultsTemplate += "{{#AccountNumber}}";
    resultsTemplate += "<h2>Property Information<\/h2>";
    resultsTemplate += "<p>";
    resultsTemplate += "<b>Tax Account Number: <\/b>{{AccountNumber}}";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<p>";
    resultsTemplate += "<b>Property Category: <\/b>{{FeeCategory}}";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<\/div>";
    resultsTemplate += "<div class='fee-info'>";
    resultsTemplate += "<h2>Fee Information<\/h2>";
    resultsTemplate += "<p>";
    resultsTemplate += "<b>Total Impervious Surface Area (ISA): <\/b>{{#formatNumber}}{{SurfaceArea}}{{/formatNumber}} square feet";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<p>";
    resultsTemplate += "<b>Less Credits: <\/b>{{#formatNumber}}{{Credits}}{{/formatNumber}} square feet";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<p>";
    resultsTemplate += "<b>Total Adjusted Impervious Surface Area: <\/b> {{#formatNumber}}{{AdjustedImperviousServiceArea}}{{/formatNumber}} square feet";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<p>";
    resultsTemplate += "<b>Fee Per 2,000 Square Feet: <\/b>${{FeePer2kSqfoot}}";
    resultsTemplate += "<\/p>";
    resultsTemplate += "{{#AdjustmentsComment}}<p>";
    resultsTemplate += "<b>Other Adjustments: <\/b>{{AdjustmentsComment}}";
    resultsTemplate += "<\/p>{{/AdjustmentsComment}}";
    resultsTemplate += "<p>";
    resultsTemplate += "<b>Total Fee: <\/b>${{#formatNumber}}{{RemediationFee}}{{/formatNumber}}";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<\/div>";
    resultsTemplate += "{{#comments}}";
    resultsTemplate += "<div class='comments'>";
    resultsTemplate += "<h2>Comments<\/h2>";
    resultsTemplate += "{{#bmpCredits}}<p>";
    resultsTemplate += "<b>Remediation Credits: <\/b>";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<ul>";
    resultsTemplate += "{{#BmpCreditNote1}}<li>{{BmpCreditNote1}}<\/li>{{\/BmpCreditNote1}}";
    resultsTemplate += "{{#BmpCreditNote2}}<li>{{BmpCreditNote2}}<\/li>{{\/BmpCreditNote2}}";
    resultsTemplate += "{{#BmpCreditNote3}}<li>{{BmpCreditNote3}}<\/li>{{\/BmpCreditNote3}}";
    resultsTemplate += "{{#BmpCreditNote4}}<li>{{BmpCreditNote4}}<\/li>{{\/BmpCreditNote4}}";
    resultsTemplate += "{{#BmpCreditNote5}}<li>{{BmpCreditNote5}}<\/li>{{\/BmpCreditNote5}}";
    resultsTemplate += "{{#BmpCreditNote6}}<li>{{BmpCreditNote6}}<\/li>{{\/BmpCreditNote6}}";
    resultsTemplate += "<\/ul>";
    resultsTemplate += "{{\/bmpCredits}}";
    resultsTemplate += "{{#CondoCalculationComment}}<p>";
    resultsTemplate += "<b>About the Condo Calculation: <\/b>{{CondoCalculationComment}}";
    resultsTemplate += "<\/p>{{\/CondoCalculationComment}}";
    resultsTemplate += "<\/div>";
    resultsTemplate += "{{\/comments}}";
    resultsTemplate += "<div class='learn-more'>";
    resultsTemplate += "<h2>Learn More<\/h2>";
    resultsTemplate += "<p>";
    resultsTemplate += "Visit <a href=\"{{MyNeighborhoodLink}}\" class=\"btn\">My Neighborhood<\/a> to see GIS data for this property.";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<p>";
    resultsTemplate += "View <a href=\"{{SDatLink}}\" class=\"btn\">Real Property Data<\/a> from the Maryland Department of Assessment and Taxation.";
    resultsTemplate += "<\/p>";
    resultsTemplate += "<\/div>";
    resultsTemplate += "{{\/AccountNumber}}";
    resultsTemplate += "{{^AccountNumber}}";
    resultsTemplate += "{{> no_results}}";
    resultsTemplate += "{{\/AccountNumber}}";
    resultsTemplate += "{{\/.}}";

    var loadingHtml = "";
        loadingHtml += "<div class='loading-results'>";
        loadingHtml += "<h2>Loading...</h2>";
        loadingHtml += "</div>";

    var noResultsTemplate = "";
    noResultsTemplate += "<div class=\"no-results\">";
    noResultsTemplate += "<h2>{{#no_results_status}}{{no_results_status}}{{/no_results_status}}{{^no_results_status}}Stormwater Remediation Fee information is temporarily unavailable. Please check back in a few minutes.{{/no_results_status}}<\/h2><h3> Please check the following:<\/h3>";
    noResultsTemplate += "<ul>";
    noResultsTemplate += "<li>";
    noResultsTemplate += "Make sure your tax account number is entered correctly. If you don’t have your number, you can look it up by property address in Baltimore County’s <a href=\"http:\/\/myneighborhood.baltimorecountymd.gov\/\" title=\"Visit Baltimore County's My Neighboorhood Application\">My Neighborhood<\/a> application.";
    noResultsTemplate += "<\/li>";
    noResultsTemplate += "<li>This search tool is for commercial, industrial and institutional properties only. Stormwater fees for residential property are based on a flat rate.<\/li>";
    noResultsTemplate += "<\/ul>";
    noResultsTemplate += "<\/div>";

    var noResultsPartial = { no_results: noResultsTemplate };
    var showError = function($dataContainer) {
        var status = {
            status: "Don't see any results?"
        };

        var html = Mustache.render(noResultsTemplate, status);
        $dataContainer.html(html);
    }
    //Gets Stormwater Remedition Fee Details
    //val: tax record id inputed by the user
    var getRecords = function (val) {
        var ie_options = {
            maxWidth: '600',
            minWidth: '600',
            autoResize: false,
            type: 'inline'
        };
        var options = {
            maxWidth: '600',
            type: 'inline'
        };

        var $dataContainer = $('#swc-results');

        //Show user they are beginning the request
        var browser = BrowserDetect.browser;
        var version = BrowserDetect.version;
        if (browser == "Explorer" && version < 8) {
            $.fancybox.open('#swc-results', ie_options);
        }
        else {
            $.fancybox.open('#swc-results', options);
        }

        $dataContainer.html(loadingHtml);

        /*Call WebService for Data*/
        jQuery.getJSON(ws_url + formatTaxId(val))
            .done(function(data, status) {
                if (status.toLowerCase() === 'success') {
                    data.bmpCredits = function () {
                        return checkCondoComments(data);
                    };
                    data.comments = function () {
                        var empty = checkCondoComments(data);
                        //No comments at all
                        if (!empty && !this.CondoCalculationComment) {
                            return null;
                        }
                        return true;
                    };
                    data.formatNumber = function () {
                        return function (text, render) {
                            return formatNumber(render(text));
                        }
                    };

                    //Define a message if there are no results to use with mustache
                    data.no_results_status = 'Your search returned no results.';

                    var html = Mustache.render(resultsTemplate, data, noResultsPartial);
                    $dataContainer.html(html);

                }
                else {
                   showError($dataContainer);

                }
        }).fail(function(data, t, x) { 
                showError($dataContainer);
            });
    };

    //Check to see if any condo comments exist
    var checkCondoComments = function (obj) {
        var arr = [obj.BmpCreditNote1, obj.BmpCreditNote2, obj.BmpCreditNote3, obj.BmpCreditNote4, obj.BmpCreditNote5, obj.BmpCreditNote6];
        var empty = false;
        $.each(arr, function (index, value) {
            if (value) {
                empty = true;
                return false;
            }
        });
        return empty;
    };

    //Add commas to number
    //Ex 1000 after hitting function would be 1,000
    var formatNumber = function (val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        return val;
    };

    //Formats Tax Id for submission
    var formatTaxId = function (taxId) {
        return taxId.replaceAll('-', '');
    };

    //Same as submitClick, but triggers when you hit 
    var enterClick = function () {
        $('#StormwaterFeeCalculator').on('keypress', '#TaxIDNumber', function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                var searchVal = $('#TaxIDNumber').val();
                getRecords(searchVal);
                return false;
            }
        });
    };

    var printClick = function () {
        $('#swc-results').on('click', '.print-data', function (e) {
            e.preventDefault();
            beforePrint();
            window.print();
            afterPrint();
            return false;
        });

    };

    var disableSubmit = function() {
         $('#submit_tax').attr('disabled', 'disabled');
    },
    //Function that defines what happens when submit button is clicked
    submitClick = function () {
        $('#StormwaterFeeCalculator').on('click', 'input[name=submit_tax]', function (e) {
            e.preventDefault();
            var searchVal = $('#TaxIDNumber').val();
            getRecords(searchVal);
        });
    };

    $(document).ready(function () {
        $.support.cors = true;

        //Disable the submit button
        disableSubmit();

        //Bind submit click
        submitClick();

        //Bind print click
        printClick();

        //Submit on enter keypress
        enterClick();
    });

    $(document).on('keyup', '#TaxIDNumber', function(e) {
        var $this = $(this),
            numOfChars = $.trim($this.val()).length,
            $submitBtn = $('#submit_tax');
        
        if (numOfChars === 10) {
            $submitBtn.removeAttr('disabled');
        }
        else {
           disableSubmit();
        }
    });


})(jQuery_1_9_1, jQuery);



