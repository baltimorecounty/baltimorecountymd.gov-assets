(function () {
  'use strict';

  angular.module('baltcogoApp', [])
    .config(['urlsProvider', function (urlProvider) {
      var urls = [
        { "animal.breeds": '/mockups/citysourced/animal-breeds.json' },
        { "animal.colors": '/mockups/citysourced/animal-colors.json' },
        { "animal.types": '/mockups/citysourced/animal-types.json' },
        { "categories": '/mockups/citysourced/categories.json' },
        { "pet.types": '/mockups/citysourced/pet-types.json' },
        { "report.create": "//testservices.baltimorecountymd.gov/api/baltcogo/createreport" },
        { "report.get": "//testservices.baltimorecountymd.gov/api/citysourced/getreport/" },
        { "reports.getByLatLng": "//testservices.baltimorecountymd.gov/api/citysourced/getreportsbylatlng"}
      ];
      urlProvider.setUrls(urls);
    }]);
})();