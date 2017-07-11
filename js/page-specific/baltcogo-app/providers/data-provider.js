// http://www.learn-angular.org/#!/lessons/the-provider-recipe
(function (app, querystringer) {
  'use strict';

  function Data(arr) {
    this.endpoints = {};

    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      console.log(obj);
      var key = Object.keys(obj)[0];

      this.endpoints[key] = obj[key];
    }
  }

  app.provider('data', function () {
    var urlArr = null;

    this.setUrls = function (keyValArr) {
      urlArr = keyValArr;
    };

    this.$get = [function () {
      return new Data(urlArr);
    }];
  });

})(angular.module('baltcogoApp'), baltimoreCounty.utility.querystringer);