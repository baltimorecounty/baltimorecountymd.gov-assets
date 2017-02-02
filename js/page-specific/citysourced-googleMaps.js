namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.googleMaps = (function(googleMaps, undefined) {

    var marker, autocomplete,

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

        trackLatLng(latitude, longitude);
    },

    /**
     * Handler for the autocomplete's 'place_changed' event. When the autocomplete populates 
     * with a selected address, this will center the map on that location and drop a pin.
     */
    autocompletePlaceChangedHandler = function() {
        var latitude = autocomplete.getPlace().geometry.location.lat(),
            longitude = autocomplete.getPlace().geometry.location.lng(),
            center = new google.maps.LatLng(latitude, longitude);

        clearMarker();

        window.map.panTo(center);                            
        window.map.setZoom(16);

        var center = window.map.getCenter();
        google.maps.event.trigger(window.map, 'resize');
        map.setCenter(center);

        createMarker(latitude, longitude);
        trackLatLng(latitude, longitude);
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
                    lat: 39.5025,
                    lng: -76.6090
                },
                scrollwheel: false,
                zoom: 10,
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