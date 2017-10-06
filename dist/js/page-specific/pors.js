var i = 0, //used for loop to find number of questions
    j = 0, //used to count, when a question is answered
    // xmlLoc = "tru.xml"; //path to xml file local
    xmlLoc = "/sebin/u/a/tru.xml", //path to xml file on site executive
    questionText = "",
    questionRank = "",
    questionAnswer = "",
    questionType = "",
    htmlString = "",
    typeArray = ["basic", "hitandrun", "destructionofproperty", "lostproperty", "abandonedvehicle", "theft", "shoplifting"],
    //Words that police would like to show a definition for
    //Should have corresponding value in the definition object below
    keywordArray = ["graffiti", "serial", "bias"],
    liString = "";
//declare links to coplogic thru site executive redirects
var link = {
    precincts: "http://www.baltimorecountymd.gov/Agencies/police/precinctsall.html",
    start_report: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/no-report-type.html",
    theft: {
        motor: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/theftfromvehicleredirect.html",
        nomotor: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/theftredirect.html",
        sepage: "http://www.baltimorecountymd.gov/Agencies/police/onlinereport/theft.html"
    },
    abandoned: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/abandonedvehicleredirect.html",
    lost_property: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/lostpropertyredirect.html",
    des_of_property: {
        motor: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/destructionpropertyvehicleredirect.html",
        nomotor: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/destructionpropertyredirect.html"
    },
    hit_and_run: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/hitandrunredirect.html",
    shop_lifting: "http://www.baltimorecountymd.gov/Redirect/externalwebsites/Coplogic/startreport.html" //Need to replace with Prod//Need to replace with Prod
};

//definitions for the qtips, for the keywords
var definition = {
    bias: 'A reported act which appears to be motivated, or perceived by the victim to be motivated, all or in part, by <strong><em>Disability, Ethnic, Gender, Homeless, Racial, Religious, or Sexual Orientation</em></strong>. To be considered a bias incident, the act is not required to be a crime under any federal, state or local statute. The key criterion for determining whether a crime or incident is of a bias nature is the motivation behind the act.',
    graffiti: 'A permanent or non-permanent drawing, painting, mark, inscription, or writing that destroys, injures, molests, or defaces the real or personal property of another without the permission of the owner of the property.',
    serial: 'Any property that has a unique identifier from the manufacturer, such as a serial number or registration number. <strong>Some Examples Are:</strong> Televisions, bicycles, computers, stereo equipment, etc...'
};


//declare counters and arrays for each category listed above
for (c = 0; c < typeArray.length; c++) {
    window[typeArray[c] + "Array"] = [];
    window[typeArray[c] + "Counter"] = 0;
}


//Capital first letter
//str = string you want to address
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}


//Functions that will be used inside the ajax loop.
//creates an array to order the questions by their rank
function categoryCheck(type, arrayValue, rank, question, answer, arrayName) {
    if (type == arrayValue) {
        arrayName[rank + "0"] = rank;
        arrayName[rank + "1"] = question;
        arrayName[rank + "2"] = answer;
        window[arrayValue + "Counter"]++;
        return false;
    }
}

//Generates a link when questions are completed
//This link will direct you to appropriate coplogic page
//Params
//object = in this case it  is equal to the input that is checked,
//type = type listed in the typeArray,
//link = link variable you created for the type
function generateLink(object, type, link) {
    if (object.parent().hasClass(type)) {
        $('div.success').html("<p>Your report is qualified to file online.</p>&nbsp;<a href='" + link + "' class='startReport'>File a Report Now</a>").css('color', 'black');
    }
}

