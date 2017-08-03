(function() {
	'use strict';

	angular.module('baltcogoApp', ['ngRoute']);
})();
(function (app) {

  app.factory('animalService', ['$http', '$q', '$log', animalService]);

  function animalService($http, $q, $log) {
    return {
      getAnimalType: getAnimalType,
      getBreeds: getBreeds
    };

    function getAnimalType(str) {
      var deferred = $q.defer();
      var animalType = null;
      var animalObj = null;

      getBreeds().then(function (breeds) {
        for (var i = 0, length = breeds.length; i < length; i++) {
          animalObj = breeds[i];
          if (str && str.indexOf(animalObj.animal) > -1) {
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

})(angular.module('baltcogoApp'));
(function (app) {

  app.factory('dataService', ['$http', '$q', '$log', dataService]);

  function dataService($http, $q, $log) {
    return {
      getSynonyms: getSynonyms
    };

    function getSynonyms() {
      return $http.get('/sebin/c/y/synonyms.json', {
        cache: true
      }).then(synonymsSuccessResponse)
        .catch(handleError);
    };

    function synonymsSuccessResponse(response) {
      return response.data;
    }

    function handleError(errorMsg) {
      $log.error("Error: ", errorMsg);
    }
  }

})(angular.module('baltcogoApp'));
(function(app) {
	'use strict';

	app.factory('mapServiceComposite', ['$http', mapServiceComposite]);

	function mapServiceComposite($http) {

		var targetCounty = 'Baltimore County',
			marker,
			spatialReferenceId = 4269,
			geocodeServerUrlBCGIS = 'http://bcgis.baltimorecountymd.gov/arcgis/rest/services/Geocoders/AddressPoint_NAD83/GeocodeServer',
			originLongitude = -76.60652470000002, 
			originLatitude = 39.4003288,

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

			reverseGeocode = function(latitude, longitude, successCallback, errorCallback) {				
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
			},

			suggestAddresses = function(address, callback) {
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
								results.push(suggestedAddress.text.toLowerCase());
							});
							callback(results);
						}, 
						function(err) { console.log('err', err); }
					);
				});

			},


			addressLookup = function(addressQuery, successCallback, errorCallback) {			
			
				require(["esri/tasks/Locator"], 
					function(Locator) { 

					var locatorSettings = {
						countryCode: 'US',
						outSpatialReference: spatialReferenceId,
						url: geocodeServerUrlBCGIS
					};

					var addressToLocationsParams = {
						address: { 'Single Line Input': addressQuery },
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
								successCallback(sortedFoundAddresses[0]);
							} else {
								errorCallback('No location was found for this address.');
							}
						}, errorCallback);
				});
			},

			pan = function(map, latitude, longitude) {
				map.panTo({
					lat: latitude,
					lng: longitude
				});
			},

			addressScoreComparer = function(a, b) {
				if (a.score < b.score)
					return 1;

				if (a.score > b.score)
					return -1;
				
				return 0;
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
			addressLookup: addressLookup,
			createAutoComplete: createAutoComplete,
			createMap: createMap,
			createMarker: createMarker,
			pan: pan,
			removeCountry: removeCountry,
			reverseGeocode: reverseGeocode,
			suggestAddresses: suggestAddresses
		};
	};

})(angular.module('baltcogoApp'));
(function(app) {
	'use strict';

	app.factory('reportService', ['$http', reportService]);

	function reportService($http) {

		function post(data, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http.post("//testservices.baltimorecountymd.gov/api/baltcogo/createreport", data, postOptions)
				.then(
					function (response) {
						successCallback(response.data);
					},
					function (error) {
						errorCallback(error);
					}
				);
		}

		function getById(reportId, successCallback, errorCallback) {
			$http.get('//testservices.baltimorecountymd.gov/api/citysourced/getreport/' + reportId)
				.then(
					function(response) {
						successCallback(response.data);					
					}, 
					function (error) {
						errorCallback(error);
					}
				);
		};

		function getNearby(settings, successCallback, errorCallback) {
			var postOptions = {
				headers: {
					'Content-Type': 'application/json'
				}
			};		

			$http.post("//testservices.baltimorecountymd.gov/api/citysourced/getreportsbylatlng", settings, postOptions)
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
			post: post,
			getById: getById,
			getNearby: getNearby
		};
	}

})(angular.module('baltcogoApp'));
(function (app) {
  app.factory('smartSearch', ['$window','$log', smartSearch]);

  function smartSearch($window, $log) {
    function SmartSearchFactory($window, $log) {
      if (!$window.Fuse) {
        $log.error("Unable to load the smart search, we probably need to do something else. You probably forgot to include the reference to the fuse library");
        return null;
      }
      return $window.Fuse;
    }

    return SmartSearchFactory($window, $log);
  }
})(angular.module('baltcogoApp'));


