# Javascript
This folder contains **global** Javascript files used on the Baltimore County Governement Website

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
```Javascript
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