//Build the html according to their categories
function questionStringBuilder(counter, type) {
    if (type == "basic" || ($('div.' + type).length > 0 && type != "basic")) {
        rank = counter;
        var array = window[type + "Array"];
        var question = array[counter + "1"];
        var answer = array[counter + "2"].toLowerCase();
        var isAnswerYes = answer === "yes";
        var isAnswerNo = answer === "no";
        var hasNoAnswer = !isAnswerYes && !isAnswerNo;
        var correctAnswerClassStr = "class='correct' ";
        var noAnswerClassStr = hasNoAnswer ? "class='noanswer nomotor' " : "";

        liString += [
            "<li class='question-container " + type + "'>",
                "<p>" + question + "</p>",
                "<div class='form-group'>",
                    "<input type='radio' " + (isAnswerYes ? correctAnswerClassStr : noAnswerClassStr) + "name='q" + rank + "' id='q-yes-" + rank + "' />",
                    "<label for='q-yes-" + rank + "'>Yes</label>",
                "</div>",
                "<div class='form-group'>",
                    "<input type='radio' " + (isAnswerNo ? correctAnswerClassStr : noAnswerClassStr) + "name='q" + rank + "' id='q-no-" + rank + "' />",
                    "<label for='q-no-" + rank + "'>No</label>",
                "</div>",
            "</li>"
        ].join("");
    }
}


function generateQtip(question, keywords) {
    var keyword;
    for (q = 0; q < keywords.length; q++) {
        keyword = keywords[q];

        if (question.indexOf(keyword) > -1) {
            $('li.active a.' + keyword).qtip({
                content: {
                    text: definition[keyword],
                    title: {
                        text: 'Definition of ' + toTitleCase(keyword),
                        button: true
                    }
                },
                position: {
                    at: 'top right',
                    // Position the tooltip above the link
                    my: 'bottom left'
                },
                style: {
                    width: '280px',
                    classes: 'ui-tooltip-dark'
                }
            });
        }
    }

}


function instrCheck(question, keywords) {
    var start = "";
    var end = "";
    var tmpString = question;
    var keyword;
    for (k = 0; k < keywords.length; k++) {
        keyword = keywords[k];
        start = tmpString.indexOf(keyword);
        end = tmpString.substring(tmpString.indexOf(keyword)).indexOf(" ");
        if (start != -1) {
            if (start > -1 && end == -1) {
                tmpString = tmpString.substring(0, start) + "<a href='#" + keyword + "' class='tip " + keyword + "'>" + keyword + "</a>?";
            }
            else if (start > -1 && end > -1) {
                end = tmpString.substring(tmpString.indexOf(keyword)).indexOf(" ") + start;
                tmpString = tmpString.substring(0, start) + "<a href='#" + keyword + "' class='tip " + keyword + "'>" + keyword + "</a>" + tmpString.substring(end);
            }
        }
        else {
            //alert('false');
        }
    }
    return tmpString;
}

