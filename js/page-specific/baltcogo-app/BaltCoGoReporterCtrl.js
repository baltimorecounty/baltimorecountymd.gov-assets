/* eslint no-use-before-define: ["error", { "functions": false }] */
(function BaltCoGoReporterCtrl(app) {
	'use strict';

	app
		.controller('BaltCoGoReporterCtrl', [
			'$http',
			'$scope',
			'$location',
			'$timeout',
			'$routeParams',
			'mapServiceComposite',
			'reportService',
			'animalService',
			'smartSearch',
			'dataService',
			reporterController
		]);

	function reporterController(
		$http,
		$scope,
		$location,
		$timeout,
		$routeParams,
		mapServiceComposite,
		reportService,
		animalService,
		SmartSearch,
		dataService
	) {
		var self = this;
		var initialCategoryId = $routeParams && $routeParams.categoryId
			? $routeParams.categoryid * 1 : null;
		var map;
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

		animalService.getBreeds()
			.then(breedSuccessHandler)
			.catch(errorHandler);

		$http.get('/sebin/u/t/animal-colors.json').then(colorSuccessHandler, errorHandler);
		$http.get('/sebin/a/d/animal-types.json').then(animalTypeSuccessHandler, errorHandler);
		$http.get('/sebin/q/n/categories.json').then(categorySuccessHandler, errorHandler);
		$http.get('/sebin/m/z/pet-types.json').then(petTypeSuccessHandler, errorHandler);

		self.helpFormattedData = [];
		self.showCategoryAutocomplete = $location.hash() !== 'original-form';
		self.isAnimal = false;
		self.page = 1;
		self.isDone = false;
		self.isSuccess = false;
		self.issueId = '';
		self.isLoading = false;
		self.latitude = 0;
		self.longitude = 0;
		self.category = 0;

		map = mapServiceComposite.createMap('map', mapSettings);
		google.maps.event.addListener(map, 'click', mapClickHandler);

		angular.element('#citysourced-reporter-form').on('keyup keypress', preventSubmitOnEnterPressHandler);
		angular.element('#address').on('keyup', autocompleteHandler);
		angular.element(window).on('keydown', autocompleteResultButtonKeyboardNavigationHandler);

		self.toggleForm = function toggleForm(e) {
			e.preventDefault();
			self.showCategoryAutocomplete = !self.showCategoryAutocomplete;
		};

		self.fileReportClick = function fileReportClick() {
			if (!validatePanel()) {
				return;
			}

			/** * Static fields ********* */
			var data = [
				{
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

			if (self.state) {
				var stateId = self.state.id ? self.state.id : self.state;

				data.push({
					name: 'Complainant State',
					id: stateId,
					value: getValueForId(self.states, stateId)
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
				function onSuccess(responseData) {
					self.isLoading = false;
					self.isSuccess = true;
					self.issueId = JSON.parse(responseData).CsResponse.ReportId;
				},
				function onError(errorData) {
					self.isLoading = false;
					console.log(errorData); // eslint-disable-line no-console
				});
		};

		self.loadSubCategories = function loadSubCategories() {
			if (!self.category) {
				self.subCategories = [];
				return;
			}

			angular.forEach(self.categoryData, function loopFn(element) {
				clearCategoryData();
				if (element.id === self.category.id) {
					self.subCategories = element.types;

					if (element.id === self.category) {
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

						$timeout(function toFn() {
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
				}
			});
		};

		self.nextClick = function nextClick() {
			if (validatePanel()) {
				self.page += 1;

				if (self.page === 2) {
					setTimeout(function toFn() {
						var currentCenter = map.getCenter();
						google.maps.event.trigger(map, 'resize');
						map.setCenter(currentCenter);
					}, 500);
				}
			} else {
				$scope.citySourcedReporterForm.$setSubmitted();
			}
		};

		self.prevClick = function prevClick() {
			self.page -= 1;
			if (self.page === 2) {
				setTimeout(function toFn() {
					var currentCenter = map.getCenter();
					google.maps.event.trigger(map, 'resize');
					map.setCenter(currentCenter);
				}, 500);
			}
		};

		self.trackBreed = function trackBreed() {
			for (var i = 0, length = self.animalBreedData.length; i < length; i += 1) {
				var breed = self.animalBreedData[i];
				if (breed.id === self.petType.id) {
					self.breeds = breed.breeds ? breed.breeds : [];
					self.sex = breed.sex;
					break;
				}
			}
		};

		self.lookupAddress = function lookupAddress(address) {
			self.autocompleteResults = [];
			self.address = address;
			geocodeAndMarkAddress(address);
		};

		/** *** Private - Helpers **** */

		function setCategoriesAndPetTypeManually(animalType) {
			$timeout(function toFn() {
				$('#categories').val(self.category);
				$('#subCategories').val(self.subCategory);

				if (animalType) {
					$scope.$apply(function scopeApply() {
						$('#pet-type').find('option[selected]')
							.removeAttr('selected').end();
						$('#pet-type option[label*=\'' + animalType.animal + '\' i]')
							.prop('selected', true);

						setPetType(animalType);
						self.trackBreed();
					});
				}
			}, 250);
		}

		function setPetType(animalType) {
			self.petType = {
				id: animalType.id,
				name: animalType.animal
			};
		}

		function autoSelectCategories(categoryId, animalType) {
			angular.forEach(self.categoryData, function foreachCatFn(categoryItem) {
				if (categoryItem.id === categoryId) {
					self.category = categoryItem;
					self.loadSubCategories(categoryItem.id);
				} else if (categoryItem.types) {
					angular.forEach(categoryItem.types, function foreachSubCatFn(typeItem) {
						if (typeItem.id === categoryId) {
							self.category = categoryItem;
							self.loadSubCategories(categoryItem.id);
							self.subCategory = typeItem;

							// self.category = categoryItem.id;
							// self.loadSubCategories();

							// //Hack we need to set it again because it's cleared by loadSubCategories
							// self.category = categoryItem.id;
							// self.subCategory = typeItem.id;

							setCategoriesAndPetTypeManually(animalType);
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

		function geocodeAndMarkAddress(singleLineAddress) {
			mapServiceComposite.addressLookup(singleLineAddress, function addressLookup(foundAddress) {
				self.latitude = foundAddress.location.y;
				self.longitude = foundAddress.location.x;
				mapServiceComposite.pan(map, self.latitude, self.longitude);
				mapServiceComposite.createMarker(map, self.latitude, self.longitude);
			}, function onErr(err) {
				displayAddressError(err);
			});
		}

		function getValueForId(nameIdData, id) {
			var name = '';
			for (var i = 0, length = nameIdData.length; i < length; i += 1) {
				var element = nameIdData[i];
				if (element.id === id) {
					name = element.name;
					break;
				}
			}
			return name;
		}

		function validatePanel() {
			var requiredElements = angular.element('#citysourced-reporter-form .panel:visible [required]');
			var requiredElementsCount = requiredElements.length;
			var validRequiredElementsCount = requiredElements.filter('.ng-valid').length;
			var controls = $scope.citySourcedReporterForm.$$controls;

			angular.forEach(controls, function loopFn(formControl) {
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
					var topAutocompleteResult = self.autocompleteResults[0];
					self.address = topAutocompleteResult;
					self.autocompleteResults = [];
					$scope.$apply();
					geocodeAndMarkAddress(topAutocompleteResult);
				}
			} else if (self.address && self.address.trim().length > 3) {
				mapServiceComposite.suggestAddresses(self.address,
					function suggestResponse(autoCompleteResults) {
						self.autocompleteResults = autoCompleteResults;
						$scope.$apply();
					});
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
			if (initialCategoryId) {
				autoSelectCategories(initialCategoryId);
			}
			setupCategoryAutocomplete(response.data);
		}

		function setupCategoryAutocomplete(categories) {
			dataService.getSynonyms().then(function synonymsResponse(synonyms) {
				self.synonyms = synonyms;
				categories.forEach(formatCategoriesForCategoryAutocomplete);
				setupSmartSearcher();
			});
		}

		function formatCategoriesForCategoryAutocomplete(category) {
			var formattedData = [];
			category.types.forEach(function loopFn(type) {
				var formattedType = getformattedCategoryType(self.synonyms, category, type);
				formattedData.push(formattedType);
			});

			self.helpFormattedData = self.helpFormattedData.concat(formattedData);
		}

		function setAutoCompleteValue(val, shouldBlur) {
			var $smartSearch = $('#smart-search');
			$smartSearch.typeahead('val', val);

			if (shouldBlur) {
				$smartSearch.blur();
			}
		}

		function onCursorChange() {
			setAutoCompleteValue(self.helpQuery);
		}

		function onSelected(event, selection) {
			if (selection.item && selection.item.category.name.toLowerCase().indexOf('animals') > -1) {
				animalService.getAnimalType(self.helpQuery).then(function animalTypesResponse(animalType) {
					autoSelectCategories(selection.item.subcategory.id, animalType);
				});
			} else {
				self.petType = '';
				autoSelectCategories(selection.item.subcategory.id);
			}
			$timeout(function toFn() {
				setAutoCompleteValue(selection.item.subcategory.name, true);
			}, 0);

			// clearQuery();
		}

		function setupSmartSearcher() {
			var keys = [
				{
					name: 'subcategory.name',
					weight: 0.3
				}, {
					name: 'subcategory.tags',
					weight: 0.7
				}
			];

			if (!self.smartSearcher) {
				var options = {
					shouldSort: true,
					includeScore: true,
					threshold: 0.6,
					distance: 100,
					keys: keys
				};

				self.smartSearcher = new SmartSearch(self.helpFormattedData, options);

				self.typeAhead = $('#smart-search').typeahead({
					highlight: true
				});

				$('#smart-search')
					.typeahead({
						highlight: true
					},
					{
						source: function source(query, syncResults) {
							syncResults(self.smartSearcher.search(query));
						},
						templates: {
							suggestion: function suggestion(data) {
								var item = data.item;
								return '<div><p class="text-muted" data-category="' + item.category.id + '" data-id="' + item.subcategory.id + '">' + item.subcategory.name + '</p></div>';
							},
							empty: function empty() {
								return '<p class="text-muted">No results found.</p>';
							}
						}
					})
					.on('typeahead:cursorchange', onCursorChange)
					.on('typeahead:selected', onSelected);
			}
		}

		function getformattedCategoryType(synonyms, category, type) {
			var tags = getTags(synonyms, type.name);
			tags = type.tags ? type.tags.concat(tags) : tags;

			return {
				category: {
					id: category.id,
					name: category.name
				},
				subcategory: {
					id: type.id,
					name: type.name,
					tags: tags
				}
			};
		}

		function getTags(synonyms, description) {
			var keys = [];
			Object.keys(synonyms).forEach(function loopFn(synonym) {
				if (description.toLowerCase().indexOf(synonym) > -1) {
					var similarWords = synonyms[synonym];
					keys = keys.concat(similarWords);
				}
			});
			return keys;
		}

		function colorSuccessHandler(response) {
			self.animalColorData = response.data;
		}

		function displayAddressError() {
			angular.element('#map').closest('cs-form-control').addClass('error');
			$scope.citySourcedReporterForm.address.$setDirty();
			self.address = '';
			$scope.$apply();
		}

		function errorHandler(err) {
			console.log(err); // eslint-disable-line no-console
		}

		function mapClickHandler(event) {
			var $wrapper = angular.element('#map').closest('cs-form-control');
			var addressField = $scope.citySourcedReporterForm.address;

			self.autocompleteResults = [];
			self.latitude = event.latLng.lat();
			self.longitude = event.latLng.lng();

			mapServiceComposite.reverseGeocode(self.latitude, self.longitude,
				function reverseGeocodeResponse(response) {
					$wrapper.removeClass('error');
					mapServiceComposite.createMarker(map, self.latitude, self.longitude);
					self.address = response.address.Street.toLowerCase() + ', ' + response.address.City.toLowerCase() + ', ' + response.address.State.toUpperCase();
					$scope.$apply();
				}, function onError() {
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
}(angular.module('baltcogoApp')));
