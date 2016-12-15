var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.youtubePlaylistGallery = (function($) {

    var API_KEY = 'AIzaSyBsGskkWEi-CdCx4dze-ikK2KzE7i-O450',
        documentationLink = 'https://goo.gl/HbhJ1p';

    /*
     * Initializes based on supplied options, and throws errors if they're missing. 
     */
    function init(options) {
        
        if (!options) 
            throw 'An "options" object must be supplied to the init function. Please see documentation at ' + documentationLink + '.';

        var $youtubePlaylistGalleryTarget = options.target.trim().length === 0 ?  $('.youtube-playlist-gallery') : $(options.target.trim());
        if (!$youtubePlaylistGalleryTarget) 
            throw 'The "target" option must be supplied. Please see documentation at ' + documentationLink + '.';

        var playlistId = options.playlistId;
        if (!playlistId || playlistId.length === 0) 
            throw 'The "playlistId" option must be supplied. Please see documentation at ' + documentationLink + '.';

        getPlaylistItems(playlistId, $youtubePlaylistGalleryTarget, generateYouTubePlaylistHtml)
    }

    /*
     * Makes the requst to the YouTube v3 API.
     */
    function getPlaylistItems(playlistId, $target, callback) {
        var url = 'https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&playlistId=' + playlistId + '&key=' + API_KEY + '&part=snippet',
            playlistItems = [];

        $.getJSON(url)
            .done(function(data) {
                callback(data.items, $target);
            }) 
            .fail(function(data) {
                console.log('Data load from YouTube failed. Response: ' + JSON.stringify(data));
            });
    }

    /*
     * Generates the HTML for the video gallery itself. 
     */
    function generateYouTubePlaylistHtml(playlistItems, $target) {
        var html = '';

        if (!playlistItems || playlistItems.length === 0) 
            throw 'No items are listed for the playlist.';

        for (var i = 0; i < playlistItems.length; i++) {
            html +=   '<div class="youtube-playlist-item">'
                    + '    <h3>' + playlistItems[i].snippet.title + '</h3>'
                    + '    <a href="https://www.youtube.com/watch?v=' + playlistItems[i].snippet.resourceId.videoId +  '" target="_blank"><img src="' + playlistItems[i].snippet.thumbnails.medium.url + '" alt="' + playlistItems[i].snippet.descrption + '" /></a>'
                    + '</div>'
        }

        $target.html(html);
    }

    return {
        init: init
    };

})(jQuery);