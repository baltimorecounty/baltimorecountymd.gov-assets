namespacer('baltimoreCounty');

baltimoreCounty.photoGallery = (function(undefined) {

    /**
     * Makes the request to pull back the image data.
     */
    var getPhotoData = function(dataPath) {
        return $.ajax(dataPath);
    },

    /**
     * Makes the ajax call to create the gallery, and attaches it to the 
     * click event of the gallery preview.
     */
    init = function(dataPath) {
        var settings = {
			helpers: {
				title: {
					type: 'over'
				}
			},
			beforeShow: function() {
				this.title = '(Image ' + (this.index + 1) + ' of ' + this.group.length + ') ' + this.title;
			},
            tpl: {
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
                prev: '<a title="Prev" class="fancybox-nav fancybox-prev" href="javascript:;"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>'
            }
        };

        getPhotoData(dataPath)
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