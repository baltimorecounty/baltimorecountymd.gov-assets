(function($) {
        // bind a click event to the 'skip' link
        $(document).on('click', '.skip', function(event){
    
            // strip the leading hash and declare
            // the content we're skipping to
            var skipTo="#"+this.href.split('#')[1];
    
            // Setting 'tabindex' to -1 takes an element out of normal 
            // tab flow but allows it to be focused via javascript
            $(skipTo).attr('tabindex', -1).on('blur focusout', function () {
    
                // when focus leaves this element, 
                // remove the tabindex attribute
                $(this).removeAttr('tabindex');
    
            }).focus(); // focus on the content container
        });
})(jQuery);
var TextResizer = (function (window, undefined, $) {
    var TextResizer = function (options) {
        this.listClass = options.listClass || "text-resizer";
        this.normalBtnId = options.normalBtnId || "normal-text";
        this.largeBtnId = options.largeBtnId || "large-text";
        this.largestBtnId = options.largestBtnId || "largest-text";
        this.mainContainerId = options.mainContainerId || "main-content";

        var largeTextClass = 'large-text',
            largestTextClass = 'largest-text',
            $textButtonList = $('.' + this.listClass),
            $mainContainer = $("#" + this.mainContainerId),
            existsLocalStorage = typeof (Storage) !== "undefined",
            activeClass = 'active';

        var getPreference = function () {
            return existsLocalStorage && localStorage.getItem("size");
        },
        initialize = function () {
            var preference = getPreference();
            if (!preference) {
                preference = "normal-text";
            }

            $textButtonList.find("#" + preference).addClass(activeClass);
            $mainContainer.addClass(preference);
        },
        removePreference = function () {
            localStorage.removeItem("size");
        },
        savePreference = function (size) {
            if (existsLocalStorage) {
                localStorage.setItem("size", size);
            }
        };

        $(document).on('click', $textButtonList.selector + " button", function() {
            $textButtonList.find("button").removeClass(activeClass);
            $(this).addClass(activeClass);
        });

        /*Text Resizer Events*/
        $(document).on('click', '#' + this.normalBtnId, function (e) {
            e.preventDefault();
            
            $mainContainer.removeClass(largeTextClass + " " + largestTextClass);
            
            removePreference();
        });

        $(document).on('click', '#' + this.largeBtnId, function (e) {
            e.preventDefault();

            $mainContainer.removeClass(largestTextClass)
                .addClass(largeTextClass);

            savePreference(largeTextClass);
        });

        $(document).on('click', '#' + this.largestBtnId, function (e) {
            e.preventDefault();

            $mainContainer.removeClass(largeTextClass)
                .addClass(largestTextClass);

            savePreference(largestTextClass);
        });

        initialize();

    };

    return TextResizer;
})(window, undefined, jQuery);
(function() {
    /*Initialize teh Text Resizer*/
    var textResizer = new TextResizer({
        listClass: "resizer-list"
    });   
})();
(function () {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-716612-1', 'auto');
    ga('send', 'pageview');
})();

(function($) {
    var sendGoogleEvent = function(desc, act) {
        act = act || 'click';
        ga('send', 'event', 'button', act, desc);
    };

    /*Event handling*/
    //Search Button
    $(document).on('click', '.search-button', function() {
        sendGoogleEvent('search-button');
    });
    //Search Result
    $(document).on('click', '.gsc-table-result div.gs-title a.gs-title', function() {
        sendGoogleEvent('search-result');
    });
})(jQuery);
    
function isIE(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
}

