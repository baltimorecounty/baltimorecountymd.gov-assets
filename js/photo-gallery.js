namespacer('baltimoreCounty');

baltimoreCounty.photoGallery = (function(undefined) {

    var getPhotoData = function() {
        return $.ajax('/mockups/photo-gallery/photos.json');
    },

    init = function() {
        var settings = {
			helpers: {
				title: {
					type: 'over'
				}
			},
			beforeShow: function() {
				this.title = '(Image ' + (this.index + 1) + ' of ' + this.group.length + ') ' + this.title;
			}
        };

        getPhotoData()
            .done(function(data) {
                $('.bc-photo-gallery a').on('click', function() {
                    $.fancybox.open(data, settings);
                });
           })
            .fail(function(xhr, status, error) {
                console.log('Photo data not retrieved.', status, error);
            });
    };

    return {
        init: init
    };

})();

$(function() {
    baltimoreCounty.photoGallery.init();
});