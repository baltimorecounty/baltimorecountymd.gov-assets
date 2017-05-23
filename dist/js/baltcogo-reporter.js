(function() {
	'use strict';

	angular.module('baltcogoApp', []);
})();
(function(app) {
	'use strict';

	app.factory('createReportService', ['$http', createReportService]);

	function createReportService($http) {

		function post(data, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http.post("https://testservices.baltimorecountymd.gov/api/baltcogo/createreport", data, postOptions)
				.then(
					function (response) {
						successCallback(response.data);
					},
					function (error) {
						errorCallback(error);
					}
				);
		}

		return {
			post: post
		}
	}

})(angular.module('baltcogoApp'));
(function(app) {
	'use strict';

	app.factory('mapService', ['$http', mapService]);

	function mapService($http) {

		var apiKey = 'AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8',
			targetCounty = 'Baltimore County',
			marker,

			clearMarker = function () {
				if (marker)
					marker.setMap(null);
			},

			createAutoComplete = function (autocompleteElementId, settings) {
				return new google.maps.places.Autocomplete(document.getElementById(autocompleteElementId), settings);
			},

			createMap = function(mapElementId, settings) {
				return new google.maps.Map(document.getElementById(mapElementId), settings);
			},

			createMarker = function(map, latitude, longitude) {
				if (marker) {
					marker.setMap(null);
				}

				marker = new google.maps.Marker({
					position: { lat: latitude, lng: longitude},
					map: map,
					icon: '/sebin/n/f/icon-marker-my-report.png', 
					draggable: false,
					animation: google.maps.Animation.DROP
				});
			},

			reverseGeocode = function(latitude, longitude, callback) {
				$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey).then(function (response) {

					var address = response.data.results[0].formatted_address,
						isBaltimoreCounty = checkCounty(response.data.results);

					if (isBaltimoreCounty) {
						callback(address);
					} else {
						clearMarker();
						callback('');
					}
				});
			},

			addressLookup = function(addressQuery, callback) {
				$http.get('https://maps.googleapis.com/maps/api/geocode/json?region=US&address=' + addressQuery + '&key=' + apiKey)
					.then(function (response) {
						if (response.data.results.length) {
							var latitude = response.data.results[0].geometry.location.lat;
							var longitude = response.data.results[0].geometry.location.lng;
														
							callback(response.data.results[0].formatted_address, latitude, longitude);
						} else {
							callback('');
						}
					}, function (error) {
						console.log('error!', error);
					});		
			
			},

			pan = function(map, latitude, longitude) {
				map.panTo({
					lat: latitude,
					lng: longitude
				});
			};


		/*** Private Functions **********/

		function checkCounty(reverseGeocodeData) {
			var countyArr = $.grep(reverseGeocodeData, filterCountyResults),
				county = '';

			if (countyArr && countyArr.length)
				county = countyArr[0].formatted_address;

			return county.indexOf(targetCounty) !== -1 ? county : false;
		}

		function filterCountyResults(item, index) {
			return filterResults(item, index, 'administrative_area_level_2');
		}

		function filterResults(item, index, query) {
			var matchArr;
			if (item.types) {
				matchArr = $.grep(item.types, function (item, index) {
					return item === query;
				});
			}
			return matchArr.length ? matchArr : false;
		}

		function removeCountry(addressString) {
			return addressString.replace(', USA', '');
		}

		return {
			createMarker: createMarker,
			reverseGeocode: reverseGeocode,
			addressLookup: addressLookup,
			createMap: createMap,
			createAutoComplete: createAutoComplete,
			removeCountry: removeCountry,
			pan: pan
		};
	};

})(angular.module('baltcogoApp'));
(function (app, querystringer) {
	'use strict';

	app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', '$timeout', 'mapService', 'createReportService', reporterController]);

	function reporterController($http, $scope, $timeout, mapService, createReportService) {

		var self = this,
			targetCounty = 'Baltimore County',
			categoryId = querystringer.getAsDictionary().categoryid * 1;

		$http.get('/sebin/y/z/animal-breeds.json').then(breedSuccessHandler, errorHandler);
		$http.get('/sebin/u/t/animal-colors.json').then(colorSuccessHandler, errorHandler); 
		$http.get('/sebin/a/d/animal-types.json').then(animalTypeSuccessHandler, errorHandler);
		$http.get('/sebin/q/l/categories.json').then(categorySuccessHandler, errorHandler);
		$http.get('/sebin/m/z/pet-types.json').then(petTypeSuccessHandler, errorHandler);
		
		self.isAnimal = false;
		self.page = 1;		
		self.isDone = false;
		self.isSuccess = false;
		self.issueId = '';
		self.isLoading = false;

		var mapSettings = {
				center: {
					lat: 39.4001857,
					lng: -76.6063945
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

		angular.element('#citysourced-reporter-form').on('keyup keypress', preventSubmitOnEnterPressHandler);
		google.maps.event.addListener(self.map, 'click', mapClickHandler);
		autocomplete.addListener('place_changed', autocompletePlaceChangedHandler);
		angular.element('#addressSearch').on('click', addressSearchClickHandler);
		angular.element('#address').on('keyup', addressEnterPressHandler)

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

			if (self.locationDescription) data.push({
				name: 'Description Of Location',
				id: angular.element('#locationDescription').attr('data-cs-id') * 1,
				value: self.locationDescription
			});

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

		self.loadSubCategories = function (categoryId) {
			if (!categoryId) {
				self.subCategories = [];
				return;
			}

			angular.forEach(self.categoryData, function (element) {
				clearCategoryData();

				if (element.id == categoryId) {
					self.subCategories = element.types;
					if (element.states) {
						self.states = element.states;
						self.state = element.states[0]; // Maryland
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
						var currentCenter = self.map.getCenter();
						google.maps.event.trigger(self.map, "resize");
						self.map.setCenter(currentCenter);
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
					var currentCenter = self.map.getCenter();
					google.maps.event.trigger(self.map, "resize");
					self.map.setCenter(currentCenter);
				}, 500);
			}
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

		/***** Private - Helpers *****/

		function autoSelectCategories(categoryId) {
			angular.forEach(self.categoryData, function(categoryItem) {
				if (categoryItem.id === categoryId) {
					self.category = categoryItem;
					self.loadSubCategories(categoryItem.id)
				} else {
					if (categoryItem.types) {
						angular.forEach(categoryItem.types, function(typeItem) {
							if (typeItem.id === categoryId) {
								self.category = categoryItem;
								self.loadSubCategories(categoryItem.id)
								self.subCategory = typeItem;
							}
						});						
					}
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
		}

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

		function getFirstSuggestion() {
			var pacItem = angular.element('.pac-item').first(),
				firstSuggestion = pacItem.find('.pac-item-query').text() + ' ' + pacItem.find('> span').last().text();
			
			return firstSuggestion;
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
					if (value.$untouched)
						value.$setTouched();
				}			
			});

			return requiredElementsCount === visibleRequiredElementsCount;
		}

		/***** Private - Handlers *****/		

		function addressEnterPressHandler(event) {
			var keyCode = event.which || event.keyCode;

			if (keyCode === 13) {	
				$timeout(function() {
					if (!autocomplete.getPlace() || !autocomplete.getPlace().formatted_address) {
						angular.element('#addressSearch').trigger('click');
					}
				}, 250);
			}
		}

		function addressSearchClickHandler() {
			if (!self.address)
				return;

			var firstSuggestion = getFirstSuggestion(),
				addressField = $scope.citySourcedReporterForm.address,
				$wrapper = angular.element('#map').closest('cs-form-control');

			mapService.addressLookup(firstSuggestion, function (address, latitude, longitude) {
				mapService.reverseGeocode(latitude, longitude, function(isBaltimoreCounty) {
					if (isBaltimoreCounty) {
						$wrapper.removeClass('error');
						self.address = mapService.removeCountry(firstSuggestion);
						mapService.createMarker(self.map, latitude, longitude);
						mapService.pan(self.map, latitude, longitude);
					} else {
						$wrapper.addClass('error');
						addressField.$setDirty();
						self.address = '';
					}
				});
			});
		};

		function animalTypeSuccessHandler(response) {
			self.animalTypeData = response.data;
		}

		function animalTypeSuccessHandler(response) {
			self.animalTypeData = response.data;
		}

		function autocompletePlaceChangedHandler() {	
			$scope.$apply(function() {
				self.address = mapService.removeCountry(self.address);
			});
			var place = autocomplete.getPlace();

			if (place.geometry) {
				var latitude = place.geometry.location.lat(),
					longitude = place.geometry.location.lng();

				self.latitude = latitude;
				self.longitude = longitude;

				mapService.reverseGeocode(latitude, longitude, function(isBaltimoreCounty) {
					if (isBaltimoreCounty) {
						mapService.createMarker(self.map, latitude, longitude);
						mapService.pan(self.map, latitude, longitude);
					}
				});
			}
		}

		function breedSuccessHandler(response) {
			self.animalBreedData = response.data;
		}

		function categorySuccessHandler(response) {
			self.categoryData = response.data;

			if (categoryId)
				autoSelectCategories(categoryId);
		}

		function colorSuccessHandler(response) {
			self.animalColorData = response.data;
		}

		function errorHandler(err) {
			console.log(err);
		}

		function mapClickHandler(event) {
			var $wrapper = angular.element('#map').closest('cs-form-control'),
				addressField = $scope.citySourcedReporterForm.address;

			self.latitude = event.latLng.lat();
			self.longitude = event.latLng.lng();

			mapService.reverseGeocode(self.latitude, self.longitude, function (baltimoreCountyAddress) {
				if (baltimoreCountyAddress) {
					$wrapper.removeClass('error');
					mapService.createMarker(self.map, self.latitude, self.longitude);
					self.address = mapService.removeCountry(baltimoreCountyAddress);
				} else {
					$wrapper.addClass('error');
					addressField.$setDirty();
					self.address = '';
				}
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

})(angular.module('baltcogoApp'), baltimoreCounty.utility.querystringer);