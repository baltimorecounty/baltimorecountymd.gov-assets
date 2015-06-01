var Flickr = (function(window, undefined, $, Handlebars) {
  $.support.cors = true;
  var Flickr = function(options) {
    this.apiKey = options.apiKey || console.error("You need to specify an api key.");
    this.nsid = options.nsid || console.error("You need to specify an user NSID."); //56007743@N08, http://idgettr.com/
    this.searchTags = options.searchTags || "";
    this.template = options.template || console.error("You need to specify a template to display the data.");
    this.$container = options.$container || $('.flickr-feed');
    this.numberOfImages = options.numberOfImages || 4;

    var _this = this,
      $feedHeadline = $('.county-photo-feed-headline'),
      buildUrl = function() {
        return 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + _this.apiKey + '&tags=' + _this.searchTags + '&per_page=' + _this.numberOfImages + '&user_id=' + _this.nsid + '&format=json&jsoncallback=?';
      },
      getData = function() {
        var url = buildUrl();

        $.getJSON(url, function(data, status) {
          if (status.toLowerCase() === 'success') {
            showFlickrFeed(data.photos.photo);
          } else {
            _this.$container.hide();
            $feedHeadline.hide();
          }
        });
      },
      init = function() {
        return getData();
      },
      showFlickrFeed = function(data) {
        var htmlTemplate = Handlebars.compile(_this.template),
          html = htmlTemplate(data);

        _this.$container.html(html);
      };

    init();

  };
  return Flickr;
})(window, undefined, jQuery, Handlebars);