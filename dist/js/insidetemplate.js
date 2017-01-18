// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
  Array.prototype.some = function(fun/*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}
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
/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=291973edd1db2862ed4cd150643ae4f7)
 * Config saved to config.json and https://gist.github.com/291973edd1db2862ed4cd150643ae4f7
 */
if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}
+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

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

baltimoreCounty.contentFilter = (function($) {

    /* Private Properties ******************************************/

    var that = this;
    that.options = {};

    /* Public Methods ******************************************/ 

    /*
     * Initialize the filter, and activate it.
     */
    function init(options) {

        options = options || {};

        that.options.wrapperSelector = options.wrapper || '.bc-filter-content';
        that.options.searchBoxSelector = options.searchBox || '.bc-filter-form .bc-filter-form-filter';
        that.options.clearButtonSelector = options.clearButton || '.bc-filter-form .bc-filter-form-clearButton';
        that.options.errorMessageSelector = options.errorMessage || '.bc-filter-noResults';
        that.options.contentType = options.contentType || 'list';

        that.$wrapper = safeLoad(that.options.wrapperSelector);
        that.$searchBox = safeLoad(that.options.searchBoxSelector);
        that.$clearButton = safeLoad(that.options.clearButtonSelector);
        that.$errorMessage = safeLoad(that.options.errorMessageSelector);
        that.contentType = that.options.contentType;

        that.$errorMessage.hide();

        that.$searchBox.on('keyup', function(eventObject) {
            switch (that.contentType) {
                case 'table':
                    filterTable(that.$wrapper, $(eventObject.currentTarget).val());
                    break;
                case 'list':
                    filterList(that.$wrapper, $(eventObject.currentTarget).val());
                    break;
            }            
        });
        
        that.$searchBox.closest('form').on('submit', function(e) {
            return false;
        });

        $clearButton.on('click', function() {
            clearFilter(that.$wrapper, that.$searchBox);
        });
    }      

    /* Private Methods ******************************************/

    function safeLoad(selector) {
        var $items = $(selector);
        if ($items.length === 0)
            throw 'No elements for "' + selector + '" were found.';
        return $items;
    }

    /*
     * Tokenized search that returns the matches found in the list or table.
     */
    function findMatches($wrapper, selector, criteria) {
        var criteriaTokens = criteria.trim().toLowerCase().split(' '); 

        var $matches = $wrapper.find(selector).filter(function(idx, element) {
            var selectorText = $(element).text().toLowerCase();            
            return criteriaTokens.every(function(tokenValue) {
                return selectorText.indexOf(tokenValue) > -1;
            });
        });

        return $matches;
    }

    /*
     * Filters an unordered list based on the user's input.
     */
    function filterList($wrapper, criteria) {
        var $matches = findMatches($wrapper, 'ul li', criteria);

        $wrapper.find('li').not($matches).hide();
        $matches.show();

        var $divsWithResults = $wrapper.children('div').find('li').not('[style="display: none;"]').closest('div');

        $wrapper.children('div').not($divsWithResults).hide();
        $divsWithResults.show();

        if ($divsWithResults.length === 0) 
            $errorMessage.show();
        else
            $errorMessage.hide();
    }

    /*
     * Since the current table stripes are based on :nth-child(), they'll get funky
     * when the filter removes rows. So, let's reset the row striping when there's a search. 
     * This is using inline styles since there's inline CSS that sets the color and 
     * has to be overwritten.
     */
    function resetTableStripes($matches, selector, color) {
        $matches.parent().children(selector).has('td').css('background-color', color);
    }

    /*
     * Filters an table of links and content based on the user's input.
     */
    function filterTable($wrapper, criteria) {
        var $matches = findMatches($wrapper, 'tr', criteria);

        $wrapper.find('tr').has('td').not($matches).hide();
        $matches.show();

        if ($matches.length === 0) {
            $errorMessage.show();
            $wrapper.find('tr').has('th').hide();
        } else {
            $errorMessage.hide();
            $wrapper.find('tr').has('th').show();
        }

        resetTableStripes($matches, 'tr:visible:even', '#ebebeb');
        resetTableStripes($matches, 'tr:visible:odd', '#fff');
    }

    /*
     * Clears the filter and displays all nodes in the list.
     */
    function clearFilter($wrapper, $searchbox) {
        $wrapper.find('li, div, tr').show();
        $searchbox.val('');
    }

    /* Reveal! */

    return {
        init: init
    };

})(jQuery);

