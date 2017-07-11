// http://www.learn-angular.org/#!/lessons/the-provider-recipe
(function (app) {
  'use strict';

  function Url(arr) {
    this.endpoints = {};

    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      var key = Object.keys(obj)[0];

      this.endpoints[key] = obj[key];
    }
  }

  app.provider('urls', function () {
    var urlArr = null;

    this.setUrls = function (keyValArr) {
      urlArr = keyValArr;
    };

    this.$get = [function () {
      return new Url(urlArr);
    }];
  });

})(angular.module('baltcogoApp'));