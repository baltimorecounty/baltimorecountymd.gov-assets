/*Start of Config Variable*/
/*SE*/
var xmldoc = "/bin/k/f/agency.xml";
var contentDIV = $('#containertable');

/*End of Config Variables*/

/*Start of UI Table Filter*/
/*
 * Copyright (c) 2008 Greg Weber greg at gregweber.info
 * Dual licensed under the MIT and GPLv2 licenses just as jQuery is:
 * http://jquery.org/license
 *
 * documentation at http://gregweber.info/projects/uitablefilter
 *
 * allows table rows to be filtered (made invisible)
 * <code>
 * t = $('table')
 * $.uiTableFilter( t, phrase )
 * </code>
 * arguments:
 *   jQuery object containing table rows
 *   phrase to search for
 *   optional arguments:
 *     column to limit search too (the column title in the table header)
 *     ifHidden - callback to execute if one or more elements was hidden
 */ (function ($) {
    $.uiTableFilter = function (jq, phrase, column, ifHidden) {
        var new_hidden = false;
        if (this.last_phrase === phrase) return false;

        var phrase_length = phrase.length;
        var words = phrase.toLowerCase().split(" ");

        // these function pointers may change
        var matches = function (elem) {
            elem.show()
        }
        var noMatch = function (elem) {
            elem.hide();
            new_hidden = true
        }
        var getText = function (elem) {
            return elem.text()
        }

        if (column) {
            var index = null;
            jq.find("thead > tr:last > th").each(function (i) {
                if ($.trim($(this).text()) == column) {
                    index = i;
                    return false;
                }
            });
            if (index == null) throw ("given column: " + column + " not found")

            getText = function (elem) {
                return $(elem.find(
                ("td:eq(" + index + ")"))).text()
            }
        }

        // if added one letter to last time,
        // just check newest word and only need to hide
        if ((words.size > 1) && (phrase.substr(0, phrase_length - 1) === this.last_phrase)) {

            if (phrase[-1] === " ") {
                this.last_phrase = phrase;
                return false;
            }

            var words = words[-1]; // just search for the newest word

            // only hide visible rows
            matches = function (elem) {;
            }
            var elems = jq.find("tbody:first > tr:visible")
        } else {
            new_hidden = true;
            var elems = jq.find("tbody:first > tr")
        }

        elems.each(function () {
            var elem = $(this);
            $.uiTableFilter.has_words(getText(elem), words, false) ? matches(elem) : noMatch(elem);
        });
        //Addded by Marty Powell to show a message if there is nothing on the page
        var i = 0;
        $('.searchTable tr:visible').each(function () {
            i++;
        });

        if (i == 0) {
            $('#noresults').show();
        } else {
            $('#noresults').hide();
        }

        //Marty
        last_phrase = phrase;
        if (ifHidden && new_hidden) ifHidden();
        return jq;
    };

    // caching for speedup
    $.uiTableFilter.last_phrase = ""

    // not jQuery dependent
    // "" [""] -> Boolean
    // "" [""] Boolean -> Boolean
    $.uiTableFilter.has_words = function (str, words, caseSensitive) {
        var text = caseSensitive ? str : str.toLowerCase();
        for (var i = 0; i < words.length; i++) {
            if (text.indexOf(words[i]) === -1) return false;
        }
        return true;
    }
})(jQuery);
/*End of UI Table Filter*/
/*Start of Scroll JS*/
/*Courtesy of http://blog.medianotions.de/en/articles/2009/smoothscroll-for-jquery */

$(document).ready(function () {
    /*Allows page to scroll - nav is the class i want to scroll on the page, you will need to change this*/
    $(function() {
      $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });
});

});
/*End of Scroll JS*/

