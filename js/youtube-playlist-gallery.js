var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.youtubePlaylistGallery = (function($) {

    var documentationLink = 'https://goo.gl/HbhJ1p',
        defaultOptions = {
            target: '.bc-youtube-playlist-gallery',
            templateSelector: '#youtube-playlist-item-template'
        },

        /**
         * Initializes based on supplied options, and throws errors if they're missing. 
         */
        init = function(options) {
            
            if (!options) 
                options = defaultOptions;

            var $youtubePlaylistGalleryTarget = options.target ?  $(options.target.trim()) : $(defaultOptions.target);
            if ($youtubePlaylistGalleryTarget.length === 0) 
                throw 'The "target" option value must be supplied. Please see documentation at ' + documentationLink + '.';

            var templateSelector = options.templateSelector ? options.templateSelector : defaultOptions.templateSelector;

            var playlistId = options.playlistId;
            if (!playlistId || playlistId.length === 0) 
                throw 'The "playlistId" option must be supplied. Please see documentation at ' + documentationLink + '.';

            generatePlaylistItems(playlistId, $youtubePlaylistGalleryTarget, templateSelector, generateYouTubePlaylistHtmlWithHandlebarsCallback);
        },

        /**
         * Makes the requst to the YouTube v3 API.
         */
        generatePlaylistItems = function(playlistId, $target, templateSelector, callback) {
            var url = 'http://testservices.baltimorecountymd.gov/api/playlistgallery/' + playlistId,
                playlistItems = [];

            $.getJSON(url)
                .done(function(data) {
                    callback(data.items, $target, templateSelector);
                }) 
                .fail(function(data) {
                    console.log('Data load from YouTube failed. Response: ' + JSON.stringify(data));
                });
        },

        /**
         * Turns the YouTube data object into an array we can iterate over.
         */
        getYouTubeItemInfoFromPlaylistData = function(playlistData) {
            var youtubeItemInfoArr = [];
            
            for (var i = 0; i < playlistData.length; i++) {
                var youtubeItemInfo = {
                    videoId: playlistData[i].snippet.resourceId.videoId,
                    videoTitle: playlistData[i].snippet.title,
                    thumbnailUrl: playlistData[i].snippet.thumbnails.medium.url,
                    isHidden: i > 5
                };
                youtubeItemInfoArr.push(youtubeItemInfo);
            }

            return youtubeItemInfoArr;
        },

        /**
         * Generates the HTML for the video gallery itself using Handlebars.
         */
        generateYouTubePlaylistHtmlWithHandlebarsCallback = function(playlistItems, $target, templateSelector) {
            var source = $(templateSelector).html(),
                template = Handlebars.compile(source),
                youtubeItemInfoArr = getYouTubeItemInfoFromPlaylistData(playlistItems),
                html = template({ youtubeItemInfo: youtubeItemInfoArr });

            if (playlistItems.length > 6)
                html += '<button type="button" class="contentButton loadMoreButton">LOAD MORE</button>';

            $target.html(html);

            $target.children('.loadMoreButton').first().on('click', function(e) {
                $target.find('.hidden').slice(0,6).removeClass('hidden');

                if ($target.find('.hidden').length === 0)
                    $(e.currentTarget).hide();
            });
        };   

    return {
        init: init
    };

})(jQuery);