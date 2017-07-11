(function () {
  'use strict';

  angular.module('baltcogoApp', [])
    .config(["dataProvider", function (dataProvider) {
      var urls = [
        { "animal.breeds": '/mockups/citysourced/animal-breeds.json' },
        { "animal.colors": '/mockups/citysourced/animal-colors.json' },
        { "animal.types": '/mockups/citysourced/animal-types.json' },
        { "categories": '/mockups/citysourced/categories.json' },
        { "pet.types": '/mockups/citysourced/pet-types.json' }
      ];
      dataProvider.setUrls(urls);
    }]);
})();