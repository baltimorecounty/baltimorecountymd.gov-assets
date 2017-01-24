namespacer('baltimoreCounty');

baltimoreCounty.photoGallery = (function(undefined) {

    var getPhotoData = function() {
        return $.ajax('/mockups/photo-gallery/photos.json');
    },

    buildGallery = function(targetSelector) {
        getPhotoData()
            .done(function(data) {
                var source = $('#photo-gallery-template').html(),
                    template = Handlebars.compile(source),
                    html = template({ photoItem: data });           
                $(targetSelector).html(html);
                $('.bc-photo-gallery p').elliptical();
           })
            .fail(function(xhr, status, error) {
                console.log('Photo data not retrieved.', status, error);
            });
    },

    init = function() {
        buildGallery('.bc-photo-gallery');
    };

    return {
        init: init
    };

})();