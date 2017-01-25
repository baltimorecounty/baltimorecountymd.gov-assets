# Javascript
This folder contains Javascript files used on the Baltimore County Governement Website

## Accordion menu
Contains code to add and remove classes to the Bootstrap Accordion Menu in order to have arrows that indicate an expanded or collapsed list.

In order to use the Bootstrap Accordion Menu, the HTML for the menu must match the following format. `<div class="panel">` corresponds to top-level 
accordion items, and `<li class="panel">` for second-level accordion items. 

```HTML
<nav class="nav-list bc-accordion-menu">
    <div class="panel">
        <button class="accordion-collapsed" data-toggle="collapse" aria-expanded="false">Collapsable list one</button>
        <ul class="collapse">
            <li>
                <a href="/myplainlink1">Plain link one</a>
            </li>
            <li class="panel">
                <button class="accordion-collapsed" data-toggle="collapse" aria-expanded="false">Collapsable sub panel one</button>
                <ul class="collapse">
                    <li><a href="/mypage1">Page one</a></li>
                    <li><a href="/mypage2">Page two</a></li>
                    <li><a href="/mypage3">Page three</a></li>
                </ul>
            </li>
        </ul>
    </div>
</nav>
```

**filename**: accordion-menu.js    
**usage**: insidetemplate.min.js

### Dependencies
* [jQuery](https://jquery.com/)

## Content Filter
Filters unordered lists that are broken into sections, or tables.

### Usage
**Note:** You will need to use HTML Snippets in content inclusions for both the `<form>` tag and the `<script>` tag. Everything else can be directly on the page.

#### HTML for the filter's form. This must be in an HTML Snippet.
```html
<form id="filter-form" class="bc-filter-form">
    <p><strong>Filter:</strong> Enter topic or keyword to filter content.</p>
    <input id="filter" value="" type="text" class="bc-filter-form-filter" aria-label="Enter topic or keyword to filter content" />
    <input type="button" class="clear bc-filter-form-clearButton" value="Clear" />
</form>
```

#### HTML for the *list* filter and error message. This can be directly on the page.
```html
<div class="bc-filter-noResults" style="display: none;">No Search Results...Please Try Another Search</div>       

<div id="centerContent" class="bc-filter-content">
    <div>
        <h2>Section Header 1</h2>
        <ul>
            <li><a href="https://www.google.com">First List Item</a></li>
            <li><a href="https://www.google.com">Second List Item</a></li>
            <li><a href="https://www.google.com">Third List Item</a></li>
        </ul>
    </div>
    <div>
        <h2>Section Header 2</h2>
        <ul>
            <li><a href="https://www.google.com">Fourth List Item</a></li>
            <li><a href="https://www.google.com">Fifth List Item</a></li>
            <li><a href="https://www.google.com">Sixth List Item</a></li>
        </ul>
    </div>
</div>
```

#### HTML for the *table* filter and error message. This can be directly on the page.
```html
<div class="bc-filter-noResults" style="display: none;">No Search Results...Please Try Another Search</div>       

<table class="bc-filter-content">
    <tr>
        <th>Column Header 1</th>
        <th>Column Header 2</th>
        <th>Column Header 3</th>
    </tr>
    <tr>
        <td><a href="https://www.google.com">First Item</a></td>
        <td><a href="https://www.google.com">Second Item</a></td>
        <td><a href="https://www.google.com">Third Item</a></td>
    </tr>
    <tr>
        <td><a href="https://www.google.com">Fourth Item</a></td>
        <td><a href="https://www.google.com">Fifth Item</a></td>
        <td><a href="https://www.google.com">Sixth Item</a></td>
    </tr>
</table>
```

#### HTML/JavaScript for the filter initialization. This must be in an HTML Snippet.
```html
<script>
    baltimoreCounty.contentFilter.init({
        listWrapper: '.bc-filter-content',
        searchBox: '.bc-filter-form .bc-filter-form-filter',
        clearButton: '.bc-filter-form .bc-filter-form-clearButton',
        errorMessage: '.bc-filter-noResults',
        contentType: 'list'
    });     
</script>   
```

### Options
Option | Type | Default | Description | Required
------ | ---- | ------- | ----------- | --------
listWrapper|string|.bc-filter-content|jQuery selector that identifies the element that wraps the entire list.|No
searchBox|string|.bc-filter-form .bc-filter-form-filter|jQuery selector that identifies the filter's search box.|No
clearButton|string|.bc-filter-form .bc-filter-form-clearButton|jQuery selector that identifies the filter's "Clear" button.|No
errorMessage|string|.bc-filter-noResults|jQuery selector that identifies the element to display when there are no results.|No
contentType|string|list|Determines whether we're filtering an unordered list or a table. Acceptable values are **list** and **table**.|No

**filename**: bc-content-filter.js     
**usage**: insidetemplate.min.js 

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

## Google Analytics
Contains google specific code to report analytics to Google Analytics.

**filename**: bc-google-analytics.js  
**usage**: insidetemplate.min.js

## Google Analytics Custom Events
Contains events that will trigger event tracking in Google Analytics.  We are responsible for maintaining the events we want to track in this file.

Currently we are tracking:
* Search button selected throughout the .gov website.
* When a link on the search results page is selected

**filename**: bc-google-analytics-custom-events.js  
**usage**: insidetemplate.min.js    
### Dependencies
* [jQuery](https://jquery.com/)

## Homepage Template
Specific to the baltimorecoutymd.gov homepage.  Initializes the county flickr feed, slick carousel and Google Analytics Event Tracking.  It also adds functionality to the site's hamburger menu.

**filename**: homepage-template.js  
**usage**: n/a

## Inside Template
Specific to the baltimorecoutymd.gov inside templates.  Initializes events for Google Analytics Event Tracking, site hamburger menu and adds the website url to our feedback form, which is included on most of the inside pages.

**filename**: inside-template.js  
**usage**: n/a

## Photo Gallery
Creates a FancyBox photo gallery and links it to a preview image. See example setup for the HTML you'll need on the page. This should be customized in a HTML Snippet within a content inclusion.

### Example Setup
```html
<div class="bc-photo-gallery">
    <figure>
        <a href="javascript:;">
            <img src="/path/to/gallery-preview.jpg" />
            <i class="fa fa-camera fa-2x photo-icon" aria-hidden="true"></i>
        </a>
        <figcaption>
            <p>A gallery description.</p>
        </figcaption>
    </figure>
</div>
```

**filename**: photo-gallery.js  
**usage**: insidetemplate.min.js  
### Dependencies
* [jQuery](https://jquery.com/)
* [FancyBox](http://fancyapps.com)
* [FontAwesome](http://fontawesome.io)

## Skip Nav
Specific to the baltimorecoutymd.gov website.  Fallback script for our Skip Nav Link that is displayed on the screen using CSS.

**filename**: skip-nav.js  
**usage**: insidetemplate.min.js  
### Dependencies
* [jQuery](https://jquery.com/)

##Text Resizer
Tool used through the baltimorecoutymd.gov website.  Is located near the top of the screen on larger screen devices. Allows the user toincrease the size of the text on the site.

**filename**: text-resizer.js  
**usage**: insidetemplate.min.js  
### Dependencies
* [jQuery](https://jquery.com/)

