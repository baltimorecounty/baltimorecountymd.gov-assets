(function BaltCoGoReporterCtrl(app, querystringer) {
	'use strict';

	app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', '$timeout', 'mapServiceComposite', 'reportService', 'CONSTANTS', reporterController]);

	function reporterController($http,
		$scope,
		$timeout,
		mapServiceComposite,
		reportService,
		CONSTANTS) {
		var self = this;
		var categoryId = querystringer.getAsDictionary().categoryid * 1;
		var map;

		self.isAnimal = false;
		self.page = 1;
		self.isDone = false;
		self.isSuccess = false;
		self.issueId = '';
		self.isLoading = false;
		self.latitude = 0;
		self.longitude = 0;
		self.category = 0;

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
		};

		map = mapServiceComposite.createMap('map', mapSettings);

		$http.get(CONSTANTS.urls.json.animalBreeds).then(breedSuccessHandler, errorHandler);
		$http.get(CONSTANTS.urls.json.animalColors).then(colorSuccessHandler, errorHandler);
		$http.get(CONSTANTS.urls.json.animalTypes).then(animalTypeSuccessHandler, errorHandler);
		$http.get(CONSTANTS.urls.json.categories).then(categorySuccessHandler, errorHandler);
		$http.get(CONSTANTS.urls.json.petTypes).then(petTypeSuccessHandler, errorHandler);

		google.maps.event.addListener(map, 'click', mapClickHandler);
		angular.element(document).on('keyup keypress', '#citysourced-reporter-form', preventSubmitOnEnterPressHandler);
		angular.element(document).on('keyup', '#address', autocompleteHandler);
		angular.element(window).on('keydown', autocompleteResultButtonKeyboardNavigationHandler);

		self.fileReportClick = function fileReportClick() {
			if (!validatePanel()) { return; }

			/** * Static fields ********* */

			var data = [{
				name: 'Category',
				id: self.category.id,
				value: self.category.name
			},
			{
				name: 'SubCategory',
				id: self.subCategory.id,
				value: self.subCategory.name
			},
			{
				name: 'Description',
				id: self.descriptionId,
				value: self.description
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

			/** * Conditional fields ********* */

			if (self.locationDescription) {
				data.push({
					name: 'Description Of Location',
					id: self.descriptionOfLocationId,
					value: self.locationDescription
				});
			}

			if (self.otherDescription) {
				data.push({
					name: 'Other Description',
					id: self.otherDescriptionId,
					value: self.otherDescription
				});
			}

			if (self.petType) {
				data.push({
					name: 'Pet Type',
					id: self.petType.id,
					value: getValueForId(self.petTypeData, self.petType.id)
				});
			}

			if (self.petSex) {
				data.push({
					name: 'Sex',
					id: self.petSex.id,
					value: getValueForId(self.sex, self.petSex.id)
				});
			}

			if (self.otherPetType) {
				data.push({
					name: 'Other Pet Type',
					id: self.otherPetType,
					value: getValueForId(self.animalTypeData, self.otherPetType)
				});
			}

			if (self.primaryBreed) {
				data.push({
					name: 'Primary Breed',
					id: self.primaryBreed,
					value: getValueForId(self.breeds, self.primaryBreed)
				});
			}

			if (self.primaryColor) {
				data.push({
					name: 'Primary Color',
					id: self.primaryColor,
					value: getValueForId(self.animalColorData, self.primaryColor)
				});
			}

			if (self.animalDescription) {
				data.push({
					name: 'Description Of Animal',
					id: angular.element('#animalDescription').attr('data-cs-id') * 1,
					value: self.animalDescription
				});
			}

			if (self.streetAddress) {
				data.push({
					name: 'Complainant Address',
					id: self.streetAddressId,
					value: self.streetAddress
				});
			}

			if (self.city) {
				data.push({
					name: 'Complainant City',
					id: self.cityId,
					value: self.city
				});
			}

			if (self.zipCode) {
				data.push({
					name: 'Complainant Zip Code',
					id: self.zipCodeId,
					value: self.zipCode
				});
			}

			/** * POST ********* */

			self.isLoading = true;
			self.isDone = true;

			reportService.post(data,
				function postSuccess(responseData) {
					self.isLoading = false;
					self.isSuccess = true;
					self.issueId = JSON.parse(responseData).CsResponse.ReportId;
				},
				function postError(errorData) {
					self.isLoading = false;
					console.log(errorData);
				});
		};

		self.loadSubCategories = function loadSubCategories() {
			if (!self.category) {
				self.subCategories = [];
				return;
			}

			angular.forEach(self.categoryData, function forEachCategoryData(element) {
				clearCategoryData();
				if (element.id === self.category.id) {
					self.subCategories = element.types;

					if (element.states) {
						self.states = element.states;
						self.state = element.states[0]; // Maryland
					} else {
						self.states = [];
					}

					if (element.fields) {
						self.streetAddressId = element.fields.streetAddress;
						self.cityId = element.fields.city;
						self.zipCodeId = element.fields.zipCode;
					}

					self.isAnimal = element.name.toLowerCase() === 'pets and animals';

					$timeout(function descriptionSettingWrapper() {
						if (element.descriptionOfAnimal) {
							self.descriptionOfAnimalId = element.descriptionOfAnimal;
						}

						if (element.descriptionOfLocation) {
							self.descriptionOfLocationId = element.descriptionOfLocation;
						}

						if (element.otherDescription) {
							self.otherDescriptionId = element.otherDescription;
						}
					}, 0);


					self.descriptionId = element.description;
				}
			});
		};

		self.nextClick = function nextClick() {
			if (validatePanel()) {
				self.page += 1;

				if (self.page === 2 && self.category.name === 'Website') {
					self.latitude = 39.4003288;
					self.longitude = -76.6087134;
					self.page = 3;
				}

				if (self.page === 2) {
					setTimeout(mapResize, 500);
				}
			} else { $scope.citySourcedReporterForm.$setSubmitted(); }
		};

		self.prevClick = function prevClick() {
			self.page -= 1;

			if (self.page === 2 && self.category.name === 'Website') {
				self.latitude = 39.4003288;
				self.longitude = -76.6087134;
				self.page = 1;
			}

			if (self.page === 2) {
				setTimeout(mapResize, 500);
			}
		};

		self.setLocation = function setLocation(sender, longitude, latitude) {
			self.address = sender.autocompleteResult.address;
			self.longitude = longitude;
			self.latitude = latitude;
			self.autocompleteResults = [];

			mapServiceComposite.pan(map, latitude, longitude);
			mapServiceComposite.createMarker(map, latitude, longitude);
		};

		self.trackBreed = function trackBreed() {
			angular.element.each(self.animalBreedData, function eachAnimalBreedData(index, breed) {
				if (breed.id === self.petType.id) {
					self.breeds = breed.breeds ? breed.breeds : [];
					self.sex = breed.sex;
					return true;
				}

				return false;
			});
		};

		/** *** Private - Helpers **** */

		function autoSelectCategories(selectedCategoryId) {
			angular.forEach(self.categoryData, function forEachCategoryData(categoryItem) {
				if (categoryItem.id === selectedCategoryId) {
					self.category = categoryItem;
					self.loadSubCategories();
				} else if (categoryItem.types) {
					angular.forEach(categoryItem.types, function forEachCategoryItemType(typeItem) {
						if (typeItem.id === selectedCategoryId) {
							self.category = categoryItem;
							self.loadSubCategories();
							self.subCategory = typeItem;
						}
					});
				}
			});
		}

		function clearCategoryData() {
			self.subCategory = '';
			self.petType = '';
			self.otherPetType = '';
			self.petSex = '';
			self.primaryColor = '';
			self.primaryBreed = '';
			self.animalDescription = '';
			self.streetAddress = '';
			self.city = '';
			self.zipCode = '';
			self.descriptionOfAnimalId = 0;
			self.descriptionOfLocationId = 0;
			self.otherDescriptionId = 0;
		}

		function getValueForId(nameIdData, id) {
			var name = '';

			angular.forEach(nameIdData, function forEachNameId(element) {
				if (element.id === id) {
					name = element.name;
					return true;
				}

				return false;
			});

			return name;
		}

		function mapResize() {
			var currentCenter = map.getCenter();
			google.maps.event.trigger(map, 'resize');
			map.setCenter(currentCenter);
		}

		function validatePanel() {
			var requiredElements = angular.element('#citysourced-reporter-form .panel:visible [required]');
			var requiredElementsCount = requiredElements.length;
			var validRequiredElementsCount = requiredElements.filter('.ng-valid').length;
			var controls = $scope.citySourcedReporterForm.$$controls;

			angular.forEach(controls, function forEachControl(formControl) {
				if (formControl.$$element.closest('.panel').is(':visible')) {
					if (formControl.$pristine) { formControl.$setDirty(); }
					if (formControl.$untouched) { formControl.$setTouched(); }

					if (formControl.$$element.is('#address')) {
						if (self.latitude === 0 || self.longitude === 0) {
							formControl.$setValidity('required', false);
						}
					}
				}
			});

			return requiredElementsCount === validRequiredElementsCount;
		}

		/** *** Private - Handlers **** */

		function autocompleteHandler(event) {
			var keycode = event.which || event.keyCode;

			if (keycode === 40) {
				event.preventDefault(); // Don't scroll down!
				angular.element('.autocomplete-results button').first().focus();
				return;
			}

			if (keycode === 13) {
				if (self.autocompleteResults.length > 0) {
					var $topAutocompleteResult = angular.element('.autocomplete-results button').first();
					$topAutocompleteResult.trigger('click');
					$scope.$apply();
				}
				return;
			}

			if (self.address && self.address.trim().length > 3) {
				mapServiceComposite
					.suggestAddresses(self.address, function displayAutoCompleteResults(autoCompleteResults) {
						self.autocompleteResults = autoCompleteResults;
					});
			} else {
				self.autocompleteResults = [];
			}
		}

		function autocompleteResultButtonKeyboardNavigationHandler(event) {
			var keycode = event.which || event.keyCode;
			var $target = angular.element(event.target);

			if (!$target.is('.autocomplete-results button')) {
				return;
			}

			if (keycode === 27 && angular.element('.autocomplete-results').is(':visible')) {
				self.autocompleteResults = [];
				$scope.$apply();
			}

			event.preventDefault();

			if (keycode === 13 || keycode === 32) {
				$target.trigger('click');
			}

			if (keycode === 40) {
				$target.parent().next().find('button').focus();
			}

			if (keycode === 38) {
				$target.parent().prev().find('button').focus();
			}
		}

		function animalTypeSuccessHandler(response) {
			self.animalTypeData = response.data;
		}

		function breedSuccessHandler(response) {
			self.animalBreedData = response.data;
		}

		function categorySuccessHandler(response) {
			self.categoryData = response.data;
			if (categoryId) {
				autoSelectCategories(categoryId);
			}
		}

		function colorSuccessHandler(response) {
			self.animalColorData = response.data;
		}

		function errorHandler(err) {
			console.log(err);
		}

		function mapClickHandler(event) {
			var $wrapper = angular.element('#map').closest('cs-form-control');
			var addressField = $scope.citySourcedReporterForm.address;

			self.autocompleteResults = [];
			self.latitude = event.latLng.lat();
			self.longitude = event.latLng.lng();

			mapServiceComposite
				.reverseGeocode(self.latitude, self.longitude, function reverseGeoCodeLatLng(response) {
					$wrapper.removeClass('error');
					mapServiceComposite.createMarker(map, self.latitude, self.longitude);
					self.address = response.address.Street.toLowerCase() + ', ' + response.address.City.toLowerCase() + ', ' + response.address.State.toUpperCase();
					$scope.$apply();
				}, function error() {
					$wrapper.addClass('error');
					addressField.$setDirty();
					self.address = '';
					$scope.$apply();
				});
		}

		function petTypeSuccessHandler(response) {
			self.petTypeData = response.data;
		}

		function preventSubmitOnEnterPressHandler(event) {
			var keyCode = event.which || event.keyCode;

			if (keyCode === 13) {
				event.preventDefault();
			}
		}
	}
}(angular.module('baltcogoApp'), baltimoreCounty.utility.querystringer));
