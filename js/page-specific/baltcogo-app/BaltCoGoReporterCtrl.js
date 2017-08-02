(function (app, querystringer) {
  'use strict';

  app.controller('BaltCoGoReporterCtrl', ['$http', '$scope', '$timeout', '$routeParams', 'mapServiceComposite', 'reportService', 'smartSearch', 'dataService', reporterController]);

  function reporterController($http, $scope, $timeout, $routeParams, mapServiceComposite, reportService, smartSearch, dataService) {

    var self = this,
    var targetCounty = 'Baltimore County';
    var categoryId = $routeParams && $routeParams.categoryId ? $routeParams.categoryid * 1 : null;
    var map;

    $http.get('/sebin/y/z/animal-breeds.json').then(breedSuccessHandler, errorHandler);
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

    function autoSelectCategories(categoryId) {
      angular.forEach(self.categoryData, function (categoryItem) {
        if (categoryItem.id === categoryId) {
          self.category = categoryItem;
          self.loadSubCategories(categoryItem.id);
        } else {
          if (categoryItem.types) {
            angular.forEach(categoryItem.types, function (typeItem) {
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

    function breedSuccessHandler(response) {
      self.animalBreedData = response.data;
    }

    function categorySuccessHandler(response) {
      self.categoryData = response.data;
      if (categoryId) {
        autoSelectCategories(categoryId);
      }
      setupCategoryAutocomplete(response.data);

    }

    function setupCategoryAutocomplete(data) {
      dataService.getSynonyms().then(function (synonyms) {

      });
    }

    function getTags(description) {
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
      var $wrapper = angular.element('#map').closest('cs-form-control'),
        addressField = $scope.citySourcedReporterForm.address;

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