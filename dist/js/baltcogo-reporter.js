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
		};
	}

})(angular.module('baltcogoApp'));
(function(app) {
	'use strict';

	app.factory('mapService', ['$http', mapService]);

	function mapService($http) {
		var pictureMarkerSymbol;
		var spatialReferenceId = 4269;
		var originLongitude = -76.6063945;
		var originLatitude = 39.4001857;
		var geocodeServerUrlArcGIS = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';
		var geocodeServerUrlBCGIS = 'http://bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/AddressPoint_NAD83/GeocodeServer';

		var createMap = function(mapElementId, creationCallback) {

			require([
				'esri/Map',
				'esri/views/MapView',
				'esri/symbols/PictureMarkerSymbol',
				'esri/Graphic',
				'esri/geometry/Point',
				'dojo/domReady!'
			], function (Map, MapView, PictureMarkerSymbol, Graphic, Point) {

				pictureMarkerSymbol = new PictureMarkerSymbol({
					url: 'http://dev.baltimorecountymd.gov/sebin/n/f/icon-marker-my-report.png', 
					height: 60, 
					width: 35
				});

				var mapSettings = {
					basemap: "topo-vector"
				};
				var map = new Map(mapSettings);

				var mapViewSettings = {
					container: mapElementId,
					map: map,
					zoom: 13,
					center: [originLongitude, originLatitude]
				};
				var view = new MapView(mapViewSettings);

				/*var viewClickHandler = function(e) {
					var longitude = e.mapPoint.longitude;
					var latitude = e.mapPoint.latitude;
					var point = new Point(longitude, latitude);
					var marker = new Graphic(point, pictureMarkerSymbol);

					view.graphics.removeAll();
					view.graphics.add(marker);

					angular.element('#map-longitude').val(longitude);
					angular.element('#map-latitude').val(latitude);

					reverseGeocode(longitude, latitude);
				};*/
				
				//view.on('click', viewClickHandler);

				creationCallback(view, Point, Graphic, pictureMarkerSymbol);
			});
		};

		var suggestAddresses = function(address, callback) {

			require(["esri/tasks/Locator", 'esri/geometry/Point'], 
				function(Locator, Point) { 

				var locatorSettings = {
					countryCode: 'US',
					outSpatialReference: spatialReferenceId,
					url: geocodeServerUrlBCGIS
				};

				var suggestParams = {
					location: new Point(originLongitude, originLatitude),
					text: address
				};

				var requestOptions = {
					responseType: 'json'
				};

				var locator = new Locator(locatorSettings);

				locator.suggestLocations(suggestParams, requestOptions).then(
					function(suggestedAddresses) {
						var results = [];
						angular.forEach(suggestedAddresses, function(suggestedAddress) {
							results.push(suggestedAddress.text);
						});
						callback(results);
					}, 
					function(err) { console.log('err', err); }
				);
			});

		};

		var lookupAddress = function(address, callback) {
			require(["esri/tasks/Locator"], 
				function(Locator) { 

				var locatorSettings = {
					countryCode: 'US',
					outSpatialReference: spatialReferenceId,
					url: geocodeServerUrlBCGIS
				};

				var addressToLocationsParams = {
					address: { 'Single Line Input': address },
					f: 'json'
				};

				var requestOptions = {
					responseType: 'json'
				};

				var locator = new Locator(locatorSettings);

				locator.addressToLocations(addressToLocationsParams, requestOptions).then(
					function(foundAddresses) {
						if (foundAddresses.length) {
							var sortedFoundAddresses = foundAddresses.sort(addressScoreComparer);						
							callback(sortedFoundAddresses[0]);
						}
					}, 
					function(err) { console.log('err', err); }
				);
			});
		};

		var reverseGeocode = function(longitude, latitude, successCallback, errorCallback) {
			require([
				"esri/tasks/Locator",
				'esri/geometry/Point'				
			], function(Locator, Point) { 

				var point = new Point(longitude, latitude);

				var locatorSettings = {
					countryCode: 'US',
					outSpatialReference: spatialReferenceId,
					url: geocodeServerUrlBCGIS
				};

				var locator = new Locator(locatorSettings);

				var requestOptions = {
					responseType: 'json'
				};

				locator.locationToAddress(point).then(successCallback, errorCallback);
			});
		};

		var dropMarker = function(view, longitude, latitude) {
			require([
				'esri/Graphic',
				'esri/geometry/Point',
				'dojo/domReady!'
			], function (Graphic, Point) {
				var point = new Point(longitude, latitude);
				var marker = new Graphic(point, pictureMarkerSymbol);
				
				view.goTo(point, { animate: true, duration: 250 });
				view.graphics.removeAll();
				view.graphics.add(marker);
			});
		}

		var addressScoreComparer = function(a, b) {
			if (a.score < b.score)
				return 1;

			if (a.score > b.score)
				return -1;
			
			return 0;
		}

		/*** Private Functions **********/

		return {
			createMap: createMap,
			dropMarker: dropMarker,
			lookupAddress: lookupAddress,
			reverseGeocode: reverseGeocode,
			suggestAddresses: suggestAddresses
		};
	}

})(angular.module('baltcogoApp'));
(function (app, querystringer) {
	'use strict';

	app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', '$timeout', 'mapService', 'createReportService', reporterController]);

	function reporterController($http, $scope, $timeout, mapService, createReportService) {

		var self = this,
			targetCounty = 'Baltimore County',
			categoryId = querystringer.getAsDictionary().categoryid * 1,
			autocompletePromise,
			mapView;

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

		self.map = mapService.createMap('map', function(view, Point, Graphic, pictureMarkerSymbol) {
			mapView = view;

			var viewClickHandler = function(e) {
				var longitude = e.mapPoint.longitude;
				var latitude = e.mapPoint.latitude;
				var point = new Point(longitude, latitude);
				var marker = new Graphic(point, pictureMarkerSymbol);

				self.longitude = longitude;
				self.latitude = latitude;

				view.graphics.removeAll();
				view.graphics.add(marker);

				mapService.reverseGeocode(longitude, latitude, function(foundAddress) {
					self.address = foundAddress.address.Street + ', ' + foundAddress.address.City + ', ' + foundAddress.address.State;
					$scope.$apply();
				}, function(err) {
					view.graphics.removeAll();
					displayAddressError();
				});
			};			

			view.on('click', viewClickHandler);
		});

		angular.element('#citysourced-reporter-form').on('keyup keypress', preventSubmitOnEnterPressHandler);
		angular.element('#address').on('keyup', autocompleteHandler);

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
				var stateId = self.state.id ? self.state.id : self.state;

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
			}
			else
				$scope.citySourcedReporterForm.$setSubmitted();				
		};

		self.prevClick = function () {
			self.page--; 		
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

		self.lookupAddress = function(address) {
			self.address = address;
			self.autocompleteResults = [];
			mapService.lookupAddress(address, function(addy) {
				self.longitude = addy.location.x;
				self.latitude = addy.location.y;
				mapService.dropMarker(mapView, self.longitude, self.latitude);
			});
		};

		/***** Private - Helpers *****/

		function autoSelectCategories(categoryId) {
			angular.forEach(self.categoryData, function(categoryItem) {
				if (categoryItem.id === categoryId) {
					self.category = categoryItem;
					self.loadSubCategories(categoryItem.id);
				} else {
					if (categoryItem.types) {
						angular.forEach(categoryItem.types, function(typeItem) {
							if (typeItem.id === categoryId) {
								self.category = categoryItem;
								self.loadSubCategories(categoryItem.id);
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
				validRequiredElementsCount = requiredElements.filter('.ng-valid').length,
				controls = $scope.citySourcedReporterForm.$$controls;

			angular.forEach(controls, function (formControl, key, obj) {
				if (formControl.$$element.closest('.panel').is(':visible')) {
					if (formControl.$pristine)
						formControl.$setDirty();
					if (formControl.$untouched)
						formControl.$setTouched();

					if (formControl.$$element.is('#address')) {
						if (angular.element('#map-latitude').is('.ng-invalid') || angular.element('#map-longitude').is('.ng-invalid')) {
							formControl.$setValidity('required', false);
						}

					}
				}			
			});

			return requiredElementsCount === validRequiredElementsCount;
		}

		/***** Private - Handlers *****/		

		function autocompleteHandler(event) {			
			if (self.address && self.address.trim().length > 3) {
				mapService.suggestAddresses(self.address, function(autoCompleteResults) {
					self.autocompleteResults = autoCompleteResults;
				});
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

			if (categoryId)
				autoSelectCategories(categoryId);
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
			console.log(err);
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