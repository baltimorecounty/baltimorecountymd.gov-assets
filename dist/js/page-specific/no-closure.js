require([
    "esri/tasks/query", "esri/tasks/QueryTask",
    "dojo/dom", "dojo/on", "dojo/domReady!"], function (Query, QueryTask, dom, on) {

    var queryTask = new QueryTask("//gis.baltimorecountymd.gov/arcgis/rest/services/Apps/RoadClosureProd/MapServer/0");

    var query = new Query();
    query.returnGeometry = false;
    query.outFields = ["*"];
    query.where = "1=1";

    queryTask.execute(query, showResults);

    function showResults(results) {
        var resultCount = results.features.length;
        if (!resultCount) {
            var divToShow = document.getElementsByClassName("no-closures-container");

            for (var i = 0; i < divToShow.length; i++) {
                divToShow[i].style.display = "block";
            }
        }
    }
});

require(["BcGisQuery", "jquery", "footable"], function(BcGisQuery, $, footable) {
    var template = '<table data-filter="#filter" class="footable table">';
    template += '<thead><tr><th class="footable-first-column" data-toggle="true">Road</th><th data-toggle="true">Community</th><th data-hide="phone" data-name="Closed">Closed Date</th><th data-hide="phone" data-name="Between">Between</th><th data-hide="phone">Reason</th></tr></thead>';
    template += '<tbody>';
    template += '{{#.}}';
    template += '{{#attributes}}';
    template += '<tr class="{{CLOSURE_ID}}"><td>{{#CLOSED_ROAD_NAME}}{{CLOSED_ROAD_NAME}}{{/CLOSED_ROAD_NAME}}</td><td>{{#COMMUNITY}}{{COMMUNITY}}{{/COMMUNITY}}</td><td data-type="numeric" data-value="{{#date}}{{ROAD_CLOSURE_DATE}}{{/date}}" class="date">{{ROAD_CLOSURE_DATE}}</td><td>{{CROSS_ST_1}} {{#CROSS_ST_2}}& {{CROSS_ST_2}}{{/CROSS_ST_2}}</td><td>{{CLOSURE_TYPE}}</td></tr>';
    template += "{{/attributes}}";
    template += "{{/.}}";
    template += '</tbody>';
    template += "</table>";

    var roads = new BcGisQuery({
        outfields: [
            "CLOSURE_ID", "ROAD_CLOSURE_DATE", "CLOSURE_TYPE ", "CLOSED_ROAD_NAME ", "CROSS_ST_1", "CROSS_ST_2", "COMMUNITY"
        ],
        resultsContainer: 'unmapped-results',
        //serviceUrl: "http://arcgisdev101/arcgis/rest/services/Apps/RoadClosure/MapServer/3",
        serviceUrl: "//gis.baltimorecountymd.gov/arcgis/rest/services/Apps/RoadClosureProd/MapServer/3",
        template: template
    });

    //Check to see if there are any unmapped roads
    roads.GetResults(function(results) {
        //Unmapped roads exist
        if (results.length) {
            $('.' + roads.resultsContainer + "-container").show();
            //Shop a list of Roads in the specified results container
            //Once the roads are loaded, intialize the footable plugin
            roads.Show(function() {
                $('.footable').footable();
            });
        }
    });
    

});