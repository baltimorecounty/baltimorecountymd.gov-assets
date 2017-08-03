(function (app) {

  app.factory('dataService', ['$http', '$q', '$log', dataService]);

  function dataService($http, $q, $log) {
    return {
      getSynonyms: getSynonyms
    };

    function getSynonyms() {
      return $http.get('/sebin/c/y/synonyms.json', {
        cache: true
      }).then(synonymsSuccessResponse)
        .catch(handleError);
    };

    function synonymsSuccessResponse(response) {
      return response.data;
    }

    function handleError(errorMsg) {
      $log.error("Error: ", errorMsg);
    }
  }

})(angular.module('baltcogoApp'));