(function (app, querystringer) {
  'use strict';

  app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', '$location', '$timeout', '$routeParams', 'mapServiceComposite', 'reportService', 'animalService', 'smartSearch', 'dataService', reporterController]);

  function reporterController($http, $scope, $location, $timeout, $routeParams, mapServiceComposite, reportService, animalService, smartSearch, dataService) {

    var self = this;
    var targetCounty = 'Baltimore County';
    var categoryId = $routeParams && $routeParams.categoryId ? $routeParams.categoryid * 1 : null;
    var map;

    self.helpFormattedData = [];
    self.showCategoryAutocomplete = $location.hash() !== 'original-form';

    animalService.getBreeds()
      .then(breedSuccessHandler)
      .catch(errorHandler);

    $http.get('/sebin/u/t/animal-colors.json').then(colorSuccessHandler, errorHandler);
    $http.get('/sebin/a/d/animal-types.json').then(animalTypeSuccessHandler, errorHandler);
    $http.get('/sebin/q/n/categories.json').then(categorySuccessHandler, errorHandler);
    $http.get('/sebin/m/z/pet-types.json').then(petTypeSuccessHandler, errorHandler);

    self.isAnimal = false;
    self.page = 1;
    self.isDone = false;
    self.isSuccess = false;
    self.issueId = '';
    self.isLoading = false;
    self.latitude = 0;
    self.longitude = 0;

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

    map = mapServiceComposite.createMap('map', mapSettings);
    google.maps.event.addListener(map, 'click', mapClickHandler);

    angular.element('#citysourced-reporter-form').on('keyup keypress', preventSubmitOnEnterPressHandler);
    angular.element('#address').on('keyup', autocompleteHandler);
    angular.element(window).on('keydown', autocompleteResultButtonKeyboardNavigationHandler);


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

      /*** Conditional fields **********/

      if (self.locationDescription) data.push({
        name: 'Description Of Location',
        id: self.descriptionOfLocationId,
        value: self.locationDescription
      });

      if (self.otherDescription) data.push({
        name: 'Other Description',
        id: self.otherDescriptionId,
        value: self.otherDescription
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

      reportService.post(data,
        function (responseData) {
          self.isLoading = false;
          self.isSuccess = true;
          self.issueId = JSON.parse(responseData).CsResponse.ReportId;
        },
        function (errorData) {
          self.isLoading = false;
          console.log(errorData);
        });
    };

    self.loadSubCategories = function () {
      if (!self.category) {
        self.subCategories = [];
        return;
      }

      angular.forEach(self.categoryData, function (element) {
        clearCategoryData();

        if (element.id == self.category) {

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

          $timeout(function () {
            if (element.descriptionOfAnimal)
              self.descriptionOfAnimalId = element.descriptionOfAnimal;

            if (element.descriptionOfLocation)
              self.descriptionOfLocationId = element.descriptionOfLocation;

            if (element.otherDescription)
              self.otherDescriptionId = element.otherDescription;
          }, 0);

          self.descriptionId = element.description;
        }
      });
    };

    self.nextClick = function () {
      if (validatePanel()) {
        self.page++;

        if (self.page === 2) {
          setTimeout(function () {
            var currentCenter = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(currentCenter);
          }, 500);
        }
      }
      else
        $scope.citySourcedReporterForm.$setSubmitted();
    };

    self.prevClick = function () {
      self.page--;
      if (self.page === 2) {
        setTimeout(function () {
          var currentCenter = map.getCenter();
          google.maps.event.trigger(map, "resize");
          map.setCenter(currentCenter);
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

    self.lookupAddress = function (address) {
      self.autocompleteResults = [];
      self.address = address;
      geocodeAndMarkAddress(address);
    };

    /***** Private - Helpers *****/

    function setCategoriesAndPetTypeManually(animalType) {
      $timeout(function () {
        $('#categories').val(self.category);
        $('#subCategories').val(self.subCategory);

        if (animalType) {
          $scope.$apply(function () {
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
      angular.forEach(self.categoryData, function (categoryItem) {
        if (categoryItem.id === categoryId) {
          self.category = categoryItem;
          self.loadSubCategories(categoryItem.id);
        } else {
          if (categoryItem.types) {
            angular.forEach(categoryItem.types, function (typeItem) {
              if (typeItem.id === categoryId) {
                self.category = categoryItem.id;
                self.loadSubCategories();

                //Hack we need to set it again because it's cleared by loadSubCategories
                self.category = categoryItem.id;
                self.subCategory = typeItem.id;

                setCategoriesAndPetTypeManually(animalType);
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
      self.streetAddress = '';
      self.city = '';
      self.zipCode = '';
      self.descriptionOfAnimalId = 0;
      self.descriptionOfLocationId = 0;
      self.otherDescriptionId = 0;
    }

    function geocodeAndMarkAddress(singleLineAddress) {
      mapServiceComposite.addressLookup(singleLineAddress, function (foundAddress) {
        self.latitude = foundAddress.location.y;
        self.longitude = foundAddress.location.x;
        mapServiceComposite.pan(map, self.latitude, self.longitude);
        mapServiceComposite.createMarker(map, self.latitude, self.longitude);
      }, function (err) {
        displayAddressError();
      });
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
      var pacItem = angular.element('.pac-item').first();
      var firstSuggestion = pacItem.find('.pac-item-query').text() + ' ' + pacItem.find('> span').last().text();

      return firstSuggestion;
    }

    function validatePanel() {
      var requiredElements = angular.element('#citysourced-reporter-form .panel:visible [required]');
      var requiredElementsCount = requiredElements.length;
      var validRequiredElementsCount = requiredElements.filter('.ng-valid').length;
      var controls = $scope.citySourcedReporterForm.$$controls;

      angular.forEach(controls, function (formControl, key, obj) {
        if (formControl.$$element.closest('.panel').is(':visible')) {
          if (formControl.$pristine) {
            formControl.$setDirty();
          }

          if (formControl.$untouched) {
            formControl.$setTouched();
          }

          if (formControl.$$element.is('#address')) {
            if (self.latitude === 0 || self.longitude === 0) {
              formControl.$setValidity('required', false);
            }
          }
        }
      });

      return requiredElementsCount === validRequiredElementsCount;
    }

    /***** Private - Handlers *****/

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
      } else {
        if (self.address && self.address.trim().length > 3) {
          mapServiceComposite.suggestAddresses(self.address, function (autoCompleteResults) {
            self.autocompleteResults = autoCompleteResults;
            $scope.$apply();
          });
        }
      }
    }

    function autocompletePlaceChangedHandler() {
      var place = autocomplete.getPlace();
      if (place.formatted_address)
        geocodeAndMarkAddress(place.formatted_address);
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

    function breedSuccessHandler(breedData) {
      self.animalBreedData = breedData;
    }

    function categorySuccessHandler(response) {
      self.categoryData = response.data;
      if (categoryId) {
        autoSelectCategories(categoryId);
      }
      setupCategoryAutocomplete(response.data);
    }

    function setupCategoryAutocomplete(categories) {
      dataService.getSynonyms().then(function (synonyms) {
        self.synonyms = synonyms;
        categories.forEach(formatCategoriesForCategoryAutocomplete);
        setupSmartSearcher();
      });
    }

    function formatCategoriesForCategoryAutocomplete(category) {
      var formattedData = [];
      category.types.forEach(function (type) {
        var formattedType = getformattedCategoryType(self.synonyms, category, type);
        formattedData.push(formattedType);
      });

      self.helpFormattedData = self.helpFormattedData.concat(formattedData);
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

        function clearQuery() {
          self.helpQuery = "";
        }

        function setAutoCompleteValue(val, shouldBlur) {
          var $smartSearch = $('#smart-search');
          $smartSearch.typeahead('val', val);
          
          if (shouldBlur) {
            $smartSearch.blur();
          }
        }

        function getSearchResult(key) {
          var data = localStorage.getItem(key);
          return data ? JSON.parse(data) : null;
        }

        function saveSearchResult(key, val) {
          localStorage.setItem(key, JSON.stringify(val));
        }

        function onCursorChange(event, selection) {
          setAutoCompleteValue(self.helpQuery);
        }

        function onSelected(event, selection, query) {
          if (selection.item && selection.item.category.name.toLowerCase().indexOf('animals') > -1) {
            animalService.getAnimalType(self.helpQuery).then(function (animalType) {
              autoSelectCategories(selection.item.subcategory.id, animalType);
            });
          }
          else {
            self.petType = '';
            autoSelectCategories(selection.item.subcategory.id);
          }
          $timeout(function () {
            setAutoCompleteValue(selection.item.subcategory.name, true);
          }, 0)

          //clearQuery();
        }

        self.smartSearcher = new smartSearch(self.helpFormattedData, options);

        self.typeAhead = $('#smart-search').typeahead({
          highlight: true
        });

        var typeAhead = $('#smart-search')
          .typeahead({
            highlight: true
          },
          {
            source: function (query, syncResults) {
              syncResults(self.smartSearcher.search(query));
            },
            templates: {
              suggestion: function (data) {
                data = data.item;
                return '<div><p class="text-muted" data-category="' + data.category.id + '" data-id="' + data.subcategory.id + '">' + data.subcategory.name + '</p></div>';
              },
              empty: function () {
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
      Object.keys(synonyms).forEach(function (synonym, index) {
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
      console.log(err);
    }

    function mapClickHandler(event) {
      var $wrapper = angular.element('#map').closest('cs-form-control');
      var addressField = $scope.citySourcedReporterForm.address;

      self.autocompleteResults = [];
      self.latitude = event.latLng.lat();
      self.longitude = event.latLng.lng();

      mapServiceComposite.reverseGeocode(self.latitude, self.longitude, function (response) {
        $wrapper.removeClass('error');
        mapServiceComposite.createMarker(map, self.latitude, self.longitude);
        self.address = response.address.Street.toLowerCase() + ', ' + response.address.City.toLowerCase() + ', ' + response.address.State.toUpperCase();
        $scope.$apply();
      }, function (err) {
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

})(angular.module('baltcogoApp'), baltimoreCounty.utility.querystringer);