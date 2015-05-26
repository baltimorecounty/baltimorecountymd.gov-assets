var ShowNews = (function ($) {
    /*News Related Methods*/
    var createReadMoreLink = function ($newsItem, $link) {
        $newsItem.append($link.clone().html("Read More >>"));
    },
    getDisplayDate = function (date) {
        var Months = {
            "Jan": "January",
                "Feb": "February",
                "Mar": "March",
                "Apr": "April",
                "May": "May",
                "Jun": "June",
                "Jul": "July",
                "Aug": "August",
                "Sep": "September",
                "Oct": "October",
                "Nov": "November",
                "Dec": "December"
        },
        dateParts = date.split(" "),
            month = Months[dateParts[2]],
            day = dateParts[1];

        return month + " " + day;
    },
    getExcerpt = function ($newsItemDesc) {
        var supportsCustomElements = !! $('seml', $newsItemDesc).html().length,
            excerptHtml = supportsCustomElements ? $newsItemDesc.children().html() : $newsItemDesc.html(),
            htmlArray = removeUnwantedItems($.parseHTML(excerptHtml));
        return supportsCustomElements ? htmlArray[1].textContent : htmlArray[2].innerText;
    },
    removeUnwantedItems = function (htmlArray) {
        for (var i = 0, len = htmlArray.length; i < len; i++) {
            var item = htmlArray[i],
                isBadItem = item && (item.tagName === 'IMG' || item.tagName === 'UL' || (item.innerHTML && item.innerHTML.indexOf('seimage') > 0)),
                isBadChildItem = item && (item.children && item.children[0] && item.children[0].tagName === 'IMG'),
                    isBadElement = item && item.tagName === undefined;
            if (isBadItem || isBadChildItem || isBadElement) {
                htmlArray.splice(i, 1);
            }
        }
        return htmlArray;
    },
    setDisplayDate = function ($newsItem, date) {
        $('.title', $newsItem).after("<span class='pub-date'>" + date + "</span>");
    },
    showNewsSummaries = function () {
        var $newsItems = $('.item');

        $newsItems.each(function ($item) {
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
            var excerpt = getExcerpt($newsItemDesc),
                excerptText = trimExceprtText(excerpt, 50);

            $newsItemDesc.html("<p>" + excerptText + "</p>");
        });
    },
    trimExceprtText = function (excerpt, limit) {
        var words = excerpt.split(' ');

        return words.length < limit ? excerpt : words.splice(0, limit).join(" ") + "...";
    };
    //Hide the neccessary items to show the news summary
    //Used because Site Executive does not offer this feature
    $(document).ready(function () {
        var $newsFeed = $('.news-feed');
        $newsFeed.find('.item').eq(2).css("clear", "both"); //Hack, adds cleafix to syndication module
        showNewsSummaries();
    });

})(jQuery);