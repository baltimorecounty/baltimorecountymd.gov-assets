var ShowNews = (function($) {
    /*News Related Methods*/
    var createReadMoreLink = function($newsItem, $link) {
            $newsItem.append($link.clone().html("Read More >>"));
        },
        getDisplayDate = function(date) {
            var Months = {
                "0": "January",
                "1": "February",
                "2": "March",
                "3": "April",
                "4": "May",
                "5": "June",
                "6": "July",
                "7": "August",
                "8": "September",
                "9": "October",
                "10": "November",
                "11": "December"
            };
            var isGMT = date.indexOf("GMT") > -1
            var dateObj = new Date(date);
            if (isGMT) {
                dateObj.setHours(dateObj.getHours() - 4);
            }
            var month = Months[dateObj.getMonth()];
            var day = dateObj.getDate();

            return month + " " + day;
        },
        getExcerpt = function($newsItemDesc) {
            var supportsCustomElements = !!$('seml', $newsItemDesc).html(),
                excerptHtml = supportsCustomElements ? $newsItemDesc.children().html() : $newsItemDesc.html(),
                htmlArray = removeUnwantedItems($.parseHTML(excerptHtml));

            if (htmlArray.length) {
                return supportsCustomElements ? htmlArray[1].textContent : htmlArray[1].innerText;
            }
            return null;
        },
        removeUnwantedItems = function(htmlArray) {

            if (htmlArray) {
                for (var i = 0, len = htmlArray.length; i < len; i++) {
                    var item = htmlArray[i];

                    if (!item) {
                        htmlArray.splice(i, 1);
                    } else {
                        //i > 1 keeps the first two items of the array regardless if they are a bad item, unless they are empty or bad.  The first two items of the array should either be a p tag or h2 tag 
                        var isBadItem = i > 1 && item && (item.tagName === 'IMG' || item.tagName === 'UL' || (item.innerHTML && item.innerHTML.indexOf('seimage') > 0)),
                            isBadChildItem = i > 1 && item && (item.children && item.children[0] && item.children[0].tagName === 'IMG'),
                            isBadElement = item && item.tagName === undefined,
                            isEmptyItem = item && $.trim(item.innerHTML).length === 0;

                        if (isBadItem || isBadChildItem || isBadElement || isEmptyItem) {
                            htmlArray.splice(i, 1);
                        }
                    }
                }
                return htmlArray;
            }
            return [];
        },
        setDisplayDate = function($newsItem, date) {
            $('.title', $newsItem).after("<span class='pub-date'>" + date + "</span>");
        },
        showNewsSummaries = function() {
            var $newsItems = $('.item');
            $newsItems.each(function($item) {
                var $newsItem = $(this),
                    $newsItemDesc = $newsItem.find('.description'),
                    $linkToEntry = $newsItem.find("h3").find("a"),
                    pubDate = getDisplayDate($('.pubDate', $newsItem).text());

                //Create a read more linked based on the Blog Title's Anchor Href
                createReadMoreLink($newsItem, $linkToEntry);

                //Include the published date after the news title
                setDisplayDate($newsItem, pubDate);

                //Ensure that the exceprt text is not too long
                //For now we are limiting it to 50 words
                //If for some reason there is nothing in teh story, ste the story to an empty string
                var excerpt = getExcerpt($newsItemDesc);
                var excerptText = trimExceprtText(excerpt, 50) || '';

                $newsItemDesc.html("<p>" + excerptText + "</p>");
            });
        },
        trimExceprtText = function(excerpt, limit) {
            if (excerpt) {
                var words = excerpt.split(' ');
                return words.length < limit ? excerpt : words.splice(0, limit).join(" ") + "...";
            }
            return '';
        };
    //Hide the neccessary items to show the news summary
    //Used because Site Executive does not offer this feature
    $(document).ready(function() {
        var $newsFeed = $('.news-feed');
        $newsFeed.find('.item').eq(2).css("clear", "both"); //Hack, adds cleafix to syndication module
        showNewsSummaries();
    });

    /* test-code */
    return {
        getDisplayDate: getDisplayDate
    };
    /* end-test-code */

})(jQuery);