(function(app) {
	'use strict';

	app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', reporterController]);

	function reporterController($http, $scope) {

		var self = this;		

		$http.get('categories.json').then(categorySuccessHandler, errorHandler);
		$http.get('animal-breeds.json').then(breedSuccessHandler, errorHandler);
		$http.get('animal-colors.json').then(colorSuccessHandler, errorHandler); 
		$http.get('animal-types.json').then(animalTypeSuccessHandler, errorHandler);
		$http.get('pet-types.json').then(petTypeSuccessHandler, errorHandler);

		self.isAnimal = false;
		self.page = 1;

		self.trackBreed = function() {
			angular.element.each(self.animalBreedData, function(index, breed) {
				if (breed.id === self.petType) {
					self.breeds = breed.breeds;
				}
			});
		},

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
		},

		self.nextClick = function() {
			self.page++;
		},

		self.prevClick = function() {
			self.page--;
		};

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