/*
ReView.js 0.65b. The Responsive Viewport. responsiveviewport.com.
Developed by Edward Cant. @opticswerve.
*/
if(!isIE()) {
	function Viewport(){this.viewport=function(a){var b=document,d=b.documentElement;b.head=b.head||b.getElementsByTagName("head")[0];var e=screen,c=this,f=window;c.bScaled=!1;c.bSupported=!0;b.addEventListener===a?c.bSupported=!1:b.querySelector===a?c.bSupported=!1:f!==parent?c.bSupported=!1:f.orientation===a&&(c.bSupported=!1);c.updateOrientation();c.updateScreen();c.dpr=1;var g=f.devicePixelRatio;g===a?c.bSupported=!1:c.dpr=g;c.fromHead();this.meta!==a&&(c.iHeight=c.height,c.iMaxScale=c.maxScale,c.iMinScale=
c.minScale,c.iUserScalable=c.bUserScalable,c.iWidth=c.width);c.defaultWidth=1200;e.width>c.defaultWidth&&(c.defaultWidth=e.width);e.height>c.defaultWidth&&(c.defaultWidth=e.height);c.ready(function(){if(c.bSupported){if(f.screenX!==0)c.bSupported=false;else if(c.width!==a){var e;if(d.offsetHeight<=d.clientHeight){e=d.style.height;d.style.height=d.clientHeight+128+"px"}if(c.width==="device-width"){if(d.clientWidth!==c.screenWidth)c.bSupported=false}else if(c.width!==d.clientWidth)c.bSupported=false;
e===""?d.style.height="auto":e!==a&&(d.style.height=e)}if(c.bSupported){b.addEventListener("touchend",function(){var b=(new Date).getTime();if(c.lastTouch!==a&&b-c.lastTouch<500&&c.bUserScalable===true)c.bScaled=true;c.lastTouch=b},false);b.addEventListener("gestureend",function(a){if(a.scale!==1&&c.bUserScalable===true)c.bScaled=true},false);b.addEventListener("resize",function(){c.updateCheck()},false);b.addEventListener("orientationchange",function(){var b=c.orientation;c.updateOrientation();if(b!==
c.orientation){c.updateScreen();if(c.bUserScalable===true)c.bScaled=true;c.orientationChangePolicy!==a&&c.orientationChangePolicy()}},false)}}c.readyPolicy!==a&&c.readyPolicy()})};this.fromContentString=function(a){for(var a=a.split(","),b,d,e=0;e<a.length;e++)b=a[e].split("="),2===b.length&&(d=b[0].trim(),b=b[1].trim(),isNaN(parseFloat(b))||(b=parseFloat(b)),"width"===d?this.width=b:"height"===d?this.height=b:"initial-scale"===d?this.initialScale=b:"maximum-scale"===d?this.maxScale=b:"minimum-scale"===
d?this.minScale=b:"user-scalable"===d&&(this.bUserScalable="no"===b?!1:!0))};this.fromHead=function(){var a=this.meta=document.head.querySelector("meta[name=viewport]");null===a?this.meta=void 0:a.hasAttribute("content")&&this.fromContentString(a.getAttribute("content"))};this.ready=function(a){var b=document;b.addEventListener&&b.addEventListener("DOMContentLoaded",function(){b.removeEventListener("DOMContentLoaded",arguments.callee,!1);a()},!1)};this.setDefault=function(a,b){this.bUserScalable=
!0;this.height=void 0;this.maxScale=5;this.minScale=0.25;this.width=this.defaultWidth;this.update(a,b)};this.setMobile=function(a,b){this.bScaled?b():(void 0===this.iWidth?(this.bUserScalable=!1,this.height=void 0,this.minScale=this.maxScale=1,this.width="device-width"):(this.bUserScalable=this.iUserScalable,this.height=this.iHeight,this.maxScale=this.iMaxScale,this.minScale=this.iMinScale,this.width=this.iWidth),this.update(a,b))};this.toString=function(){var a="";void 0!==this.width&&(a+="width="+
this.width+", ");void 0!==this.height&&(a+="height="+this.height+", ");void 0!==this.maxScale&&(a+="maximum-scale="+this.maxScale+", ");void 0!==this.minScale&&(a+="minimum-scale="+this.minScale+", ");!0===this.bUserScalable?a+="user-scalable=yes":!1===this.bUserScalable&&(a+="user-scalable=no");return a};this.update=function(a,b){var d=this;if(d.bSupported){d.updateFailure=b;d.updateSuccess=a;var e=d.width;"device-width"===e&&(e=d.screenWidth);e=d.prevWidth;"device-width"===e?e=d.screenWidth:void 0===
e&&(e=document.documentElement.clientWidth);d.updateMeta();d.updateTimeout=setTimeout(function(){d.updateCheck()},500)}else b()};this.updateCheck=function(){if(void 0!==this.updateTimeout){var a=!1,b=document.documentElement.clientWidth;this.width===b?a=!0:"device-width"===this.width&&this.screenWidth===b&&(a=!0);clearTimeout(this.updateTimeout);this.updateTimeout=void 0;a?(this.prevWidth=this.width,this.updateSuccess(),this.viewportChange()):(this.bSupported=!1,this.updateFailure());this.updateSuccess=
this.updateFailure=void 0}};this.updateMeta=function(){var a=document,b=this.meta;void 0===b?(b=this.meta=a.createElement("meta"),b.setAttribute("name","viewport"),b.setAttribute("content",this.toString()),a.head.appendChild(b)):b.setAttribute("content",this.toString())};this.updateOrientation=function(){var a=window.orientation;this.orientation=a=0===a||180===a?"portrait":90===a||-90===a?"landscape":document.documentElement.clientWidth>document.documentElement.clientHeight?"landscape":"portrait"};
this.updateScale=function(){this.scale=this.screenWidth/window.innerWidth};this.updateScreen=function(){var a=this.screenHeight=screen.height,b=this.screenWidth=screen.width;"portrait"===this.orientation?b>a&&(this.screenHeight=b,this.screenWidth=a):b<a&&(this.screenHeight=b,this.screenWidth=a)};this.viewportChange=function(){var a=document.createEvent("Event");a.initEvent("viewportChange",!0,!0);a.bUserScalable=this.bUserScalable;a.maxScale=this.maxScale;a.minScale=this.minScale;a.width=this.width;
document.dispatchEvent(a)};return!0}var reView;(function(a){reView=new ReView;if(reView.v.bSupported)try{if("sessionStorage"in a&&null!==a.sessionStorage){var b=sessionStorage.getItem("reViewMode");"core"===reView.mode&&"default"===b?reView.setDefault():"default"===reView.mode&&"core"===b&&reView.setCore()}else reView.v.bSupported=!1}catch(d){reView.v.bSupported=!1}})(window);
function ReView(){this.mode="default";this.v=new Viewport;this.v.viewport();this.v.readyPolicy=function(){reView.ready()};this.v.bSupported&&"device-width"===this.v.width&&(this.mode="core");this.failure=function(){var a=reView;a.mode==="default"&&a.v.iWidth!==void 0&&window.location.reload();a.failurePolicy!==void 0&&a.failurePolicy()};this.ready=function(){var a=document.getElementsByClassName("reView"),b=a.length,d=reView;if(d.v.bSupported){for(d.mode==="default"&&sessionStorage.getItem("reViewMode")!==
"core"&&d.success();b--;)a[b].style.display="inline";document.body.addEventListener("click",function(a){if(a.target.hasAttribute("class")&&a.target.getAttribute("class").indexOf("reView")>-1){a.preventDefault();d.mode==="default"?d.setCore():d.mode==="core"&&d.setDefault()}})}else for(screen.width>=1024&&d.success();b--;)a[b].style.display="none"};this.setCore=function(){if(this.mode==="core")this.success();else if(this.v.bSupported){try{sessionStorage.setItem("reViewMode","core")}catch(a){}this.v.setMobile(function(){reView.mode=
"core";reView.success()},reView.failure)}else this.failure()};this.setDefault=function(){if(this.mode==="default")this.success();else if(this.v.bSupported){try{sessionStorage.setItem("reViewMode","default")}catch(a){}this.v.setDefault(function(){reView.mode="default";reView.success()},reView.failure)}else this.failure()};this.success=function(){var a=reView;a.v.bSupported&&a.updateAnchors();a.successPolicy!==void 0&&a.successPolicy()};this.updateAnchors=function(){var a=document.getElementsByClassName("reView"),
b=a.length;if(this.mode==="core")for(;b--;)a[b].innerHTML=a[b].hasAttribute("data-coreText")?a[b].getAttribute("data-coreText"):"Default View";else for(;b--;)a[b].innerHTML=a[b].hasAttribute("data-defaultText")?a[b].getAttribute("data-defaultText"):"Core View"};return!0};
}
(function ($) {
    window.addEventListener("message",

    function (e) {
        if (e.data === "search-focused") {
            $('iframe').css('z-index', 999999);
        }
        if (e.data === "search-blurred") {
            $('iframe').css('z-index', 0);
        }
    },
    false);

})(jQuery);
(function($, TextResizer) {
	/*Prevent a search with no text*/
	$(document).on('click', '.search-button', function (e) {
        var val = $('.search-input').val();

        if (val.length === 0) {
            e.preventDefault();
        }
    });

	/*Toggle hamburger menu*/
    $(document).on('click', '.hamburger-btn', function(e) {
        e.preventDefault();
        $('.primary-nav, .secondary-nav').toggleClass('mobile-menu-visible');
    });

    /*Submit url to rate form*/
    $(document).on('submit', '#RateThisPageForm', function(){ 
        document.getElementById('url').value = window.location.href;
        
        if ($('input#website').val().length) {
            return false;
        } 
    });

    /*Initialize the Text Resizer*/
    $(document).ready(function () {
        var textResizer = new TextResizer({
            listClass: "resizer-list"
        });
    });
})(jQuery, TextResizer);
var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.youtubePlaylistGallery = (function($) {

    var that = this;

    that.API_KEY = 'AIzaSyBsGskkWEi-CdCx4dze-ikK2KzE7i-O450';
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
        var url = 'http://ba224964.bcg.ad.bcgov.us:1000/api/youtube/' + playlistId,
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
                    + '        <figure>'
                    + '            <a href="https://www.youtube.com/watch?v=' + playlistItems[i].snippet.resourceId.videoId +  '" title="Video: ' + playlistItems[i].snippet.title + '"><i class="fa fa-play-circle-o" aria-hidden="true"></i><img src="' + playlistItems[i].snippet.thumbnails.medium.url + '" alt="' + playlistItems[i].snippet.title + '" /></a>'
                    + '            <figcaption>'
                    + '                <p><a href="https://www.youtube.com/watch?v=' + playlistItems[i].snippet.resourceId.videoId +  '" title="Video: ' + playlistItems[i].snippet.title + '">' + playlistItems[i].snippet.title + '</a></p>';

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