var i = 0;
var alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var numberArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function aTwoZ() {

    //set the link
    jQuery.fn.topLink = function (settings) {
        settings = jQuery.extend({
            min: 1,
            fadeSpeed: 200
        }, settings);
        return this.each(function () {
            //listen for scroll
            var el = $(this);
            el.hide(); //in case the user forgot
            $(window).scroll(function () {
                if ($(window).scrollTop() >= settings.min) {
                    el.fadeIn(settings.fadeSpeed);
                } else {
                    el.fadeOut(settings.fadeSpeed);
                }
            });
        });
    };
    $('#top-link').topLink({
        min: 400,
        fadeSpeed: 500
    });
    for (i = 0; i < alpha.length; i++) {
        if ($("h2 a[name^='" + alpha[i] + "']:first").text() !== "") {
            $("h2 a[name^='" + alpha[i] + "']:first").attr("id", alpha[i].toLowerCase());
        } else {
            $('a[href="#' + alpha[i].toLowerCase() + '"]').css("text-decoration", "none").css("color", "black").css("cursor", "default");
        }
    }
    //Check to see if there is a number in one of the h2's, if so assign it an id of number
    for (j = 0; j < numberArr.length; j++) {
        if ($("h2 a[name^='" + numberArr[j] + "']:first").text() !== "") {
            $("h2 a[name^='" + numberArr[j] + "']:first").attr("id", "number");
            break;
        }
    }

}
$(document).ready(function () {
    $('div.clearButton').html('<input type="button" name="clear" class="clear" value="Clear"/>');
    //SE hack
    //$("#top-link").attr("href", "#tertiary_nav");
    $("#top-link").attr("href", "#top");

    $('ul.az a').each(function () {
        if ($(this).text() == "0-9") {
            $(this).attr("href", "#number").attr("class", "number");
        } else {
            $(this).attr("href", "#" + $(this).text().toLowerCase()).attr("class", $(this).text().toLowerCase());
        }
    });
    var open = false;


    $('div.az').show();

    $.ajax({
        type: "GET",
        url: xmldoc,
        dataType: "xml",
        success: function (xml) {
            var htmlString = "<table style='border-right-width: 0px; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px'"
            htmlString += " id='BACO_table' class='searchTable' border='0' width='100%'><thead><tr style='display:none'><th>Name</th><th>Contact</th></tr></thead>";

            $(xml).find('agency').each(function () {
                //declare the variables contained in the xml
                var agencyName = $(this).find('name').text();
                var desc = $(this).find('desc').text();
                var agencyLink = $(this).find('agencyLink').text();
                var contactAddress1 = $(this).find('addr1').text();
                var contactAddress2 = $(this).find('addr2').text();
                var contactAddress3 = $(this).find('addr3').text();
                var contactTitle = $(this).find('supervisorTitle').text();
                var contactName = $(this).find('supervisorName').text();
                var contactPhone = $(this).find('phone').text();
                var contactEmail = $(this).find('email').text();
                var contactFormLink = $(this).find('contactFormLink').text();
                var services = $(this).find('services').text();
                //For use with the Popular Service Section
                //Name to be shown as Link Test
                var serviceName = "";
                //Actual Link for the page
                var serviceLink = "";
                //For service link title attribute
                var serviceTitle = "";

                htmlString += "<tr><td style='white-space: normal' valign='top' width='70%' align='left'><h2>";
                htmlString += "<a href='" + agencyLink + "' name='" + agencyName + "' title='Learn more about " + agencyName + "'>"
                htmlString += agencyName + "</a></h2><div class='popularContain'><p class='links'><a href='#' class='desc selected'>Description</a>&nbsp;&nbsp;&nbsp;<a href='#' class='popular'>"
                htmlString += "Most Popular Services</a></p><p class='desc'>" + desc + "</p><div class='popularServices'>";

                var m = 1;
                var p = 1;
                var numberOfServices = 0;
                //need to add logic for services under 10
                $(this).find('service').each(function () {
                    if ($(this).find('serviceName').text() !== "") {
                        numberOfServices++;
                    }
                });
                //Most Popular Services
                //Declare Variables
                var numInColumn = "",
                    remainder = numberOfServices % 3,
                    column1Length = parseInt(numberOfServices / 3),
                    column2Length = parseInt(numberOfServices / 3),
                    column3Length = parseInt(numberOfServices / 3);
                //if there is no remainder the number of columns is even
                //Set the number of columns for each of the three columns
                switch(remainder) {
                    case 1:
                        column1Length = parseInt(numberOfServices / 3 + 1);
                        break;
                    case 2: 
                        column1Length = parseInt(numberOfServices / 3 + 1);
                        column2Length = parseInt(numberOfServices / 3 + 1);
                        break;
                }


                //Find each service and place them where needed
                $(this).find('service').each(function () {
                    serviceName = $(this).find('serviceName').text();
                    serviceLink = $(this).find('serviceLink').text();
                    serviceTitle = $(this).find('serviceTitle').text();
                    if (serviceName !== "") {
                        if (numberOfServices <= 9) {
                            if (m <= 3) {
                                if (m == 1) {
                                    htmlString += "<ul class='col1 popularServices'>";
                                }
                                htmlString += "<li><a href='" + serviceLink + "' title='Click here to go to " + serviceTitle + "'>" + serviceName + "</a></li>";
                                if (m == 3 && numberOfServices > 3) {
                                    htmlString += "</ul>";
                                }

                            }
                            if (m >= 4 && m < 7) {
                                if (m == 4) {
                                    htmlString += "<ul class='col2 popularServices'>";
                                }
                                htmlString += "<li><a href='" + serviceLink + "' title='Click here to go to " + serviceTitle + "'>" + serviceName + "</a></li>";
                                if (m == 6 && numberOfServices > 6) {
                                    htmlString += "</ul>";
                                }
                            }
                            if (m >= 7 && m < 10) {
                                if (m == 7) {
                                    htmlString += "<ul class='col3 popularServices'>";
                                }
                                htmlString += "<li><a href='" + serviceLink + "' title='Click here to go to " + serviceTitle + "'>" + serviceName + "</a></li>";
                            }
                        } else {
                            if (m <= column1Length) {
                                if (m == 1) {
                                    htmlString += "<ul class='col1 popularServices'>";
                                }
                                htmlString += "<li><a href='" + serviceLink + "' title='Click here to go to " + serviceTitle + "'>" + serviceName + "</a></li>";
                                if (m == column1Length) {
                                    htmlString += "</ul>";
                                }
                            }
                            if (m > column1Length && m <= (column1Length + column2Length)) {
                                if (m == column1Length + 1) {
                                    htmlString += "<ul class='col2 popularServices'>";
                                }
                                htmlString += "<li><a href='" + serviceLink + "' title='Click here to go to " + serviceTitle + "'>" + serviceName + "</a></li>";
                                if (m == (column1Length + column2Length)) {
                                    htmlString += "</ul>";
                                }
                            }
                            if (m > (column1Length + column2Length)) {
                                if (m == column1Length + column2Length + 1) {
                                    htmlString += "<ul class='col3 popularServices'>";
                                }
                                htmlString += "<li><a href='" + serviceLink + "' title='Click here to go to " + serviceTitle + "'>" + serviceName + "</a></li>";
                            }
                        }
                        m++;
                    }

                });

                htmlString += "</ul></div></td><td style='white-space: normal' valign='top' width='30%' align='left'><p><b>Contact Information</b></p>";

                //Check to see if agency has an address, adjust html appropriately
                if (contactAddress1 !== "") {
                    if (contactAddress3 === "") {
                        htmlString = htmlString + "" + contactAddress1 + "<br />" + contactAddress2 + "<br /><a href='http://www.mapquest.com/?daddr=";
                        htmlString = htmlString + contactAddress1 + " " + contactAddress2 + "' class='directions'>Get Directions</a><br /></p>";
                    } else if (contactAddress3 !== "") {
                        htmlString = htmlString + "" + contactAddress1 + "<br />" + contactAddress2 + "<br />" + contactAddress3 + "<br /><a href='http://www.mapquest.com/?daddr=";
                        htmlString = htmlString + contactAddress1 + " " + contactAddress2 + " " + contactAddress3 + "' class='directions'>Get Directions</a><br /></p>";
                    } else {
                        htmlString = htmlString + "</p>";
                    }
                }

                //Add Contact Title, Name and Phone to display on the screen
                if (contactTitle !== "") {
                    htmlString = htmlString + "<p><strong>" + contactTitle + ":</strong>&nbsp;" + contactName + "<br />" + contactPhone + "<br />";
                } else {
                    htmlString = htmlString + "<p>" + contactPhone + "<br />";
                }

                //Check to see if there is an email or contact form to display on screen appropriately
                if (contactEmail != "") {
                    if (contactFormLink != "") {
                        htmlString = htmlString + "<a href='" + contactFormLink + "' title='" + agencyName + " Contact Form'>Contact Form</a></p>";
                    } else {
                        htmlString = htmlString + "<a href='mailto:" + contactEmail + "' title='Email the Baltimore County " + agencyName + "' >" + contactEmail + "</a></p>";
                    }
                } else {
                    htmlString = htmlString + "</p>";
                }
                htmlString = htmlString + "</td>";

                htmlString = htmlString + "</tr>";
                i = 0;
            });
            htmlString = htmlString + "</table>";

            $('#containertable').html(htmlString);

            //Hide links if there are no popular services
            $('p.links').each(function () {
                if ($(this).parent().children('div.popularServices').children('ul.col1').html() == null) {
                    $(this).parent().children('p.links').hide();
                }
            });

            //Find h2's that start with different letters, make the first h2 with each different letter the anchro link
            // example you have Administrative Hearings, Aging, Budget
            //Admin Hearings and Budget will be assigned the id's so that they can utilize the a-z filter at the top of the page
            aTwoZ();

            $(document).on('click', 'input.clear', function () {
                $('#filter').val("");
                if ($('#filter').val() === "") {
                    $.uiTableFilter($('table.searchTable'), $('#filter').val());
                }
            });

            $(function () {

                var theTable = $('table.searchTable');

                theTable.find("tbody > tr").find("td:eq(1)").mousedown(function () {
                    $(this).prev().find(":checkbox").click();
                });

                $(document).on('keyup', "#filter", function () {
                    var $alphaList = $('ul.az');
                    $.uiTableFilter(theTable, this.value);
                    //Hide the a-z filter if there is anything in the text filter
                    if ($('#filter').val() === "") {
                        $alphaList.fadeIn();
                    } else {
                        $alphaList.fadeOut();
                    }
                });

                $('#filter-form').submit(function () {
                    theTable.find("tbody > tr:visible > td:eq(1)").mousedown();

                    return false;

                }).focus(); //Give focus to input field
            });
        }
    });

    $(document).on('click','#filter', function () {
        $('input#filter').val('').addClass('clicked');
    });

    $('a.desc').css("color", "black").css("text-decoration", "none").css("font-weight", "bold");
    $(document).on('click', 'div.popularContain a.desc', function (e) {
        e.preventDefault();
        var $this = $(this),
            $parent = $this.parent(),
            $grandParent = $parent.parent();

        $grandParent.children('p.desc').show();
        $grandParent.children().children('ul').hide();
        $this.addClass("selected");
        $parent.children('a.popular').removeClass("selected");
    });
    $(document).on('click', 'div.popularContain a.popular', function (e) {
        e.preventDefault();
        var $this = $(this),
            $parent = $this.parent(),
            $grandParent = $parent.parent();

        $grandParent.children().children('ul.popularServices').show();
        $grandParent.children('p.desc').hide();
        $this.addClass("selected");
        $parent.children('a.desc').removeClass("selected");
    });
});