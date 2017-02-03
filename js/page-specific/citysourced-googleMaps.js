namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.googleMaps = (function(googleMaps, undefined) {

    var marker, 
        autocomplete,
        apiKey = 'AIzaSyAqazsw3wPSSxOFVmij32C_LIhBSuyUNi8',
        targetCounty = 'Baltimore County',

    /**
     * Creates the map, and renders it in the mapElementId element.
     */
    createMap = function(mapElementId, settings) {
        window.map = new google.maps.Map(document.getElementById(mapElementId), settings);        
    },

    /**
     * Creates the autocomplete, and attaches it to the autocompleteElementId element.
     */
    createAutoComplete = function(autocompleteElementId, settings) {
        autocomplete = new google.maps.places.Autocomplete(document.getElementById(autocompleteElementId), settings);
    },

    /**
     * Adds a marker to the map.
     */
    createMarker = function(latitude, longitude) {
        marker = new google.maps.Marker({
            map: window.map,
            position: {
                lat: latitude,
                lng: longitude
            },
            animation: google.maps.Animation.DROP
        });            
    },

    /**
     * Clears a marker from the map.
     */
    clearMarker = function() {
        if (marker)
            marker.setMap(null);
    },

    /**
     * Handler for the map's 'click' event. Drops a pin on the map wherever you click, 
     * and and tracks the latitude and longitude of the pin. Makes sure only one pin 
     * can exist at a time.
     */
    mapClickHandler = function(event) {
        var latitude = event.latLng.lat(),
            longitude = event.latLng.lng();

        clearMarker();

        createMarker(latitude, longitude);
        reverseGeocode(latitude, longitude);
        trackLatLng(latitude, longitude);
    },

    /**
     * Handler for the autocomplete's 'place_changed' event. When the autocomplete populates 
     * with a selected address, this will center the map on that location and drop a pin.
     */
    autocompletePlaceChangedHandler = function() {
        var place = autocomplete.getPlace(),
            latitude = place.geometry.location.lat(),
            longitude = place.geometry.location.lng(),
            center = new google.maps.LatLng(latitude, longitude);

        clearMarker();

        window.map.panTo(center);                            
        window.map.setZoom(16);

        google.maps.event.trigger(window.map, 'resize');
        map.setCenter(center);

        createMarker(latitude, longitude);
        trackLatLng(latitude, longitude);
    },

    /**
     * Looks up the street address from the latitude and longitude.
     */
    reverseGeocode = function(latitude, longitude) {
        var $target = $('#address');

        $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey).done(function(data) {
            var address = getAddress(data.results);

            if (address) {
                $target.parent().removeClass('error');
                $target.val(address);
            } else {
                $target.parent().addClass('error');
                $target.val('');
            }

        });
    },

    /**
     * Returns the friendly address string from the reverse geocoding.
     */
    getAddress = function(reverseGeocodeData) {
        var streetAddressArr = $.grep(reverseGeocodeData, filterStreetAddressResults),
            countyArr = $.grep(reverseGeocodeData, filterCountyResults);        
        return isBaltimoreCounty(countyArr) ? streetAddressArr && streetAddressArr.length ? streetAddressArr[0].formatted_address : '' : '';
    },

    isBaltimoreCounty = function(countyArr) {
        var county = '';
        if (countyArr && countyArr.length) 
            county = countyArr[0].formatted_address;
        return county.indexOf(targetCounty) !== -1;
    },

    filterStreetAddressResults = function(item, index) {
        return filterResults(item, index, 'street_address');
    },

    filterCountyResults = function(item, index) {
        return filterResults(item, index, 'administrative_area_level_2');
    },

    filterResults = function(item, index, query) {
        var matchArr;
        if (item.types) {
            matchArr = $.grep(item.types, function(item, index) {
                return item === query;
            });
        }
        return matchArr.length ? matchArr : false;
    },

    /**
     * Updates the hidden fields with the values of the latitude and longitude from 
     * a dropped pin or an address search.
     */
    trackLatLng = function(latitude, longitude) {
        document.getElementById('map-latitude').value = latitude;
        document.getElementById('map-longitude').value = longitude;
    },

    /**
     * Create the map and autocomplete, and attach up the click and place_changed handler.
     */
    initGoogle = function() {
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

        createMap('map', mapSettings);
        createAutoComplete('address', autocompleteSettings);
        google.maps.event.addListener(map, 'click', mapClickHandler);
        autocomplete.addListener('place_changed', autocompletePlaceChangedHandler);
    };

    return {
        initGoogle: initGoogle
    };

})();