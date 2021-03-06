module.exports = function exports(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine-jquery', 'jasmine'],


		// list of files / patterns to load in the browser
		files: [
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/frisby/src/frisby.js',
			'js/lib/require.js',
			'js/utility/namespacer.js',
			'js/utility/*.js',
			'js/polyfills/*.js',
			'spec/js/**/*.spec.js',
			{
				pattern: 'spec/js/fixtures/**/*.html',
				included: false,
				served: true
			}
		],


		// list of files to exclude
		exclude: [
		],

		plugins: [
			'karma-mocha-reporter',
			'karma-jasmine',
			'karma-jasmine-jquery-2',
			'karma-phantomjs-launcher'
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || 
		// config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
};
