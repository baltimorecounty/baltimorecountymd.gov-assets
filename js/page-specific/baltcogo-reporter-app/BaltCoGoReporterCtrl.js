(function (app) {
	'use strict';

	app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', '$timeout', 'mapService', 'createReportService', reporterController]);

	function reporterController($http, $scope, $timeout, mapService, createReportService) {

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

		self.isAnimal = false;
		self.page = 1;		
		self.isDone = false;
		self.isSuccess = false;
		self.issueId = '';
		self.isLoading = false;

		var mapSettings = {
				center: {
					lat: 39.4003288,
					lng: -76.60652470000002
				},
				scrollwheel: false,
				zoom: 14,
				mapTypeId: 'roadmap',
				mapTypeControl: false,
				streetViewControl: false
			},
			autocompleteSettings = {
				types: ['geocode']
			};

		self.map = mapService.createMap('map', mapSettings);

		var autocomplete = mapService.createAutoComplete('address', autocompleteSettings);

		google.maps.event.addListener(self.map, 'click', mapClicked);
		autocomplete.addListener('place_changed', autocompletePlaceChanged);
		document.getElementById('addressSearch').addEventListener('click', addressLookup);
		document.getElementById('address').addEventListener('keypress', addressKeypressHandler);

		function addressKeypressHandler(event) {
			if (event.which === 13 || event.keyCode === 13) {

				var place = autocomplete.getPlace();

				if (!place || !place.geometry) {
					var pacItem = angular.element('.pac-item').first(),
						firstSuggestion = pacItem.find('.pac-item-query').text() + ' ' + pacItem.find('> span').last().text()

					$scope.$apply(function() {
						self.address = mapService.removeCountry(firstSuggestion);					
					});
				}
			}
		}

		function autocompletePlaceChanged() {			
			self.address = mapService.removeCountry(self.address);
			
			var place = autocomplete.getPlace();

			if (place.geometry) {
				var latitude = place.geometry.location.lat(),
					longitude = place.geometry.location.lng();

				mapService.reverseGeocode(latitude, longitude, function(foundAddress) {
					self.address = checkAddress(foundAddress, latitude, longitude);
				});
			}
		}

		function checkAddress(foundAddress, latitude, longitude) {
			if (foundAddress) {
				mapService.createMarker(self.map, latitude, longitude);
				self.map.panTo({
					lat: latitude,
					lng: longitude
				});
				return foundAddress;
			} else {
				return '';
			}
		}

		function mapClicked(event) {
			self.latitude = event.latLng.lat();
			self.longitude = event.latLng.lng();

			mapService.reverseGeocode(self.latitude, self.longitude, function (address) {
				if (address) {
					self.address = address;
					mapService.createMarker(self.map, self.latitude, self.longitude);
				}
			});
		}

		function addressLookup() {
			mapService.addressLookup(self.address, function (address, latitude, longitude) {
				mapService.reverseGeocode(latitude, longitude, function(foundAddress) {
					self.address = checkAddress(foundAddress, latitude, longitude);
				});
			});
		};

		self.trackBreed = function () {
			angular.element.each(self.animalBreedData, function (index, breed) {
				if (breed.id === self.petType.id) {
					self.breeds = breed.breeds ? breed.breeds : [];
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
					if (element.states) {
						self.states = element.states;
						self.state = element.states[23]; // Maryland
					}
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
			if (validatePanel()) {
				self.page++; 

				if (self.page === 2) {
					setTimeout(function() {
						google.maps.event.trigger(self.map, "resize");
					}, 500);
				}
			}
			else
				$scope.citySourcedReporterForm.$setSubmitted();				
		};

		self.prevClick = function () {
			self.page--; 
			if (self.page === 2) {
				setTimeout(function() {
					google.maps.event.trigger(self.map, "resize");
				}, 500);
			}
		};

		self.fileReportClick = function () {

			if (!validatePanel()) 
				return;

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
					name: 'Description Of Location',
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
				name: 'Pet Type',
				id: self.petType.id,
				value: getValueForId(self.petTypeData, self.petType.id)
			});

			if (self.petSex) data.push({
				name: 'Sex',
				id: self.petSex.id,
				value: getValueForId(self.sex, self.petSex.id)
			});

			if (self.otherPetType) data.push({
				name: 'Other Pet Type',
				id: self.otherPetType,
				value: getValueForId(self.animalTypeData, self.otherPetType)
			});

			if (self.primaryBreed) data.push({
				name: 'Primary Breed',
				id: self.primaryBreed,
				value: getValueForId(self.breeds, self.primaryBreed)
			});

			if (self.primaryColor) data.push({
				name: 'Primary Color',
				id: self.primaryColor,
				value: getValueForId(self.animalColorData, self.primaryColor)
			});

			if (self.animalDescription) data.push({
				name: 'Description Of Animal',
				id: angular.element('#animalDescription').attr('data-cs-id') * 1,
				value: self.animalDescription
			});

			if (self.streetAddress) data.push({
				name: 'Complainant Address',
				id: self.streetAddressId,
				value: self.streetAddress
			});

			if (self.city) data.push({
				name: 'Complainant City',
				id: self.cityId,
				value: self.city
			});

			if (self.state) {
				var stateId = self.state.id ? self.state.id : self.state

				data.push({
					name: 'Complainant State',
					id: stateId,
					value: getValueForId(self.states, stateId)
				});
			}

			if (self.zipCode) data.push({
				name: 'Complainant Zip Code',
				id: self.zipCodeId,
				value: self.zipCode
			});

			/*** POST **********/

			self.isLoading = true;
			self.isDone = true;

			createReportService.post(data, 
				function(responseData) {
					self.isLoading = false;
					self.isSuccess = true;
					self.issueId = JSON.parse(responseData).CsResponse.ReportId;
				}, 
				function(errorData) {
					self.isLoading = false;
					console.log(errorData);
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
				visibleRequiredElementsCount = requiredElements.filter('.ng-valid').length,
				controls = $scope.citySourcedReporterForm.$$controls;
			
			angular.forEach(controls, function (value, key, obj) {
				if (value.$$element.is(':visible')) {
					if (value.$pristine)
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