(function(app) {
	'use strict';

	app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', 'NgMap', 'mapService', reporterController]);

	function reporterController($http, $scope, NgMap, mapService) {

		var self = this;		

		var targetCounty = 'Baltimore County';

		$http.get('categories.json').then(categorySuccessHandler, errorHandler);
		$http.get('animal-breeds.json').then(breedSuccessHandler, errorHandler);
		$http.get('animal-colors.json').then(colorSuccessHandler, errorHandler); 
		$http.get('animal-types.json').then(animalTypeSuccessHandler, errorHandler);
		$http.get('pet-types.json').then(petTypeSuccessHandler, errorHandler);

		NgMap.getMap().then(function(map) {	
			var center = map.getCenter();
 			google.maps.event.trigger(map, "resize");
 			map.setCenter(center);

			self.map = map;		
		});

		self.isAnimal = false;
		self.page = 1;

		self.mapClicked = function(event) {
			self.latitude = event.latLng.lat();
			self.longitude = event.latLng.lng();

			mapService.createMarker(self.map, self.latitude, self.longitude);
			mapService.reverseGeocode(self.latitude, self.longitude, function(address) {
				self.address = address;
			});
		};

		self.autocompletePlaceChanged = function() {
			var place = this.getPlace();

			self.latitude = place.geometry.location.lat();
			self.longitude = place.geometry.location.lng();

			mapService.createMarker(self.map, self.latitude, self.longitude);
			self.map.panTo({lat: self.latitude, lng: self.longitude});
			mapService.reverseGeocode(self.latitude, self.longitude, function(address) {
				self.address = address;
			});
		};		

		self.addressLookup = function() {
			mapService.addressLookup(self.address, function(address, latitude, longitude) {
				self.address = address;
				mapService.createMarker(self.map, latitude, longitude);
				self.map.panTo({ lat: latitude, lng: longitude });
			});
		};

		self.trackBreed = function() {
			angular.element.each(self.animalBreedData, function(index, breed) {
				if (breed.id === self.petType.id) {
					self.breeds = breed.breeds;
					return true;
				}
			});

			self.breeds = breedService.trackBreed(self.animalBreedData, self.petType.id)
		};

		self.loadSubCategories = function(categoryId) {
			if (!categoryId) {
				self.subCategories = [];
				return;
			}
				
			angular.element.each(self.categoryData, function(index, element) {
				if (element.id == categoryId) {
					self.subCategories = element.types;
					self.isAnimal = element.name.toLowerCase() === 'pets';
				}
			});
		};

		self.nextClick = function() {
			if (validatePanel())
				self.page++;
			else 
				$scope.citySourcedReporterForm.$setSubmitted();
		};

		self.prevClick = function() {
			if (validatePanel())
				self.page--;
		};

		/*** Private functions *********/

		function validatePanel() {			
			updateLngLat();

			var requiredElements = angular.element('#citysourced-reporter-form .panel:visible [required]'),
				requiredElementsCount = requiredElements.length,
				visibleRequiredElementsCount = requiredElements.filter('.ng-valid').length;

			angular.forEach($scope.citySourcedReporterForm.$$controls, function(value, key, obj) {
				if (value.$$element.closest('.panel').is(':visible') && value.$pristine) {
					value.$setDirty();
				}
			});

			return requiredElementsCount === visibleRequiredElementsCount;
		}

		function categorySuccessHandler(response) {
			self.categoryData = response.data;
		}

		function breedSuccessHandler(response) {
			self.animalBreedData = response.data;
		}

		function colorSuccessHandler(response) {
			self.animalColorData = response.data;
		}

		function animalTypeSuccessHandler(response) {
			self.animalTypeData = response.data;
		}

		function petTypeSuccessHandler(response) {
			self.petTypeData = response.data;
		}

		function errorHandler(err) {
			console.log(err);
		}

	}

})(angular.module('baltcogoApp'));