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



## YouTube Playlist Gallery
Displays a video gallery of YouTube videos from an existing playlist. 

### Usage
Create a HTML Snippet with the following code, and you're ready to go. All you need to do is customize the playlistId value near the bottom.

```html
<div class="bc-youtube-playlist-gallery"></div>

<script id="youtube-playlist-item-template" type="text/x-handlebars-template">
	{{#each youtubeItemInfo}}
	<div class="youtube-playlist-item {{#if isHidden}}hidden{{/if}}">
		<figure>
			<a href="https://www.youtube.com/watch?v={{videoId}}" title="Video: {{videoTitle}}" data-fancybox-href="https://www.youtube.com/embed/{{videoId}}" data-fancybox-type="iframe" class="fancybox">
			<i class="fa fa-play-circle-o" aria-hidden="true"></i>
			<img src="{{thumbnailUrl}}" alt="{{videoTitle}}" /></a>
			<figcaption>
				<p><a href="https://www.youtube.com/watch?v={{videoId}}" title="Video: {{videoTitle}}" data-fancybox-href="https://www.youtube.com/embed/{{videoId}}" data-fancybox-type="iframe" class="fancybox">{{videoTitle}}</a></p>
			</figcaption>
		</figure>
	</div>
	{{/each}}
	<div style="clear: both"></div>
</script>	
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.6/handlebars.min.js"></script>	
<script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/helpers/jquery.fancybox-media.js"></script>
<script>
	$(document).ready(function() { 
		baltimoreCounty.youtubePlaylistGallery.init({
			target: '.bc-youtube-playlist-gallery',
			templateSelector: '#youtube-playlist-item-template',
			playlistId: 'PLYAZPzl77odrB8TBCEizC4ZvQ7NvgRoGf'
		});

		$('.fancybox').fancybox();
	});
</script>
```

**filename**: youtube-playlist-gallery.js    
**usage**: template.min.js
### Dependencies
* [jQuery](https://jquery.com/)
* [Handlebars](http://handlebarsjs.com/)
* [Fancybox](http://fancyapps.com/fancybox/)
* [Font Awesome](http://fontawesome.io/)

### Options

Option | Type | Default | Description | Required
------ | ---- | ------- | ----------- | --------
target|selector|.bc-youtube-playlist-gallery|Selector targeting the `<div>` in which to render the gallery.|No
playlistId|string|n/a|ID of the YouTube playlist to use for the gallery.|Yes
templateSelector|string|#youtube-playlist-item-template|ID of the Handlebars template.|No
showDescription|boolean|false|Indicates whether or not to display the video description.|No