# baltimorecountymd.gov Assets
Assets used on the [Baltimore County Website](https://www.baltimorecountymd.gov/index.html)

## Building Files for Distribution

### Setup
You will need to do these steps the first time you setup the project.

### `npm install`

1. [Clone this repository](https://help.github.com/articles/working-with-repositories/)
2. Install [Node](https://nodejs.org/download/)
3. Install [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
4. Open terminal or command prompt to the root of your local repository
5. Run ``npm install`` to install all local dependencies.
6. Run ``npm install -g karma-cli`` to install the Karma command-line interface for running unit tests.
7. Run ``npm install phantomjs-prebuilt karma-phantomjs-launcher --save-dev`` to install the PhantomJS headless browser for unit testing.

## Build

### `gulp`

Builds the app for dev and or production to the `dist` folder. It does the following:

Note: When building for production ensure any constants files are pointing to production values.

1. Compile and minify all sass stylesheets to css and place them in the 'dist/css' folder
2. Create Homepage and Template js files into the 'dist/js' folder
3. Copy and minify Homepage and Template js files into the 'dist/js' folder
4. Copy and minify page-specific js files into the 'dist/js/page-specific' folder

*You may need to configure node for proxy, [here's](http://jjasonclark.com/how-to-setup-node-behind-web-proxy/) how.

### Run Unit Tests - Karma

1. Open terminal or command prompt to the root of your local repository
2. Run the ``karma start`` command

### Pushing Code To Dev/Test
1. Make changes to any files in js root or CSS root
2. Commit changes with comment specific to bug fix
3. Run Gulp
4. Copy files to Site Executive from your dist folder to corresponding files.
    i.e. Made Changes to BaltCoGoReporterCtrl.js => gulp => dist\baltcogp-reporter.js is copied over to SE
    i.e. Modified homepage.scss page => gulp => dit\homepage.min.css is copied over to SE
