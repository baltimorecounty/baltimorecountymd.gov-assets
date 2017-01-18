var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.youtubePlaylistGallery = (function($) {

    var documentationLink = 'https://goo.gl/HbhJ1p',
        defaultOptions = {
            target: '.bc-youtube-playlist-gallery',
            templateSelector: '#youtube-playlist-item-template',
            showDescription: false
        },

        /*
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

            // A little redundant, but since null isn't quite false, let's check anyway.
            var showDescription = options.showDescription ? options.showDescription : defaultOptions.showDescription; 

            getPlaylistItems(playlistId, $youtubePlaylistGalleryTarget, templateSelector, showDescription, generateYouTubePlaylistHtmlWithHandlebars);
        },

        /*
        * Makes the requst to the YouTube v3 API.
        */
        getPlaylistItems = function(playlistId, $target, templateSelector, showDescription, callback) {
            var url = 'http://testservices.baltimorecountymd.gov/api/playlistgallery/' + playlistId,
                playlistItems = [];

            $.getJSON(url)
                .done(function(data) {
                    callback(data.items, $target, templateSelector, showDescription);
                }) 
                .fail(function(data) {
                    console.log('Data load from YouTube failed. Response: ' + JSON.stringify(data));
                });
        },

        /*
        * Generates the HTML for the video gallery itself using Handlebars.
        */
        generateYouTubePlaylistHtmlWithHandlebars = function(playlistItems, $target, templateSelector, showDescription) {
            var source = $(templateSelector).html();
            var template = Handlebars.compile(source);

            var youtubeItemInfoArr = [];
            
            for (var i = 0; i < playlistItems.length; i++) {
                var youtubeItemInfo = {
                    videoId: playlistItems[i].snippet.resourceId.videoId,
                    videoTitle: playlistItems[i].snippet.title,
                    thumbnailUrl: playlistItems[i].snippet.thumbnails.medium.url,
                    isHidden: i > 5
                };
                youtubeItemInfoArr.push(youtubeItemInfo);
            }

            var html = template({ youtubeItemInfo: youtubeItemInfoArr });
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