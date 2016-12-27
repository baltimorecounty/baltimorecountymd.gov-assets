var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.youtubePlaylistGallery = (function($) {

    var that = this;

    that.documentationLink = 'https://goo.gl/HbhJ1p';
    that.defaultOptions = {
        target: '.bc-youtube-playlist-gallery',
        showDescription: false
    };

    /*
     * Initializes based on supplied options, and throws errors if they're missing. 
     */
    function init(options) {
        
        if (!options) 
            options = that.options;

        var $youtubePlaylistGalleryTarget = options.target ?  $(options.target.trim()) : $(that.defaultOptions.target);
        if (!$youtubePlaylistGalleryTarget.length === 0) 
            throw 'The "target" option value must be supplied. Please see documentation at ' + documentationLink + '.';

        var playlistId = options.playlistId;
        if (!playlistId || playlistId.length === 0) 
            throw 'The "playlistId" option must be supplied. Please see documentation at ' + documentationLink + '.';

        // A little redundant, but since null isn't quite false, let's check anyway.
        var showDescription = options.showDescription ? options.showDescription : that.defaultOptions.showDescription; 

        getPlaylistItems(playlistId, $youtubePlaylistGalleryTarget, showDescription, generateYouTubePlaylistHtml);
    }

    /*
     * Makes the requst to the YouTube v3 API.
     */
    function getPlaylistItems(playlistId, $target, showDescription, callback) {
        var url = 'http://ba224964:1000/api/playlistgallery/' + playlistId,
            playlistItems = [];

        $.getJSON(url)
            .done(function(data) {
                callback(data.items, $target, showDescription);
            }) 
            .fail(function(data) {
                console.log('Data load from YouTube failed. Response: ' + JSON.stringify(data));
            });
    }

    /*
     * Generates the HTML for the video gallery itself. 
     */
    function generateYouTubePlaylistHtml(playlistItems, $target, showDescription) {
        var html = '';

        if (!playlistItems || playlistItems.length === 0) 
            throw 'No items are listed for the playlist.';

        for (var i = 0; i < playlistItems.length; i++) {
            var targetThumbnail = getLargestThumbnail(playlistItems[i].snippet.thumbnails);

            html +=   '    <div class="youtube-playlist-item hidden">'
                    + '        <figure>'
                    + '            <a href="https://www.youtube.com/watch?v=' + playlistItems[i].snippet.resourceId.videoId +  '" title="Video: ' + playlistItems[i].snippet.title + '"><i class="fa fa-play-circle-o" aria-hidden="true"></i><img src="' + targetThumbnail.url + '" alt="' + playlistItems[i].snippet.title + '" /></a>'
                    + '            <figcaption>'
                    + '                <p><a href="https://www.youtube.com/watch?v=' + playlistItems[i].snippet.resourceId.videoId +  '" title="Video: ' + playlistItems[i].snippet.title + '">' + playlistItems[i].snippet.title + '</a></p>';

            if (showDescription)
                html += '                <p>' + playlistItems[i].snippet.description + '</p>';
            
            html +=   '            </figcaption>'
                    + '        </figure>'
                    + '    </div>';                   
        }

        if (playlistItems.length > 6)
            html += '<button type="button" class="contentButton loadMoreButton">LOAD MORE</button>';

        $target.html(html);
        
        $target.find('.hidden').slice(0,6).removeClass('hidden');

        $target.children('.loadMoreButton').first().on('click', function(e) {
            $target.find('.hidden').slice(0,6).removeClass('hidden');

            if ($target.find('.hidden').length === 0)
                $(e.currentTarget).hide();
        });
    }

    /*
     * Returns the largest non-null thumbnail.
     */
    function getLargestThumbnail(thumbnails) {
        /*if (thumbnails.maxres) 
            return thumbnails.maxres;
        if (thumbnails.standard) 
            return thumbnails.standard;
        if (thumbnails.high) 
            return thumbnails.high;*/
        if (thumbnails.medium) 
            return thumbnails.medium;
    }

    return {
        init: init
    };

})(jQuery);