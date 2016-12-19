var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.youtubePlaylistGallery = (function($) {

    var that = this;

    that.API_KEY = 'AIzaSyBsGskkWEi-CdCx4dze-ikK2KzE7i-O450';
    that.documentationLink = 'https://goo.gl/HbhJ1p';
    that.defaultOptions = {
        target: '.bc-youtube-playlist-gallery'
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
        var showDescription = options.showDescription ? options.showDescription : that.options.showDescription; 

        getPlaylistItems(playlistId, $youtubePlaylistGalleryTarget, showDescription, generateYouTubePlaylistHtml);
    }

    /*
     * Makes the requst to the YouTube v3 API.
     */
    function getPlaylistItems(playlistId, $target, showDescription, callback) {
        var url = 'https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&playlistId=' + playlistId + '&key=' + API_KEY + '&part=snippet',
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

        html += '<div class="row">';

        for (var i = 0; i < playlistItems.length; i++) {
            
            if (i > 0 && i % 3 === 0)
                if (i < 6)
                    html += '</div><div class="row">';
                else   
                    html += '</div><div class="row hidden">';                

            html +=   '    <div class="youtube-playlist-item">'
                    + '        <i class="fa fa-play-circle-o" aria-hidden="true"></i>'
                    + '        <figure>'
                    + '            <a href="https://www.youtube.com/watch?v=' + playlistItems[i].snippet.resourceId.videoId +  '" title="Video: ' + playlistItems[i].snippet.title + '"><img src="' + playlistItems[i].snippet.thumbnails.medium.url + '" alt="' + playlistItems[i].snippet.title + '" /></a>'
                    + '            <figcaption>'
                    + '                <h4><a href="https://www.youtube.com/watch?v=' + playlistItems[i].snippet.resourceId.videoId +  '" title="Video: ' + playlistItems[i].snippet.title + '">' + playlistItems[i].snippet.title + '</a></h4>';

            if (showDescription)
                html += '                <p>' + playlistItems[i].snippet.description + '</p>';
            
            html +=   '            </figcaption>'
                    + '        </figure>'
                    + '    </div>';           
        }

        html += '</div>';

        if (playlistItems.length > 6)
            html += '<button type="button" class="contentButton loadMoreButton">LOAD MORE</button>';

        $target.html(html);

        $target.children('.loadMoreButton').first().on('click', function(e) {
            $target.find('.hidden').first().removeClass('hidden');
            $target.find('.hidden').first().removeClass('hidden');

            if ($target.find('.hidden').length === 0)
                $(e.currentTarget).hide();
        });
    }

    return {
        init: init
    };

})(jQuery);