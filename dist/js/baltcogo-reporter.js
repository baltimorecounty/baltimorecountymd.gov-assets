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

			$http.post("http://ba224964:1000/api/baltcogo/createreport", data, postOptions)
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
					draggable: false,
					animation: google.maps.Animation.DROP
				});
			},

			reverseGeocode = function(latitude, longitude, callback) {
				var $target = angular.element('#address');

				$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey).then(function (response) {

					var address = getAddress(response.data.results);

					if (address) {
						$target.parent().removeClass('error');
						callback(removeCountry(address));
					} else {
						$target.parent().addClass('error');
						clearMarker();
						callback('');
					}
				});
			},

			addressLookup = function(addressQuery, callback) {
				$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + addressQuery + '&key=' + apiKey)
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
			
			};


		/*** Private Functions **********/

		function getAddress(reverseGeocodeData) {
			var countyArr = $.grep(reverseGeocodeData, filterCountyResults);
			return isBaltimoreCounty(countyArr) ? reverseGeocodeData[0].formatted_address : false;
		}

		 function isBaltimoreCounty(countyArr) {
			var county = '';
			if (countyArr && countyArr.length)
				county = countyArr[0].formatted_address;
			return county.indexOf(targetCounty) !== -1;
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
			removeCountry: removeCountry
		};
	};

})(angular.module('baltcogoApp'));
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
		document.getElementById('address').addEventListener('keyup', addressKeyupHandler);

		function addressKeyupHandler(event) {
			if (event.which === 13) {
				$timeout(function() {

					/*angular.element('#address').trigger({
						type: 'keypress',
						which: 40
					});*/

					/*var addressParts = [];
					angular.element('.pac-item').first().find('span').each(function(index, element) {
						addressParts.push(angular.element(element).text());
					});

					self.address = addressParts.join(' ');

					console.log(addressParts.join(' '));*/
				});
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

				setTimeout(function() {
					google.maps.event.trigger(self.map, "resize");
				}, 500);
			}
			else
				$scope.citySourcedReporterForm.$setSubmitted();				
		};

		self.prevClick = function () {
			self.page--; 
			setTimeout(function() {
				google.maps.event.trigger(self.map, "resize");
			}, 500);
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