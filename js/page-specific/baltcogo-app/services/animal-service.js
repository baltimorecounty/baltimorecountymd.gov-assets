(function initAnimalService(app) {
	app.factory('animalService', ['$http', '$q', '$log', animalService]);

	function animalService($http, $q, $log) {
		return {
			getAnimalType: getAnimalType,
			getBreeds: getBreeds
		};

		function getAnimalType(val) {
			var deferred = $q.defer();
			var animalType = null;
			var animalObj = null;
			var isValNumber = typeof val === 'number';

			getBreeds().then(function breedsResponse(breeds) {
				for (var i = 0, length = breeds.length; i < length; i += 1) {
					animalObj = breeds[i];
					var hasAnimalInString = val.indexOf(animalObj.animal) > -1;
					var hasIdMatch = val && isValNumber && animalObj.id === parseInt(val, 10);
					if (hasAnimalInString || hasIdMatch) {
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
}(angular.module('baltcogoApp')));