// Collapse the other items
(function($) {

    $(function() {

		var clickedAccordionLevel = 0;

		/* Opens any items that match the current URL, so the user 
		 * sees the current page as being active. 
		 */
		$('.bc-accordion-menu ul li a').each(function(idx, item) {
			var itemHref = item.getAttribute('href');
			if (window.location.href.toLowerCase() === itemHref.toLowerCase()) {
				$(item).addClass('current');
				var $collapsables = $(item).parentsUntil('.bc-accordion-menu', 'ul');
				$collapsables.addClass('in');
				var $siblings = $collapsables.siblings('.accordion-collapsed');
				
				if (!$siblings.hasClass('active'))
					$siblings.addClass('active');
			}      
		}); 

		/* Updates the tracked current accordion level, since Bootstrap Collapse
		 * wasn't exactly designed for nested menus.
		 */
		$('.bc-accordion-menu .panel .accordion-collapsed').on('click', function(e) {
			var $currentTarget = $(e.currentTarget);

			clickedAccordionLevel = getAccordionLevel($currentTarget);
			$currentTarget.attr('aria-expanded', !$currentTarget.attr('aria-expanded'));
		});

		/* Making sure only the active accordion level's "active" css class is cleared when the menu expands. */
		$('.bc-accordion-menu .collapse').on('show.bs.collapse', function() {
			var $collapsable = $(this);
			var $siblings = $collapsable.siblings('.accordion-collapsed');
			var accordionLevel = getAccordionLevel($collapsable);

			if (accordionLevel === clickedAccordionLevel && !$siblings.hasClass('active')) 
				$siblings.addClass('active');

		});

		/* Making sure only the active accordion level's "active" css class is cleared when the menu collapses. */
		$('.bc-accordion-menu .collapse').on('hide.bs.collapse', function() {
			var $collapsable = $(this);
			var $siblings = $collapsable.siblings('.accordion-collapsed');
			var accordionLevel = getAccordionLevel($collapsable);

			if (accordionLevel === clickedAccordionLevel && $siblings.hasClass('active')) 
				$siblings.removeClass('active');
		});
		
		// Hide all text-only nodes.
		$('.bc-accordion-menu .panel ul li').contents().filter(textNodeFilter).parent().css('display','none');

		// Set up the DIVs to expand and collapse their siblings.
		$('.bc-accordion-menu .accordion-collapsed').on('click', function(e) { $(e.target).siblings('.collapse').collapse('toggle'); return false; });

		/* Returns whether this is a parent or child accordion link. */
		function getAccordionLevel($element) {
			return $element.parents('ul').length + 1;
		}

		function textNodeFilter(idx, element) {
			if (element.nodeType === 3 && element.nodeValue.trim() !== '') {
				return true;
			}
		}

    });

})(jQuery);
var baltimoreCounty = baltimoreCounty || {};

baltimoreCounty.youtubePlaylistGallery = (function($) {

    var documentationLink = 'https://goo.gl/HbhJ1p',
        defaultOptions = {
            target: '.bc-youtube-playlist-gallery',
            templateSelector: '#youtube-playlist-item-template',
            showDescription: false
        },

        /*
        * Initializes based on supplied options, and throws errors if they're missing. 
        */
        init = function(options) {
            
            if (!options) 
                options = defaultOptions;

            var $youtubePlaylistGalleryTarget = options.target ?  $(options.target.trim()) : $(defaultOptions.target);
            if ($youtubePlaylistGalleryTarget.length === 0) 
                throw 'The "target" option value must be supplied. Please see documentation at ' + documentationLink + '.';

            var templateSelector = options.templateSelector ? options.templateSelector : defaultOptions.templateSelector;

            var playlistId = options.playlistId;
            if (!playlistId || playlistId.length === 0) 
                throw 'The "playlistId" option must be supplied. Please see documentation at ' + documentationLink + '.';

            // A little redundant, but since null isn't quite false, let's check anyway.
            var showDescription = options.showDescription ? options.showDescription : defaultOptions.showDescription; 

            getPlaylistItems(playlistId, $youtubePlaylistGalleryTarget, templateSelector, showDescription, generateYouTubePlaylistHtmlWithHandlebars);
        },

        /*
        * Makes the requst to the YouTube v3 API.
        */
        getPlaylistItems = function(playlistId, $target, templateSelector, showDescription, callback) {
            var url = 'http://testservices.baltimorecountymd.gov/api/playlistgallery/' + playlistId,
                playlistItems = [];

            $.getJSON(url)
                .done(function(data) {
                    callback(data.items, $target, templateSelector, showDescription);
                }) 
                .fail(function(data) {
                    console.log('Data load from YouTube failed. Response: ' + JSON.stringify(data));
                });
        },

        /*
        * Generates the HTML for the video gallery itself using Handlebars.
        */
        generateYouTubePlaylistHtmlWithHandlebars = function(playlistItems, $target, templateSelector, showDescription) {
            var source = $(templateSelector).html();
            var template = Handlebars.compile(source);

            var youtubeItemInfoArr = [];
            
            for (var i = 0; i < playlistItems.length; i++) {
                var youtubeItemInfo = {
                    videoId: playlistItems[i].snippet.resourceId.videoId,
                    videoTitle: playlistItems[i].snippet.title,
                    thumbnailUrl: playlistItems[i].snippet.thumbnails.medium.url,
                    isHidden: i > 5
                };
                youtubeItemInfoArr.push(youtubeItemInfo);
            }

            var html = template({ youtubeItemInfo: youtubeItemInfoArr });
            if (playlistItems.length > 6)
                html += '<button type="button" class="contentButton loadMoreButton">LOAD MORE</button>';

            $target.html(html);

            $target.children('.loadMoreButton').first().on('click', function(e) {
                $target.find('.hidden').slice(0,6).removeClass('hidden');

                if ($target.find('.hidden').length === 0)
                    $(e.currentTarget).hide();
            });
        };   

    return {
        init: init
    };

})(jQuery);