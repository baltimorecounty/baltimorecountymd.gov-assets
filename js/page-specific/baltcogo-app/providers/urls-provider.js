// http://www.learn-angular.org/#!/lessons/the-provider-recipe
(function (app) {
  'use strict';

  app
    .provider('app.urls', UrlsProvider);

  function UrlsProvider() {
    var urlArr = null;

    var Url = function (arr) {
      this.endpoints = {};

      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        var key = Object.keys(obj)[0];

        this.endpoints[key] = obj[key];
      }
    }

    this.setUrls = function (keyValArr) {
      urlArr = keyValArr;
    };

    this.$get = [function () {
      return new Url(urlArr);
    }];
  };

})(angular.module('baltcogoApp'));