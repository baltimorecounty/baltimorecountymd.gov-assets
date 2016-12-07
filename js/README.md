# Javascript
This folder contains Javascript files used on the Baltimore County Governement Website

## County News Snippet
The CMS (Site Executive) allows us to inlcude an rss feed on any page.  However, it includes the entire feed.  We only want to display a snippet.  This script is responsible for formatting the feed as we desire.

**filename**: county-news-snippet.js  
**usage**: homepage.min.js  
### Dependencies
* [jQuery](https://jquery.com/)

## Flickr Feed
Gets a feed of flickr images by tag.  The flickr objects requires an apiKey, flickr nsid, search tags and allows you to pass in a template so that you can dislay the data as you wish.

**filename**: flickr-feed.js  
**usage**: homepage.min.js  
### Dependencies
* [jQuery](https://jquery.com/)
* [handlebars](http://handlebarsjs.com/)

### Options
Option | Type | Default | Description | Required
------ | ---- | ------- | ----------- | --------
apiKey | string | n/a |  [Get your key](https://www.flickr.com/services/api/misc.api_keys.html) | Yes
nsid | string | n/a | [Get your nsid](http://idgettr.com/) | Yes
searchTags | string (comma seperated) | "" | Should contain at least one tag | Yes
template | string | "" | [Learn more about handlesbar templates](http://handlebarsjs.com/) | Yes
$container | jquery object | n/a | Element that will contain the feed | Yes

### Usage
```javascript
var $flickFeedContainer = $('.county-photo-feed');

var photoFeed = new Flickr({
    apiKey: "yourapikey",
    nsid: "yournsid",
    searchTags: "featured", //comma seperated list
    template: "{{#each this}}<div class='county-photo-container col-md-3 col-sm-3 hidden-xs'><a href='//www.flickr.com/photos/baltimorecounty/{{id}}/' title='View this photo on Baltimore County&apos;s Flickr Album'><img alt='{{title}}' class='county-photo-feed-item' src='//farm{{farm}}.static.flickr.com/{{server}}/{{id}}_{{secret}}_q.jpg' alt='{{title}}' /></a></div>{{/each}}",
    $container: $flickFeedContainer
});
```
## Homepage Template
Specific to the baltimorecoutymd.gov homepage.  Initializes the county flickr feed, slick carousel and Google Analytics Event Tracking.  It also adds functionality to the site's hamburger menu.

**filename**: homepage-template.js  
**usage**: n/a

## Inside Template
Specific to the baltimorecoutymd.gov inside templates.  Initializes events for Google Analytics Event Tracking, site hamburger menu and adds the website url to our feedback form, which is included on most of the inside pages.

**filename**: inside-template.js  
**usage**: n/a

## Skip Nav
Specific to the baltimorecoutymd.gov website.  Fallback script for our Skip Nav Link that is displayed on the screen using CSS.

**filename**: skip-nav.js  
**usage**: template.min.js  
### Dependencies
* [jQuery](https://jquery.com/)

##Text Resizer
Tool used through the baltimorecoutymd.gov website.  Is located near the top of the screen on larger screen devices. Allows the user toincrease the size of the text on the site.

**filename**: text-resizer.js  
**usage**: template.min.js  
### Dependencies
* [jQuery](https://jquery.com/)

## Google Analytics
Contains google specific code to report analytics to Google Analytics.

**filename**: bc-google-analytics.js  
**usage**: template.min.js

## Google Analytics Custom Events
Contains events that will trigger event tracking in Google Analytics.  We are responsible for maintaining the events we want to track in this file.

Currently we are tracking:
* Search button selected throughout the .gov website.
* When a link on the search results page is selected

**filename**: bc-google-analytics-custom-events.js  
**usage**: template.min.js    
### Dependencies
* [jQuery](https://jquery.com/)


## List Filter
Filters unordered lists that are broken into sections.

### Usage
**Note:** You will need to use content inclusions for both the `<form>` tag and the `<script>` tag. Everything else can be directly on the page.

#### HTML for the form, error message, and filterable content.

```html
<form class="bc-filter-form">
    <label for="filter">Filter: Enter topic or keyword to filter content.</label>
    <input id="filter" value="" type="text" class="bc-filter-form-filter" />
    <button type="button" class="clear bc-filter-form-clearButton">Clear</button>
</form>

<div class="bc-filter-noResults" style="display: none;">No Search Results...Please Try Another Search</div>       

<div id="centerContent" class="bc-filter-content">
    <div>
        <h2>Section Header</h2>
        <ul>
            <li><a href="https://www.google.com">First List Item</a></li>
            <li><a href="https://www.google.com">Second List Item</a></li>
            <li><a href="https://www.google.com">Third List Item</a></li>
        </ul>
    </div>
</div>
```

#### HTML/JavaScript for the filter initialization. 

```html
<script>
    baltimoreCounty.listFilter.init({
        listWrapper: '.bc-filter-content',
        searchBox: '.bc-filter-form .bc-filter-form-filter',
        clearButton: '.bc-filter-form .bc-filter-form-clearButton',
        errorMessage: '.bc-filter-noResults'
    });     
</script>   
```

### Options
Option | Type | Default | Description | Required
------ | ---- | ------- | ----------- | --------
listWrapper|string|.bc-filter-content|jQuery selector that identifies the element that wraps the entire list.|Yes
searchBox|string|.bc-filter-form .bc-filter-form-filter|jQuery selector that identifies the filter's search box.|Yes
clearButton|string|.bc-filter-form .bc-filter-form-clearButton|jQuery selector that identifies the filter's "Clear" button.|Yes
errorMessage|string|.bc-filter-noResults|jQuery selector that identifies the element to display when there are no results.|Yes

**filename**: bc-list-filter.js     
**usage**: template.min.js 
### Dependencies
* [jQuery](https://jquery.com/)