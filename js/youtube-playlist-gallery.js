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

            var $youtubePlaylistGalleryTarget = options.target ?  $(options.target.trim()) : $(defaultOptions.target),
                templateSelector = options.templateSelector ? options.templateSelector : defaultOptions.templateSelector,
                playlistId = options.playlistId;
            
            if ($youtubePlaylistGalleryTarget.length === 0) 
                throw 'The "target" option value must be supplied. Please see documentation at ' + documentationLink + '.';
            
            if (!playlistId || playlistId.length === 0) 
                throw 'The "playlistId" option must be supplied. Please see documentation at ' + documentationLink + '.';
            
             getPlaylistDataFromYouTube(playlistId)
                .done(function(data) {
                    var playlistItems = getYouTubeItemInfoFromPlaylistData(data.items),
                        html;

                    if (playlistItems.length) {
                        html = generateYouTubePlaylistHtmlWithHandlebars(playlistItems, $youtubePlaylistGalleryTarget, templateSelector);
                    } else {
                        html = '<div role="alert" class="alert-warning"><p>An error has occurred retreiving the videos from YouTube.</p></div>';
                    }

                    $youtubePlaylistGalleryTarget.html(html).find('.youtube-playlist-item p a').elliptical();

                    $youtubePlaylistGalleryTarget.children('.loadMoreButton').first().on('click', function(e) {
                        var $hiddenItems = $youtubePlaylistGalleryTarget.find('.hidden');
                        if ($hiddenItems.length) 
                            var $revealed = $hiddenItems.slice(0,6).removeClass('hidden').find('p a').elliptical();
                        if ($hiddenItems.length <= 6)
                            $(e.currentTarget).hide();
                    });
                })
                .fail(function(data) {
                    console.log('Data load from YouTube failed. Response: ' + JSON.stringify(data));
                });
        },

        /**
         * Makes the requst to the YouTube v3 API.
         */
        getPlaylistDataFromYouTube = function(playlistId) {
            var url = 'https://testservices.baltimorecountymd.gov/api/playlistgallery/' + playlistId;

            return $.getJSON(url);
        },

        /**
         * Turns the YouTube data object into an array we can iterate over.
         */
        getYouTubeItemInfoFromPlaylistData = function(playlistData) {
            var youtubeItemInfoArr = [];
            
            if (playlistData) {
                for (var i = 0; i < playlistData.length; i++) {
                    if (playlistData[i].snippet) {
                        try {
                            var youtubeItemInfo = {
                                videoId: playlistData[i].snippet.resourceId.videoId.toString(),
                                videoTitle: playlistData[i].snippet.title.toString(),
                                thumbnailUrl: playlistData[i].snippet.thumbnails.medium.url.toString(),
                                isHidden: i > 5
                            };
                           youtubeItemInfoArr.push(youtubeItemInfo);
                        } catch (exception) {
                            console.log('Incomplete data in the following snippet: ' + JSON.stringify(playlistData[i]));
                        }
                    }
                }
            }
            return youtubeItemInfoArr;
        },

        /**
         * Generates the HTML for the video gallery itself using Handlebars.
         */
        generateYouTubePlaylistHtmlWithHandlebars = function(youtubeItemInfoArr, $target, templateSelector) {
            var source = $(templateSelector).html(),
                template = Handlebars.compile(source),
                html = template({ youtubeItemInfo: youtubeItemInfoArr });

            if (youtubeItemInfoArr.length > 6)
                html += '<button type="button" class="contentButton loadMoreButton">LOAD MORE</button>';

            return html;
        };   

    return {
        /* test-code */
        getYouTubeItemInfoFromPlaylistData: getYouTubeItemInfoFromPlaylistData,
        /* end-test-code */
        init: init
    };

})(jQuery);