$(document).ready(function () {
    $('div.nojs').hide();
    $('div.js').show();
    $.ajax({
        type: "GET",
        url: xmlLoc,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('question').each(function () {
                questionText = jQuery.trim($(this).find('text').text());
                questionText = instrCheck(questionText, keywordArray);
                questionRank = $(this).find('rank').text();
                questionAnswer = $(this).find('correctAnswer').text();
                questionType = $(this).find('type').text();
                //Create an array to order questions by rank
                for (m = 0; m < typeArray.length; m++) {
                    categoryCheck(questionType, typeArray[m], questionRank, questionText, questionAnswer, window[typeArray[m] + "Array"]);
                }

            }); //end of xml loop
            //get information for the basicArray
            //Don't show basic questions if the questionType is a certain type, this can be expanded
            if (questionType != "shoplifting") {
                for (x = 1; x < basicCounter + 1; x++) {
                    questionStringBuilder(x, "basic");
                }
            }
            //get information for all other arrays
            //start at 1 to skip basic
            for (k = 1; k < typeArray.length; k++) {
                if (window[typeArray[k] + "Array"].length > 0) {
                    for (o = 1; o < window[typeArray[k] + "Counter"] + 1; o++) {
                        questionStringBuilder(o, typeArray[k]);
                    }
                }
            }

            htmlString = "<div class='questions'><ul>" + liString + "</ul></div>";
            htmlString += '<div class="noreport">&nbsp;</div><div class="success">&nbsp;</div>';

            //Append html to the page
            $('#questions').html(htmlString);

            //get the total number of questions so that we can determine when we hit the last question
            $('div.questions li').each(function () {
                i++;
            });

            //disable all questions expcept for the first question and change color to give appearance disabled
            $('div.questions ul li:not(:first-child), div.questions a').each(function () {
                $('input', this).attr('disabled', 'disabled');
                $(this).css('color', 'gray');
            });

            //determine if the user is answering each question correctly
            $('div.questions :input').click(function () {
                //count the number of clicked inputs
                j++;
                //Disable all qtips
                $('.qtip').qtip('disable');
                //If qtip is disabled change the link cursor
                $('a.active').css('cursor', 'default');


                //Custom code for shoplifting, sometimes shoplifting is a theft so this compensates for that
                //This is dependent on the question Is there a known suspect? being first.
                if ($(this).parent().hasClass('shoplifting') && $(this).parent().children('p').text() == "Is there a known suspect?") {
                    var answer_text = $(this).val();
                    if (answer_text == "No") {
                        $('div.questions ul li:not(:first), .noreport').hide();
                        $('div.success').html("<p>Since there is no known suspect, you will need to file a theft report.</p>&nbsp;<a href='" + link.theft.sepage + "' class='goToForm'>File a Theft Report Now</a>").css('color', 'green');
                    }

                }

                //if there is a question that doesn't have an answer, do these things
                if ($(this).hasClass('noanswer')) {
                    if ($(this).hasClass('nomotor')) {
                        $('div.success').html("<p>Your report is qualified to file online.</p>&nbsp;<a href='" + link.theft.nomotor + "' class='startReport'>File a Report Now</a>").css('color', 'green');
                    }
                    else if ($(this).hasClass('motor')) {
                        $('div.success').html("<p>Your report is qualified to file online.</p>&nbsp;<a href='" + link.theft.motor + "' class='startReport'>File a Report Now</a>").css('color', 'green');
                    }
                    if ($('div.questions').hasClass("destructionofproperty")) {
                        /*if (questionType == "destructionofproperty") {*/
                        if ($(this).hasClass('nomotor')) {
                            $('div.success').html("<p>Your report is qualified to file online.</p>&nbsp;<a href='" + link.des_of_property.nomotor + "' class='startReport'>File a Report Now</a>").css('color', 'green');
                        }
                        else if ($(this).hasClass('motor')) {
                            $('div.success').html("<p>Your report is qualified to file online.</p>&nbsp;<a href='" + link.des_of_property.motor + "' class='startReport'>File a Report Now</a>").css('color', 'green');
                        }
                    }
                }

                //question has been answered correctly
                if ($(this).hasClass('correct')) {
                    //add a class of answered for selecting purposes
                    $(this).parent().addClass("answered").css('color', 'gray');
                    $(this).parent().children(':input').attr('disabled', 'disabled');
                    $(this).parent().children().children().attr('style', 'color:gray;');
                    $(this).parent().removeClass('active');
                    $(this).parent().next().addClass('active').css('color', 'black');
                    $(this).parent().next().children(':input').removeAttr('disabled');
                    $(this).parent().next().children().children().attr('style', '').css('color', '');

                    //if answer of correct = answer of questions show file link button
                    if (i == j) {
                        //modify the link based on which type of report it is
                        generateLink($(this), 'lostproperty', link.lost_property);
                        generateLink($(this), 'hitandrun', link.hit_and_run);
                        generateLink($(this), 'abandonedvehicle', link.abandoned);
                        generateLink($(this), 'shoplifting', link.shop_lifting);
                    }

                    if ($(this).parent().next().children().html() != null) {
                        //qtips only show after the question has been enabled
                        generateQtip($(this).parent().next().children().html(), keywordArray);

                    }
                }

                //wrong answer
                else {
                    var $this = $(this);
                    var $questionContainer = $this.closest('.question-container');

                    $questionContainer
                        .find('input').attr('disabled', 'disabled')
                        .children().css('color', 'gray').end()
                        .siblings(':not(.answered)').hide();

                    //$(this).parent().css('color', 'gray');
                    //$(this).parent().children(':input').attr('disabled', 'disabled');
                    //$(this).parent().siblings(':not(.answered)').hide();
                    if ($(this).parent().html().indexOf("Baltimore County, Maryland?") > -1) {
                        $('div.noreport').html("<p>Sorry, you cannot file your report with Baltimore County. Notify the jurisidiction where the incident occured.").css('color', 'red');
                    }
                    else {
                        if ($(this).hasClass('noanswer')) {
                            $('div.noreport').hide();
                        }
                        else {
                            $('div.noreport').html("<p>Sorry, your report does not qualify to file online. You need to  file by calling the non-emergency number at 410-887-2222 or visiting your <a href='" + link.precincts + "'>local precinct.</a>").css('color', 'red');
                        }

                    }

                }
            });

        } //end of ajax call
    });

    $('a.startReport').live('click', function () {

        var linkDomain = $(this).attr("href"),
            message = '<div class="disclaimer">	<h2>Citizen Online Reporting System Disclaimer</h2>	<p><strong>You are about to launch the Citizen Online Reporting Application. Please read the disclaimer below before proceeding.</strong></p><p>This web site provides a means of Submitting a Police Report that can be used by the public to report crime.</p>	<ol>		<li><p>To report an emergency or crime in progress call 911 immediately.</p></li>		<li><p>On this web site you may report abandoned vehicle(s), destruction of property, destruction of vehicle(s), hit and run, lost property, theft and theft from a vehicle. For an immediate response please use your telephone and dial 911.</p></li>		<li><p>We encourage good faith reporting of information regarding a crime through this web site. The Baltimore County Police Department reserves the right to contact you to verify or clarify the information you provide.</p></li>		<li><p>Pursuant to Maryland law it is a crime to make false statements and/or misuse electronic communication. Violators will be prosecuted to the full extent of the law.</p></li>	</ol>	<p>Acceptance of the above terms is required in order to continue to the Online Police Report.</p>	<p>The application which you are filing is being filed under oath.</p>		<h3>&#167; 9-501. False statement - To law enforcement officer.</h3>	<p>(a) Prohibited.- A person may not make, or cause to be made, a statement, report, or complaint that the person knows to be false as a whole or in material part, to a law enforcement officer of the State, of a county, municipal corporation, or other political subdivision of the State, or of the Maryland-National Capital Park and Planning Police with intent to deceive and to cause an investigation or other action to be taken as a result of the statement, report, or complaint.</p>	<p>(b) Penalty.- A person who violates this section is guilty of a misdemeanor and on conviction is subject to imprisonment not exceeding 6 months or a fine not exceeding $500 or both.<br />	<p><small>[An Code 1957, art. 27, &sect; 150(a), (c); 2002, ch. 26, &sect; 2.]</small></p>	<p>If your incident qualifies for an online report and you wish to continue,</p></div><a href="' + linkDomain + '" id="leaveThisPage">I Agree</a>&nbsp;&nbsp;&nbsp;<a href="#" id="stayOnPage" onClick="$.fancybox.close();">I Do Not Agree</a>';

        $(this).attr("id", "inline");
        $(this).attr("href", "#data");
        $.fancybox(message, {
            'showCloseButton': false,
            'hideOnOverlayClick': false,
            'onComplete': function () {
                $.fancybox.resize();
                $("a#inline").attr("href", linkDomain);
                //$("a#leaveThisPage").attr("target", "_blank");
                $("a#leaveThisPage").click(function () {
                    $.fancybox.close();

                });
            }
        });


    });
});