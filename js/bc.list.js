var BcList = (function (window, undefined, $, Handlebars) {
    $.support.cors = true;

    var getTemplateAjax = function (options, callback) {
        var source;
        var template;

        $.ajax({
            url: options.path, //ex. js/templates/mytemplate.handlebars
            cache: true,
            dataType: 'text',
            success: function (data) {
                source = data;
                template = Handlebars.compile(source);
                $(options.target).html(template);

                //execute the callback if passed
                if (callback) callback(template);
            },
            error: function (msg) {
                if (callback) callback('error');
            }
        });
    },
    getImageHtml = function (options) {
        var result = "<p class='no-image'>No Image Available</p>";
        if (options.imageUrl) {
            if (!options.petName) {
                //Handle IE8 for decoding base64 images
                result = "<img src='" + options.imageUrl + "' alt='This " + options.petType + " does not have a name, but is " + options.status + "' />";
            } else {
                result = "<img src='" + options.imageUrl + "' alt='This is " + options.petName + ", this " + options.petSex.toLowerCase() + " is " + options.status + "' />";
            }
        }

        return result;
    };

    Handlebars.registerHelper('convertImage', function (imageUrl, petType, petName, petSex, status) {
        imageUrl = Handlebars.Utils.escapeExpression(imageUrl);
        petType = Handlebars.Utils.escapeExpression(petType).toLowerCase();
        petName = Handlebars.Utils.escapeExpression(petName);

        var result = getImageHtml({
            imageUrl: imageUrl,
            petType: petType,
            petName: petName,
            petSex: petSex,
            status: status
        });

        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('toProperCase', function (str) {
        str = Handlebars.Utils.escapeExpression(str);

        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    });
    
     Handlebars.registerHelper('removeTimeFromDate', function (str) {
        str = Handlebars.Utils.escapeExpression(str);
        return str.substring(0, str.indexOf(" "));
    });

    Handlebars.registerHelper('formatTimeIntervalString', function (unit, interval) {
        unit = Handlebars.Utils.escapeExpression(unit);
        interval = Handlebars.Utils.escapeExpression(interval);
        
        if (unit && parseFloat(unit) === 1) {
          return unit + " " + interval.substr(0, interval.length - 1);
        }
        return unit + " " + interval;
    });

		Handlebars.registerHelper('formatShelterArrival', function (str) {

        var returnString = '';
		
		if (str.indexOf(' ') === -1) {		
            returnString = str;
		}
        else {
			returnString = str.substr(0, str.indexOf(' '));
		}         

        return returnString;
    });
	
    var BcList = function (options) {
        var _this = this;
        var ajaxFunctions = {
            beforeSend: function () {
                $(_this.containerClass).html(_this.LoadingMessage);
            },
            complete: function () {
                //Do Something after the complete
            },
            error: function (msg) {
                if (typeof console !== "undefined") {
                    console.error('There was an error when making a request to the server: ', msg);
                }
                return msg;
            },
            success: function (resp, callback) {
                if (callback && typeof callback === 'function') {
                    return callback(resp);
                }
                if (typeof console !== "undefined") {
                    console.error('Add a callback to your success function');
                }
            }
        };

        this.containerClass = options.containerClass ? '.' + options.containerClass : '.bc-list';
        this.source = options.source; //url of the webservice
        this.templatePath = options.templatePath; //template used to display the data
        this.paging = options.paging;
        this.errorMessage = options.hasOwnProperty('errorMessage') ? options.errorMessage : "<h3>Records are temporarily unavailable. Please try again in a few minutes.</h3>";
        this.noRecordsMessage = options.hasOwnProperty('noRecordsMessage') ? options.noRecordsMessage : "<p>There are no other types of animals available for adoption at this time.</p>";
        this.LoadingMessage = options.hasOwnProperty('LoadingMessage') ? options.LoadingMessage : "<h3>Loading Records...</h3>";
        this.beforeSend = options.hasOwnProperty('beforeSend') ? options.beforeSend : ajaxFunctions.beforeSend;
        this.complete = options.hasOwnProperty('complete') ? options.complete : ajaxFunctions.complete;
        this.error = options.hasOwnProperty('error') ? options.error : ajaxFunctions.error;
        this.success = options.hasOwnProperty('success') ? options.success : ajaxFunctions.success;
    };

    BcList.prototype.Get = function (type, callback) {
        var _this = this,
            source = _this.source;
        //If no data is passed in make sure the ajax data attribute is set to an empty object so
        //that it doesn't throw an error
        if (type) {
            source = source + "/" + type;
        }

        // with jsonp
        $.ajax({
            contentType: 'application/json',
            data: {},
            dataType: 'jsonp',
            jsonCallback: function () {
                //do nothing 
            },
            type: 'GET',
            url: source,
            beforeSend: _this.beforeSend,
            success: function (resp) {
                _this.success(resp, callback);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (typeof console !== "undefined") {
                    console.error(xhr.status);
                    console.error(thrownError);
                }
            },
            complete: _this.complete
        });

    };

    BcList.prototype.Show = function (data, callback) {
        var _this = this;
        this.Get(data, function (resp) {
            _this.Render(resp, _this, callback);
        });
    };

    BcList.prototype.Render = function (resp, _this, callback) {
        var template = getTemplateAjax({
            path: _this.templatePath,
            target: '#' + _this.containerClass.replace('.', '') //TODO: add doc for this...do this because it makes for one less configuration
        }, function (temp) {
            var listContent = temp(resp);

            $(_this.containerClass).html(listContent);

            if (!listContent.length) {
                $(_this.containerClass).html(_this.noRecordsMessage);
            }
            if (resp === 'error') {
                $(_this.containerClass).html(_this.errorMessage);
            }

            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    };

    return BcList;

})(window, undefined, jQuery, Handlebars);