require([
    "myPlaceholder",
    "bootstrap",
    "esri/dijit/Legend",
    "underscore",
    "doTimeout",
    "esri/map",
    "esri/SpatialReference",
    "esri/geometry/Extent",
    "esri/tasks/RelationshipQuery",
    "dojo/promise/all",
    "esri/InfoTemplate",
    "jquery",
    "mustache",
    "esri/dijit/editing/AttachmentEditor",
    "esri/geometry/Point",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/TimeExtent",
    "dojo/number",
    "dojo/date/locale",
    "dojo/dom",
    "dojo/on",
    "dojo/_base/array",
    "dojo/store/Memory",
    "dgrid/OnDemandGrid",
    "dojo/domReady!"],
    function (myPlaceholder,
        Bootstrap,
        Legend,
        _,
        doTimeout,
        Map,
        SpatialReference,
        Extent,
        RelationshipQuery,
        all,
        InfoTemplate,
        $,
        Mustache,
        AttachmentEditor,
        Point,
        FeatureLayer,
        Query,
        TimeExtent,
        number,
        locale,
        dom,
        on,
        arrayUtils,
        Memory,
        OnDemandGrid) {
        var decodeEntities = (function () {
            // this prevents any overhead from creating the object each time
            var element = document.createElement('div');

            function decodeHTMLEntities(str) {
                if (str && typeof str === 'string') {
                    // strip script/html tags
                    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi,
                        '');
                    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi,
                        '');
                    element.innerHTML = str;
                    str = element.textContent;
                    element.textContent = '';
                }

                return str;
            }

            return decodeHTMLEntities;
        })();

        var urls = {
            parkLayer: '//bcgis.baltimorecountymd.gov/arcgis/rest/services/Apps/WalkingTrails/MapServer/0',
            trailLayer: '//bcgis.baltimorecountymd.gov/arcgis/rest/services/Apps/WalkingTrails/MapServer/1'
        };

        var parkInfoWindowTemplate,
            trailsTemplate,
            trailTemplate,
            attachTemplate,
            map,
            parkLayer,
            trailLayer,
            pageInfo,
            pageLoaded = false,
            appData = {
                ids: [],
                parks: [],
                trails: [],
                attachs: []
            },
            coalitionMessage = "<a href='/boards-commissions/health/local-health-improvement' title='Learn more about the Baltimore County Health Colation'><img src='/sebin/e/t/coalitionapproved.gif' alt='This walking trail location is Health Coalition approved.' /></a>";

        parkInfoWindowTemplate = function (desc) {
            return "<div id='info' class='park-info'><p>" + desc + "</p>" +
                "<a href='https://www.google.com/maps/?daddr=${Lat},${Long}'>" +
                "Get Directions</a><a href='#parkid${ID}-${OBJECTID}' class='js-infoWindow-more-info pull-right' " +
                "data-object-id='${OBJECTID}' title='View More Information on ${NAME}'>More Information</a>" +
                "<div id='attach'></div>" +
                "</div>";
        };

        trailsTemplate = "<ul class='trails'>{{#.}}{{#attributes}}{{#NAME}}";
        trailsTemplate += "<li id='parkid{{ID}}-{{OBJECTID}}' data-park-id='{{ID}}' data-object-id='{{OBJECTID}}' class='park'>";
        trailsTemplate += "<div class='row'>";
        trailsTemplate += "<div class='col-md-8 col-sm-8'>";
        trailsTemplate += "<h2 class='park-name'>{{NAME}}</h2>";
        trailsTemplate += "</div>";
        trailsTemplate += "<div class='col-md-4 col-sm-4 health-coalition'>";
        trailsTemplate += "{{#isEndorsed}}{{HC_ENDORSEMENT}}{{/isEndorsed}}";
        trailsTemplate += "</div>";
        trailsTemplate += "</div>";
        trailsTemplate += "<div class='row'>";
        trailsTemplate += "<div class='col-md-8 col-sm-8'>";
        trailsTemplate += "<strong>About this Site</strong>";
        trailsTemplate += "<p class='park-desc'>{{#convertLinks}}{{DESC_}}{{/convertLinks}}</p>";
        trailsTemplate += "<div class='park-map'></div>";
        trailsTemplate += "</div>";
        trailsTemplate += "<div class='col-md-4 col-sm-4'>";
        trailsTemplate += "<address class='park-address'>";
        trailsTemplate += "<strong>Contact Information</strong><br />";
        trailsTemplate += "{{CONTACT}}<br>";
        trailsTemplate += "{{#ADDRESS}}<span class='address-label'>Address:</span> <a href='http:\/\/maps.google.com\/maps?daddr={{Lat}},{{Long}}' title='Get Directions to {{NAME}}'>{{ADDRESS}}<\/a>{{\/ADDRESS}}";
        trailsTemplate += "{{^ADDRESS}}<a href='http:\/\/maps.google.com\/maps?daddr={{LATLNG}}' title='Get Directions to {{NAME}}'>{{LATLNG}}<\/a>{{\/ADDRESS}}<br>";
        trailsTemplate += "{{#PHONE}}<span class='address-label'>Phone:</span> {{PHONE}}<br />{{\/PHONE}}";
        trailsTemplate += "{{#CONTACT_EMAIL}}<span class='address-label'>Email:</span> <a href='mailto:{{CONTACT_EMAIL}}' title='Email {{CONTACT}}'>{{CONTACT_EMAIL}}</a>{{\/CONTACT_EMAIL}}";
        trailsTemplate += "<\/address>";
        trailsTemplate += "<\/div>";
        trailsTemplate += "</div>";
        trailsTemplate += "<div class='row'>";
        trailsTemplate += "<div class='park-trails col-md-12'>";
        // trailsTemplate += "<h3 class='trails-header-hidden'>Trails</h3>";
        trailsTemplate += "<ul class='nav nav-tabs park-trails-nav'></ul>";
        trailsTemplate += "<div class='trail-tabs tab-content'></div>";
        trailsTemplate += "</div>";
        trailsTemplate += "</div>";
        trailsTemplate += "</li>";
        trailsTemplate += "{{/NAME}}{{/attributes}}{{/.}}</ul>";


        var trailNavTemplate = "";
        trailNavTemplate += "{{#.}}";
        trailNavTemplate += "{{#attributes}}";
        trailNavTemplate += "<li><a href='#trail{{PARK_ID}}{{OBJECTID}}' data-toggle='tab'>{{TRAIL_NAME}}</a></li>";
        trailNavTemplate += "{{\/attributes}}";
        trailNavTemplate += "{{\/.}}";


        trailTemplate = "";
        trailTemplate += "{{#.}}";
        trailTemplate += "{{#attributes}}";
        trailTemplate += "<div id='trail{{PARK_ID}}{{OBJECTID}}' data-object-id='{{OBJECTID}}' class=\"trail tab-pane\">";
        trailTemplate += "<h3 class=\"trail-name\">{{TRAIL_NAME}}<\/h3>";
        trailTemplate += "<p class=\"trail-desc\">{{TRAIL_DESC}}<\/p>";
        trailTemplate += "<p class=\"trail-type\"><strong>Type:</strong> {{TRAIL_TYPE}}<\/p>";
        trailTemplate += "<div class=\"trail-map\"><\/div>";
        trailTemplate += "<\/div>";
        trailTemplate += "{{\/attributes}}";
        trailTemplate += "{{\/.}}";

        attachTemplate = function (label) {
            return "{{#.}}<a href='{{url}}' id='attach-{{objectId}}' class='btn btn-default trail-map object-{{objectId}}' title='View the Park Map'>" + label + "</a>{{/.}}";
        };

        window.myData = appData;

        //Hide the initial message that describes a list of road closures should exist here
        $('.initial-message').hide();

        //HACK: To fix issue when going back to the app with a filter applied for demo
        //This will be udpated in a upcoming release
        var $filter = $('.js-trails-filter');
        if ($filter.val()) {
            $filter.val('');
            $('body').focus();
        }

        map = new Map("map", {
            basemap: "hybrid",
            center: [-76.6455, 39.4671],
            zoom: 10,
            displayGraphicsOnPan: false,
            autoResize: false
        });

        map.on("load", function () {

            //On Zoom Change
            map.on("extent-change", onZoom);

            parkLayer = new FeatureLayer(urls.parkLayer, {
                name: "parks",
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"], //Return all fields from the layer
                orderByFields: ["NAME"],
                infoTemplate: new InfoTemplate("") //This can be empty because we are going to update it later in the app
            });

            //Get a list of parks and display them in a list
            parkLayer.on("load", GetParksList);

            //Listen for click event on point
            parkLayer.on("click", DisplayParkInfoWindow);

            trailLayer = new FeatureLayer(urls.trailLayer, {
                name: "trails",
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"], //Return all fields from the layer
                orderByFields: ["NAME ASC"]
            });

            //Add Layers to the map
            map.addLayers([parkLayer]);

        });

        //add the legend
        map.on("layers-add-result", function (evt) {
            var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
                return {
                    layer: layer.layer,
                    title: layer.layer.name
                };
            });
            if (layerInfo.length > 0) {
                var legendDijit = new Legend({
                    map: map,
                    layerInfos: layerInfo
                }, "legend");
                legendDijit.startup();
            }
        });

        var DisplayParkInformation = function (evt) {
            if (pageInfo.recordsPerPage !== pageInfo.totalRecords) {
                var $this = $(this),
                    objectId = parseInt($this.attr('data-object-id')),
                    anchor = $this.attr('href'),
                    pageNumber = getParkObjectPageNumber(objectId);

                //If the park you want to view more information is already on the page, maintain default behavior
                //Otherwise get the appropraite page and data and then navigate to that information section
                queryRecordsByPage(pageNumber);
            }
        },
            DisplayParkInfoWindow = function (evt) {
                var graphic = evt.graphic,
                    geometry = graphic.geometry,
                    latLng = GetLatLong(geometry);

                /*Update the attributes to include Lat and Long for Use with our Template*/
                graphic.attributes.Lat = latLng.Lat;
                graphic.attributes.Long = latLng.Long;

                //Update the Infowindow based on 
                UpdateInfoWindowContent(evt, parkInfoWindowTemplate);
            },
            GetLatLong = function (geometry) {
                var point = new Point(geometry.x, geometry.y, geometry.spatialReference);

                return {
                    Lat: point.getLatitude(),
                    Long: point.getLongitude()
                };
            },
            GetTrails = function (parks) {
                if (parks) {
                    var query = new Query();
                    query.outFields = ["*"];
                    query.where = "PARK_ID IN (" + parks + ")";

                    var results = localDataExists('trails', query);

                    if (results) {
                        ShowTrails(results.features);
                    } else {
                        trailLayer.queryFeatures(query).then(function (results) {
                            storeData("trails", {
                                query: query,
                                data: results
                            });

                            ShowTrails(results.features);
                        });
                    }
                }
            },
            GetParksList = function (filter) {
                //Build the query to retreive the data
                var query = new Query();
                query.where = "name is not null";
                query.orderByFields = ["NAME"];
                if (typeof filter === 'string') {
                    query.where = filter;
                }

                var results = localDataExists("ids", query);

                if (results) {
                    fetchRecords(results.objectIds);
                } else {
                    parkLayer.queryIds(query, function (objectIds) {
                        storeIds({
                            query: query,
                            objectIds: objectIds
                        });

                        fetchRecords(objectIds);
                    });
                }

            },
            storeAttach = function (data) {
                //Loop through existing data and make sure it doesn't already exist
                for (var i = 0; i < appData.attachs.length; i++) {
                    //Compare existing attachment data to the one being passed in
                    var isEqual = _.isEqual(appData.attachs[i], data);

                    //If these two objects match return out of the function
                    if (isEqual) {
                        return;
                    }
                }

                //If the data doesn't exist push it ot hte appData object
                appData.attachs.push(data);
            },
            storeIds = function (data) {
                //Loop through existing application data
                for (var i = 0; i < appData.ids.length; i++) {
                    //Check to see if the data already exists
                    var isEqual = _.isEqual(data, appData.ids[i]);

                    //If these two objects match return out of the function
                    if (isEqual) {
                        return;
                    }
                }

                //If the data doesn't exist push it ot hte appData object
                appData.ids.push(data);
            },
            storeData = function (type, data) {
                //Loop through existing data and make sure it doesn't already exist
                for (var i = 0; i < appData[type].length; i++) {
                    var existingData = appData[type][i];
                    var isEqual = _.isEqual(existingData.query, data.query);

                    if (isEqual) {
                        return;
                    }
                }

                //If the data doesn't exist push it ot the appData object
                appData[type].push(data);

            },
            GetAttachment = function (layer, objectId) {
                return layer.queryAttachmentInfos(objectId);
            },
            FilterRecords = function (evt) {
                var $this = $(evt.target),
                    userInput = $this.val(),
                    filter = buildQueryParams(userInput);

                GetParksList(filter);

            },
            GetParks = function (recordsPerPage, currentPage) {
                if (!IsNumeric(recordsPerPage)) {
                    pageInfo.recordsPerPage = pageInfo.totalRecords;
                    //Get the records, there will only be one page
                    queryRecordsByPage(1);
                } else {
                    var records = parseInt(recordsPerPage),
                        page = pageInfo.currentPage;
                    if (records === 10) {
                        page = Math.ceil(page / 2);
                    } else {
                        page = page * 2;
                    }
                    //Set the records per Page to the total Records to show all records
                    pageInfo.recordsPerPage = records;
                    queryRecordsByPage(page);
                }
            },
            ShowAttachment = function (attachs, type, label) {

                if (attachs.length > 0) {
                    //$("." + type + " ." + type + "-map").html('')
                    //Loop through each trail so that we can determine where it should go
                    for (var i = attachs.length - 1; i >= 0; i--) {

                        //Create html based off of the trail template
                        var content = Mustache.render(attachTemplate(label), attachs[i]),
                            //Get the selector of the list item
                            selector = '.' + type + '[data-object-id=' + attachs[i].objectId + "]" + " ." + type + "-map",
                            hiddenClass = "trails-header-hidden";

                        //Append the html to the appropriate park in the list
                        setTimeout(function () {
                            $(selector)
                                .html(content).find('.' + hiddenClass).removeClass(hiddenClass); //remove class that is hiding the header for trails;
                        }, 250);



                    }
                }
            },
            ShowAttachments = function (layer, objectIds, type, label) {
                for (var i = 0; i < objectIds.length; i++) {
                    var objectId = objectIds[i],
                        localAttach = localAttachExists(layer.name, objectId);

                    if (localAttach) {
                        ShowAttachment(localAttach, type, label);
                    } else {

                        GetAttachment(layer, objectIds[i]).then(function (results) {
                            if (results.length) {
                                storeAttach({
                                    layer: layer.name,
                                    objectId: objectId,
                                    data: results
                                });

                                ShowAttachment(results, type, label);
                            }
                        });
                    }
                }
            },
            ShowParks = function (results, callback) {
                var parks = results.features;
                //Sort the list in alphabetical order
                parks = addLatLong(parks.sort(compare));

                parks.convertLinks = function () {
                    return function (text, render) {
                        var words = decodeEntities(render(text));

                        //http://stackoverflow.com/questions/5796718/html-entity-decode
                        //textContent is not supported in IE8, so use jQuery to fix decode the text
                        if (!words) {
                            words = $('<div />').html(render(text)).text();
                        }

                        return words.replace(/(http:\/\/[^\s]+)/gi, '<a href="$1" title="View more information">$1</a>');
                    };
                };

                parks.isEndorsed = function () {
                    return function (text, render) {
                        if (render(text) !== "NO") {
                            return coalitionMessage;
                        }
                    };
                };

                //Get Park 
                var content = Mustache.render(trailsTemplate, parks);

                //Put results on the screen
                $('.parks').html(content);

                //Get a list of Visible Parks Id's so we can get their Trails
                var parkIds = cleanParks(getFeatureProperty(results.features, "ID").join(',')),
                    parkObjectIds = getFeatureProperty(results.features, "OBJECTID");

                //Get Trails and Then Append them to the Parks
                GetTrails(parkIds);

                if (parkObjectIds) {
                    //Get the attachments and then append them to the Parks
                    ShowAttachments(parkLayer, parkObjectIds, "park", "Site Map");
                }

                if (callback && typeof callback === 'function') {
                    callback(content);
                }
            },
            cleanParks = function (parksStr) {
                return _.without(parksStr.split(','), "");
            },
            ShowTrails = function (trails) {
                //Sort trails in ascending order by name
                trails.sort(compareTrails);

                //Clear existing trails tabs
                $('.park-trails-nav, .trail-tabs').html("");

                //Loop through each trail so that we can determine where it should go
                for (var i = 0; i < trails.length; i++) {

                    //Create html based off of the trail template
                    var content = Mustache.render(trailTemplate, trails[i]),
                        //Get the selector of the list item
                        selector = "[data-park-id='" + trails[i].attributes.PARK_ID + "']",
                        hiddenClass = "trails-header-hidden";

                    var navContent = Mustache.render(trailNavTemplate, trails[i]);

                    $('.park-trails-nav', selector).append(navContent).find('li:first').addClass('active').find('a').text("Featured Trail");

                    //Append the html to the appropriate park in the list
                    $('.trail-tabs', selector)
                        .append(content).parent()
                        .find('.' + hiddenClass).removeClass(hiddenClass)
                        .end()
                        .find('.tab-pane:first').addClass('active'); //remove class that is hiding the header for trails
                }

                var trailObjectIds = getFeatureProperty(trails, "OBJECTID");

                ShowAttachments(trailLayer, trailObjectIds, "trail", "Trail Map");

            },
            UpdateInfoWindowContent = function (evt, template) {
                //Set the title of teh infowindow to the name of the Park
                parkLayer.infoTemplate.setTitle("${NAME}");

                var graphicAttributes = evt.graphic.attributes,
                    desc = graphicAttributes.DESC_;
                if (desc.length > 255) {
                    desc = graphicAttributes.DESC_.substring(0, 255) + "...";
                }

                //Set teh infowindow content
                parkLayer.infoTemplate.setContent(template(desc));

                //Show the info window
                map.infoWindow.show(evt.point, map.getInfoWindowAnchor(evt.point));
            },
            addLatLong = function (features) {
                for (var i = 0; i < features.length; i++) {
                    var latLng = GetLatLong(features[i].geometry);

                    features[i].attributes.Lat = latLng.Lat;
                    features[i].attributes.Long = latLng.Long;
                }
                return features;
            },
            buildQueryParams = function (input) {
                return "ZIPCODE LIKE '" + input +
                    "%' OR UPPER(CITY) LIKE UPPER('" + input +
                    "%') or UPPER(NAME) LIKE UPPER('%" + input + "%') AND name is not null";
            },
            compare = function (a, b) {
                var x = a.attributes.NAME.toLowerCase();
                var y = b.attributes.NAME.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            },
            compareTrails = function (a, b) {
                var x = a.attributes.TRAIL_NAME.toLowerCase();
                var y = b.attributes.TRAIL_NAME.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            },
            /*Example provided here https://developers.arcgis.com/javascript/jssamples/fl_paging.html */
            fetchRecords = function (objectIds) {

                if (objectIds) {
                    updatePageInformation(objectIds);
                    var page = getHashPageNumber();

                    queryRecordsByPage(page, window.location.hash);

                } else {
                    $('.parks').html('<h2>No Matching Parks</h2>');
                }
            },
            getFeatureProperty = function (features, field) {
                var values = [];
                for (var i = 0; i < features.length; i++) {
                    values.push(features[i].attributes[field]);
                }
                return values;
            },
            getParkObjectPageNumber = function (objectId) {
                var recordNumber = getParkObjectPosition(objectId);
                //Add one to the recordNumber because the array is zero based
                return Math.ceil((recordNumber + 1) / pageInfo.recordsPerPage);
            },
            getParkObjectPosition = function (objectId) {
                for (var i = 0; i < pageInfo.objectIds.length; i++) {
                    if (pageInfo.objectIds[i] === objectId) {
                        return i;
                    }
                }
            },
            goToRecord = function (anchor, html) {
                //Setting timeout to let the page content completely
                //Page is loading cotent as you go to it and it makes it look choppy
                var exists = $(anchor).html().length;

                anchor = anchor.replace("#", "");
                var obj = document.getElementById(anchor);
                obj.scrollIntoView();

                return;
            },
            hideLoadingMessage = function () {
                $('.js-loading-message').hide();
            },
            IsNumeric = function (input) {
                return (input - 0) == input && ('' + input).replace(/^\s+|\s+$/g, "").length > 0;
            },
            isRecordVisible = function (pageNumber) {
                return pageNumber === pageInfo.currentPage;
            },
            onZoom = function (evt) {
                var zoomLevel = map.getLevel(),
                    trailLayerVisible = map.getLayer(trailLayer.id);

                if (zoomLevel >= 15) {
                    if (trailLayerVisible === undefined) {
                        return map.addLayer(trailLayer);
                    }
                } else {
                    if (trailLayerVisible) {
                        return map.removeLayer(trailLayer);
                    }
                }
            },
            localAttachExists = function (layer, objectId) {
                for (var i = 0; i < appData.attachs.length; i++) {
                    if (_.isEqual(objectId, appData.attachs[i].objectId) && _.isEqual(layer, appData.attachs[i].layer)) {
                        return appData.attachs[i].data;
                    }
                }
            },
            localDataExists = function (type, query) {

                for (var i = 0; i < appData[type].length; i++) {
                    if (_.isEqual(query, appData[type][i].query)) {
                        return appData[type][i].data;
                    }
                }
            },
            updatePageControls = function (pageNumber) {
                var $jsPageBtn = $('.js-page-btn'),
                    $pageNumber = $('.page-' + pageNumber),
                    $lastNext = $('.js-last-btn, .js-next-btn'),
                    $firstPrev = $('.js-first-btn, .js-prev-btn'),
                    $allBtns = $('.js-first-btn, .js-last-btn, .js-prev-btn, .js-next-btn'),
                    numberOfPagingButtons = $('.paging-numbers:first').children().length;

                $jsPageBtn.removeClass('active');
                $pageNumber.addClass('active');

                if (pageNumber === pageInfo.totalPages() && pageInfo.totalPages() !== 1) {
                    $lastNext.attr('disabled', 'disabled');
                    $firstPrev.removeAttr('disabled');
                } else if (pageNumber === 1) {
                    $firstPrev.attr('disabled', 'disabled');
                    $lastNext.removeAttr('disabled');
                    if (numberOfPagingButtons === 1) {
                        $lastNext.attr('disabled', 'disabled');
                    }
                } else {
                    $allBtns.removeAttr('disabled');
                }

            },
            queryRecordsByPage = function (pageNumber, anchor, callback) {
                // check if the page number is valid
                if (pageNumber < 1 || pageNumber > pageInfo.totalPages) {
                    return;
                }

                showLoadingMessage();

                var begin = pageInfo.recordsPerPage * (parseInt(pageNumber) - 1),
                    end = begin + pageInfo.recordsPerPage,
                    results = localDataExists("parks", query),
                    totalPages = pageInfo.totalPages();

                //Set the current Page Number
                pageInfo.currentPage = pageNumber;

                createPagingLinks(totalPages, pageNumber);

                updateFilterControls(begin, end, pageNumber);

                if (results) {
                    //Show Parks List
                    ShowParks(results, callback);

                    //Hide the loading message.
                    hideLoadingMessage();

                } else {
                    // create the query
                    var query = new Query();
                    query.objectIds = pageInfo.objectIds.slice(begin, end);
                    query.where = "name is not null";
                    query.outFields = ["*"];

                    function dynamicSort(property) {
                        var sortOrder = 1;
                        if (property[0] === "-") {
                            sortOrder = -1;
                            property = property.substr(1);
                        }
                        return function (a, b) {
                            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                            return result * sortOrder;
                        }
                    }


                    function onParkLayerQuerySuccess(results) {
                        storeData("parks", {
                            query: query,
                            data: results
                        });

                        //Show Parks List
                        ShowParks(results, function (html) {
                            //Hide the loading message.
                            hideLoadingMessage();

                            if (anchor) {
                                goToRecord(anchor, html);
                            }

                            if (callback && typeof callback === 'function') {
                                callback();
                            }

                        });
                    }

                    function onParkLayerQueryError(err) {
                        console.log(err);
                    }

                    //Get the features based on the object ids we pass in.
                    parkLayer.queryFeatures(query, onParkLayerQuerySuccess, onParkLayerQueryError);
                }
            },
            //Check to see if there is a hash and direct the user appropriately
            checkHash = function (pageNumber) {
                var anchor = window.location.hash,
                    $hash = $(anchor),
                    totalPages = pageInfo.totalPages();

                //Make sure anchor exists and anchor is to a park
                if (anchor) {
                    if (anchor.indexOf('parkid') > -1) {
                        if ($hash.length) {
                            goToRecord(anchor);
                            pageLoaded = true;
                        } else {
                            //Search the next page for that ID
                            queryRecordsByPage(pageNumber + 1);
                        }
                        return;
                    }
                    if (anchor.indexOf('page') > -1) {
                        if (pageNumber > 1) {
                            queryRecordsByPage(pageNumber);
                        }
                        pageLoaded = true;
                        return;
                    }
                }
                else {
                    queryRecordsByPage(1);
                    pageLoaded = true;
                }
            },
            createPagingLinks = function (totalPages, currentPage) {
                var html = "",
                    start,
                    end;

                if (currentPage <= 3) {
                    start = 0;
                    end = totalPages < 5 ? totalPages : 5;
                } else if (currentPage > totalPages - 3) {
                    start = totalPages - 5;
                    end = totalPages;
                } else {
                    start = currentPage - 3;
                    end = currentPage + 2;
                }

                for (var i = start; i < end; i++) {
                    var pageNum = i + 1;
                    html += "<button class='btn btn-default js-page-btn page-" + pageNum + "' id='page-" + pageNum + "'>" + pageNum + "</button>";
                }

                $('.paging-numbers').html(html);

                updatePageControls(currentPage);

            },
            showLoadingMessage = function () {
                $('.js-loading-message').show();
            },
            updateFilterControls = function (begin, end, pageNumber) {
                //TODO: Put into some smaller methods
                var totalPages = pageInfo.totalPages(),
                    recordMessage = (begin + 1) + " - " + end + " of " + pageInfo.totalRecords;
                //Set the current Page Number
                pageInfo.currentPage = pageNumber;

                if (pageInfo.currentPage === totalPages) {
                    recordMessage = (begin + 1) + " - " + pageInfo.totalRecords + " of " + pageInfo.totalRecords;
                }

                $('.page-info').html(" | Page: " + pageInfo.currentPage + " of " + totalPages);
                $('.records-info').html(recordMessage);
            },
            updatePageInformation = function (objectIds, page) {
                pageInfo = {
                    objectIds: objectIds,
                    totalRecords: objectIds.length,
                    totalPages: function () {
                        var _this = this;
                        return Math.ceil(objectIds.length / _this.recordsPerPage);
                    },
                    currentRange: function () {
                        var _this = this,
                            low = _this.currentPage === 1 ? 1 : (_this.currentPage - 1) * _this.recordsPerPage + 1,
                            high = _this.recordsPerPage * _this.currentPage > _this.totalRecords ? _this.totalRecords : _this.recordsPerPage * _this.currentPage;
                        return low + " to " + high;
                    },
                    currentPage: page || 0,
                    recordsPerPage: 10
                };

                if (pageInfo.currentPage > pageInfo.totalPages()) {
                    queryRecordsByPage(pageInfo.currentPage - 1);
                }
            };

        /*Events*/
        $(document).on("click", '.js-prev-btn', function (e) {
            e.preventDefault();
            queryRecordsByPage(pageInfo.currentPage - 1);

            window.location.hash = pageInfo.currentPage === 1 ? "page-1" : "page-" + (pageInfo.currentPage);
        });

        $(document).on("click", '.js-next-btn', function (e) {
            e.preventDefault();
            queryRecordsByPage(pageInfo.currentPage + 1);

            window.location.hash = "page-" + (pageInfo.currentPage);
        });

        $(document).on("click", '.js-first-btn', function (e) {
            e.preventDefault();
            //This will always be one!
            queryRecordsByPage(1);

            window.location.hash = "page-1";
        });

        $(document).on("click", '.js-last-btn', function (e) {
            e.preventDefault();
            queryRecordsByPage(pageInfo.totalPages());

            window.location.hash = "page-" + pageInfo.totalPages();
        });

        $(document).on("click", '.js-infoWindow-more-info', DisplayParkInformation);


        $(document).on("click", '.js-legend-toggle', function (evt) {
            evt.preventDefault();
            var $this = $(evt.target),
                status = $this.text().toLowerCase(),
                $legend = $('.map-legend'),
                $mapContainer = $('.map-container'),
                visibleClass = 'map-legend-visible';

            if (status === "show legend") {
                $legend.addClass(visibleClass);
                $mapContainer.addClass('col-md-9 col-sm-9');
                $this.text('Hide Legend');
            }
            //Legend is visble, we want to hide it
            else {
                $legend.removeClass(visibleClass);
                $mapContainer.removeClass('col-md-9 col-sm-9');
                $this.text('Show Legend');
            }

        });

        $(document).on('click', '.js-page-btn', function (evt) {
            evt.preventDefault();
            var $this = $(evt.target),
                pageNumber = parseInt($this.text());

            window.location.hash = $this.attr('id');

            queryRecordsByPage(pageNumber);
        });


        $(document).on('click', '.js-show-records', function (evt) {
            evt.preventDefault();
            var $this = $(evt.target),
                recordsPerPage = $this.text();

            $('.js-show-records button').removeClass('active');

            $this.addClass('active');

            //Update the record count to reflect the one that was not selected
            $('.js-show-records').html($this.parent().html());

            var $paging = $('.paging').children();

            //Hide the paging links if all records are shown
            (recordsPerPage.toLowerCase()) === 'show all' ? $paging.hide() : $paging.show();

            GetParks(recordsPerPage, pageInfo.currentPage);
        });

        $(document).on("keyup", '.js-trails-filter', function (evt) {
            window.location.hash = 'filter';
            //Only fire the filter when the user is done typing 
            $(this).doTimeout('typing', 250, function () {
                FilterRecords(evt);
            });

            //Focus back on the input, this is required for a firefox bug
            $(this).focus();
        });
        $(document).on('click', '.trail-tabs nav-tabs a', function (evt) {
            evt.preventDefault();
            $(this).tab('show');
        });


        $(document).on('click', '.js-clear-filter', function (e) {
            e.preventDefault();
            var $filter = $(this).parent().find('input');

            //Clear the filter
            //Then trigger the keyup event so the the filter refreshes
            $filter.val('').trigger('keyup');

        });

        var locationHashChanged = function () {
            var hash = window.location.hash,
                page = getHashPageNumber();

            if (!hash) {
                queryRecordsByPage(1, hash);
                return;
            }

            queryRecordsByPage(page, hash);
        },
            getHashPageNumber = function () {
                var hash = window.location.hash,
                    page = 1;
                if (hash.indexOf('page') > -1) {
                    page = parseInt(hash.split("-")[1]);
                }
                if (hash.indexOf('parkid') > -1) {
                    var parkId = parseInt(hash.split("-")[1]);
                    page = getParkObjectPageNumber(parkId);
                }

                return page;
            };

        window.onhashchange = locationHashChanged;


    });