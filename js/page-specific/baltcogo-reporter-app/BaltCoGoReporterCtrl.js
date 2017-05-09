(function (app) {
	'use strict';

	app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', 'NgMap', 'mapService', 'createReportService', reporterController]);

	function reporterController($http, $scope, NgMap, mapService, createReportService) {

		var self = this;

		var targetCounty = 'Baltimore County';

		/*$http.get('/sebin/q/l/categories.json').then(categorySuccessHandler, errorHandler);
		$http.get('/sebin/y/z/animal-breeds.json').then(breedSuccessHandler, errorHandler);
		$http.get('/sebin/u/t/animal-colors.json').then(colorSuccessHandler, errorHandler); 
		$http.get('/sebin/a/d/animal-types.json').then(animalTypeSuccessHandler, errorHandler);
		$http.get('/sebin/m/z/pet-types.json').then(petTypeSuccessHandler, errorHandler);*/
		$http.get('categories.json').then(categorySuccessHandler, errorHandler);
		$http.get('animal-breeds.json').then(breedSuccessHandler, errorHandler);
		$http.get('animal-colors.json').then(colorSuccessHandler, errorHandler);
		$http.get('animal-types.json').then(animalTypeSuccessHandler, errorHandler);
		$http.get('pet-types.json').then(petTypeSuccessHandler, errorHandler);

		NgMap.getMap().then(function (map) {
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);

			self.map = map;
		});

		self.isAnimal = false;
		self.page = 1;

		self.mapClicked = function (event) {
			self.latitude = event.latLng.lat();
			self.longitude = event.latLng.lng();

			mapService.createMarker(self.map, self.latitude, self.longitude);
			mapService.reverseGeocode(self.latitude, self.longitude, function (address) {
				self.address = address;
			});
		};

		self.autocompletePlaceChanged = function () {
			var place = this.getPlace();

			self.latitude = place.geometry.location.lat();
			self.longitude = place.geometry.location.lng();

			mapService.createMarker(self.map, self.latitude, self.longitude);
			self.map.panTo({
				lat: self.latitude,
				lng: self.longitude
			});
			mapService.reverseGeocode(self.latitude, self.longitude, function (address) {
				self.address = address;
			});
		};

		self.addressLookup = function () {
			mapService.addressLookup(self.address, function (address, latitude, longitude) {
				self.address = address;
				mapService.createMarker(self.map, latitude, longitude);
				self.map.panTo({
					lat: latitude,
					lng: longitude
				});
			});
		};

		self.trackBreed = function () {
			angular.element.each(self.animalBreedData, function (index, breed) {
				if (breed.id === self.petType.id) {
					self.breeds = breed.breeds;
					self.sex = breed.sex;
					return true;
				}
			});
		};

		self.loadSubCategories = function (categoryId) {
			if (!categoryId) {
				self.subCategories = [];
				return;
			}

			angular.forEach(self.categoryData, function (element) {
				if (element.id == categoryId) {
					self.subCategories = element.types;
					self.states = element.states;
					if (element.fields) {
						self.streetAddressId = element.fields.streetAddress;
						self.cityId = element.fields.city;
						self.zipCodeId = element.fields.zipCode;
					}
					self.isAnimal = element.name.toLowerCase() === 'pets and animals';
				}
			});
		};

		self.nextClick = function () {
			if (validatePanel())
				self.page++;
			else
				$scope.citySourcedReporterForm.$setSubmitted();
		};

		self.prevClick = function () {
			if (validatePanel())
				self.page--;
		};

		self.fileReportClick = function () {

			/*** Static fields **********/
			
			var data = [{
					name: 'Category',
					id: self.category,
					value: getValueForId(self.categoryData, self.category)
				},
				{
					name: 'SubCategory',
					id: self.subCategory,
					value: getValueForId(self.subCategories, self.subCategory)
				},
				{
					name: 'Description',
					id: angular.element('#description').attr('data-cs-id') * 1,
					value: self.description
				},
				{
					name: 'DescriptionOfLocation',
					id: angular.element('#locationDescription').attr('data-cs-id') * 1,
					value: self.locationDescription
				},
				{
					name: 'Latitude',
					value: self.latitude
				},
				{
					name: 'Longitude',
					value: self.longitude
				},
				{
					name: 'FirstName',
					value: self.firstName
				},
				{
					name: 'LastName',
					value: self.lastName
				},
				{
					name: 'Email',
					value: self.email
				},
				{
					name: 'DeviceNumber',
					value: self.deviceNumber
				}
			];

			/*** Conditional fields **********/

			if (self.petType) data.push({
				name: 'PetType',
				id: self.petType.id,
				value: getValueForId(self.petTypeData, self.petType.id)
			});

			if (self.petSex) data.push({
				name: 'Sex',
				id: self.petSex.id,
				value: getValueForId(self.sex, self.petSex)
			});

			if (self.otherPetType) data.push({
				name: 'OtherPetType',
				id: self.otherPetType,
				value: getValueForId(self.animalTypeData, self.otherPetType)
			});

			if (self.primaryBreed) data.push({
				name: 'PrimaryBreed',
				id: self.primaryBreed,
				value: getValueForId(self.breeds, self.primaryBreed)
			});

			if (self.primaryColor) data.push({
				name: 'PrimaryColor',
				id: self.primaryColor,
				value: getValueForId(self.animalColorData, self.primaryColor)
			});

			if (self.animalDescription) data.push({
				name: 'DescriptionOfAnimal',
				id: angular.element('#animalDescription').attr('data-cs-id') * 1,
				value: self.animalDescription
			});

			if (self.streetAddress) data.push({
				name: 'ComplainantAddress',
				id: self.streetAddressId,
				value: self.streetAddress
			});

			if (self.city) data.push({
				name: 'ComplainantCity',
				id: self.cityId,
				value: self.city
			});

			if (self.state) data.push({
				name: 'ComplainantState',
				id: self.state,
				value: getValueForId(self.states, self.state)
			});

			if (self.zipCode) data.push({
				name: 'ComplainantZipCode',
				id: self.zipCodeId,
				value: self.zipCode
			});

			/*** POST **********/

			createReportService.post(data, function(isSuccess) {
				console.log(isSuccess);
			});
		};

		/*** Private functions *********/

		function getValueForId(nameIdData, id) {
			var name = '';

			angular.forEach(nameIdData, function (element) {
				if (element.id === id) {
					name = element.name;
					return true;
				}
			});

			return name;
		}

		function validatePanel() {
			var requiredElements = angular.element('#citysourced-reporter-form .panel:visible [required]'),
				requiredElementsCount = requiredElements.length,
				visibleRequiredElementsCount = requiredElements.filter('.ng-valid').length;

			angular.forEach($scope.citySourcedReporterForm.$$controls, function (value, key, obj) {
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