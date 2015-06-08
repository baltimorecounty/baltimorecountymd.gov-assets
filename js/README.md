#Javascript
This folder contains Javascript files used on the Baltimore County Governement Website

##County News Snippet
**filename**: county-news-snippet.js

The CMS (Site Executive) allows us to inlcude an rss feed on any page.  However, it includes the entire feed.  We only want to display a snippet.  This script is responsible for formatting the feed as we desire.

##Flickr Feed
**filename**: flickr-feed.js

Gets a feed of flickr images by tag.  The flickr objects requires an apiKey, flickr nsid, search tags and allows you to pass in a template so that you can dislay the data as you wish.

###Dependencies
* [jQuery](https://jquery.com/)
* [handlebars](http://handlebarsjs.com/)

###Options
Option | Type | Default | Description | Required
------ | ---- | ------- | ----------- | --------
apiKey | string | n/a |  [Get your key](https://www.flickr.com/services/api/misc.api_keys.html) | Yes
nsid | string | n/a | [Get your nsid](http://idgettr.com/) | Yes
searchTags | string (comma seperated) | "" | Should contain at least one tag | Yes
template | string | "" | [Learn more about handlesbar templates](http://handlebarsjs.com/) | Yes
$container | jquery object | n/a | Element that will contain the feed | Yes

###Usage
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
##Homepage Template
**filename**: homepage-template.js

Specific to the baltimorecoutymd.gov homepage.  Initializes the county flickr feed, slick carousel and Google Analytics Event Tracking.  It also adds functionality to the site's hamburger menu.

##Inside Template
**filename**: inside-template.js

Specific to the baltimorecoutymd.gov inside templates.  Initializes events for Google Analytics Event Tracking, site hamburger menu and adds the website url to our feedback form, which is included on most of the inside pages.

##Skip Nav
**filename**: skip-nav.js

Specific to the baltimorecoutymd.gov website.  Fallback script for our Skip Nav Link that is displayed on the screen using CSS.

##Text Resizer
**filename**: text-resizer.js

Tool used through the baltimorecoutymd.gov website.  Is located near the top of the screen on larger screen devices. Allows the user toincrease the size of the text on the site.