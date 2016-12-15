var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.youtubePlaylistGallery = (function($) {

    var API_KEY = 'AIzaSyBsGskkWEi-CdCx4dze-ikK2KzE7i-O450',
        documentationLink = 'https://goo.gl/HbhJ1p';

    function init(options) {
        if (!gapi)
            throw 'YouTube v3 API not loaded.';
        
        if (!options) 
            throw 'An "options" object must be supplied to the init function. Please see documentation at ' + documentationLink + '.';

        var $youtubePlaylistGalleryTarget = options.target || $('.youtube-playlist-gallery');
        if (!$youtubePlaylistGalleryTarget) 
            throw 'The "target" option must be supplied. Please see documentation at ' + documentationLink + '.';

        var playlistId = options.playlistId;
        if (!playlistId) 
            throw 'The "playlistId" option must be supplied. Please see documentation at ' + documentationLink + '.';

        $youtubePlaylistGalleryTarget.html(getYouTubePlaylistHtml(playlistId));
    }

    function youtubeRequest() {
        // Initializes the client with the API key and the Translate API.
        gapi.client.init({
            'apiKey': API_KEY
        }).then(function() {
            // Executes an API request, and returns a Promise.
            // The method name `language.translations.list` comes from the API discovery.
            return gapi.client.language.translations.list({
            q: 'hello world',
            source: 'en',
            target: 'de',
            });
        }).then(function(response) {
            console.log(response.result.data.translations[0].translatedText);
        }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    };

    function getYouTubePlaylistHtml(playlistId) {
        gapi.load('client', youtubeRequest);        
    }

    return {
        init: init
    };

})(jQuery);