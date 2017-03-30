# JavaScript Utilities

## cdnFallback
Loads local version of a JS library when the CDN load fails.

### Example
```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
<script>baltimoreCounty.utility.cdnFallback.load(moment, '/wherever/moment.min.js', false);</script>
```

**filename**: cdnFallback.js 
### Dependencies
* [jQuery](https://jquery.com/)


## Inline Form Validation (for SE forms)
Adds inline validation to SiteExecutive forms.

**filename**: inline-form-validation.js  
**usage**: TBD    
### Dependencies
* [jQuery](https://jquery.com/)
* [Validate](https://validatejs.org/)

## Numeric String Tools
Collection of helper methods for working with numeric strings. For example, extracting the numbers from currency notation in order to sort.

### Dependencies
* Namespacer.js (see below)

## Namespacer
This is a shortcut function to safely create a namespace for you. 

### Example (before)
```Javascript
var baltimoreCounty = baltimoreCounty || {};
baltimoreCounty.modules = baltimoreCounty.modules || {};

baltimoreCounty.modules.myModule = (function() {
    // do something
})();
```

### Example (after)
```JavaScript
namespacer('baltimoreCounty.modules');

baltimoreCounty.modules.myModule = (function() {
    // do something
})();
```

**filename**: namespacer.js  
**usage**: homepage.min.js, template.min.js  
### Dependencies
* [jQuery](https://jquery.com/)

## Form Validation
Form field validation library.

**filename**: form-validation.js  
**usage**: template.min.js  
### Dependencies
* [jQuery](https://jquery.com/)

## cdnFallback
Loads local version of a JS library when the CDN load fails.

### Example
```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
<script>baltimoreCounty.utility.cdnFallback.load(moment, '/wherever/moment.min.js', false);</script>
```

**filename**: cdnFallback.js 
### Dependencies
* [jQuery](https://jquery.com/)