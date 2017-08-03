(function (app) {

  app.factory('animalService', ['$http', '$q', '$log', animalService]);

  function animalService($http, $q, $log) {
    return {
      getAnimalType: getAnimalType,
      getBreeds: getBreeds
    };

    function getAnimalType(str) {
      var deferred = $q.defer();
      var animalType = null;
      var animalObj = null;

      getBreeds().then(function (breeds) {
        for (var i = 0, length = breeds.length; i < length; i++) {
          animalObj = breeds[i];
          if (str && str.indexOf(animalObj.animal) > -1) {
            animalType = animalObj;
            break;
          }
        }
        deferred.resolve(animalType);
      });

      return deferred.promise;
    }

    function getBreeds() {
      return $http.get('/sebin/y/a/animal-breeds.json', {
        cache: true
      }).then(animalSuccessResponse)
        .catch(handleError);

    }

    function animalSuccessResponse(response) {
      return response.data;
    }

    function handleError(errorMsg) {
      $log.error('Error: ', errorMsg);
    }
  }

})(angular.module('baltcogoApp'));