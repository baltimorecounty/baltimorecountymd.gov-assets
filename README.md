# baltimorecountymd.gov Assets
Assets used on the [Baltimore County Website](https://www.baltimorecountymd.gov/index.html)

## Building Files for Distribution
### Setup
You will need to do these steps the first time you setup the project.

1. [Clone this repository](https://help.github.com/articles/working-with-repositories/)
2. Install [Node](https://nodejs.org/download/)
3. Install [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
4. Install [PhantomJS](http://phantomjs.org/)
4. Open terminal or command prompt to the root of your local repository
5. Run ``npm install`` to install all local dependencies.
6. Run ``npm install -g karma-cli`` to install the Karma command-line interface for running unit tests.

### Build
1. Open terminal or command prompt to the root of your local repository
2. Run the ``gulp`` command

**This process above will do the following.**

1. Compile and minfiy all sass stylesheets to css and place them in the 'dist/css' folder
2. Create Homepage and Template js files into the 'dist/js' folder
3. Copy and minfiy Homepage and Template js files into the 'dist/js' folder
4. Copy and minfiy page-specific js files into the 'dist/js/page-specific' folder

*You may need to configure node for proxy, [here's](http://jjasonclark.com/how-to-setup-node-behind-web-proxy/) how.

### Run Unit Tests

1. Open terminal or command prompt to the root of your local repository
2. Run the ``karma start`` command
