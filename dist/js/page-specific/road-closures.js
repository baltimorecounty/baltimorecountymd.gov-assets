/* eslint-disable */
require(["BcGisQuery", "jquery", "footable", "mustache"], function (BcGisQuery, $, footable, Mustache) {
    var template = '<table data-filter="#filter" class="footable table">';
    template += '<thead><tr><th class="footable-first-column" data-toggle="true">Road</th><th data-toggle="true">Community</th><th data-hide="phone,tablet" data-sort-initial="true" data-name="Closed">Closed Date</th><th data-hide="phone,tablet" data-name="Between">Between</th><th data-hide="phone">Reason</th></tr></thead>';
    template += '<tbody>';
    template += '{{#.}}';
    template += '{{#attributes}}';
    template += '<tr class="{{CLOSURE_ID}}"><td>{{#FIRST_STLABEL}}{{FIRST_STLABEL}}{{/FIRST_STLABEL}}</td><td>{{#FIRST_COMMUNITY}}{{FIRST_COMMUNITY}}{{/FIRST_COMMUNITY}}</td><td data-type="numeric" data-value="{{#date}}{{FIRST_ROAD_CLOSURE_DATE}}{{/date}}" class="date">{{FIRST_ROAD_CLOSURE_DATE}}</td><td>{{FIRST_INTERSECTIONLIST}}</td><td>{{FIRST_CLOSURE_TYPE}}</td></tr>';
    template += "{{/attributes}}";
    template += "{{/.}}";
    template += '</tbody>';
    template += "</table>";
    template += "{{^.}}";
    template += "<p>There are no major road closures reported at the current time</p>";
    template += "{{/.}}";

    var roads = new BcGisQuery({
        outfields: [
            "CLOSURE_ID", "FIRST_ROAD_CLOSURE_DATE", "FIRST_CLOSURE_TYPE", "FIRST_STLABEL", "FIRST_INTERSECTIONLIST", "FIRST_COMMUNITY"],
        resultsContainer: 'results',
        //serviceUrl: "http://arcgisdev101/arcgis/rest/services/Apps/RoadClosure/MapServer/0",
        serviceUrl: "https://bcgis.baltimorecountymd.gov/arcgis/rest/services/Apps/RoadClosureProd/MapServer/0",
        template: template
    });

    //Shop a list of Roads in the specified results container
    //Once the roads are loaded, intialize the footable plugin
    roads.Show(function () {

        var template = '{{#.}}';
        template += '{{#attributes}}';
        template += '<tr class="{{CLOSURE_ID}}"><td>{{#CLOSED_ROAD_NAME}}{{CLOSED_ROAD_NAME}}{{/CLOSED_ROAD_NAME}}</td><td>{{#COMMUNITY}}{{COMMUNITY}}{{/COMMUNITY}}</td><td data-type="numeric" data-value="{{#date}}{{ROAD_CLOSURE_DATE}}{{/date}}" class="date">{{ROAD_CLOSURE_DATE}}</td><td>{{CROSS_ST_1}} {{#CROSS_ST_2}}& {{CROSS_ST_2}}{{/CROSS_ST_2}}</td><td>{{CLOSURE_TYPE}}</td></tr>';
        template += "{{/attributes}}";
        template += "{{/.}}";

        var roads = new BcGisQuery({
            outfields: [
                "CLOSURE_ID", "ROAD_CLOSURE_DATE", "CLOSURE_TYPE ", "CLOSED_ROAD_NAME ", "CROSS_ST_1", "CROSS_ST_2", "COMMUNITY"],
            resultsContainer: 'unmapped-results',
            //serviceUrl: "http://arcgisdev101/arcgis/rest/services/Apps/RoadClosure/MapServer/3",
            serviceUrl: "https://bcgis.baltimorecountymd.gov/arcgis/rest/services/Apps/RoadClosureProd/MapServer/3",
            template: template
        });

        roads.GetResults(function (results) {
            if (results.length) {
                var html = Mustache.render(template, results);

                $('.results table').append(html);
            } else {
                //alert('No Results');
            }

            $('.footable').footable();
        });
    });

});