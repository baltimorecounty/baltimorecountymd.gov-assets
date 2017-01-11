var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	jshint = require('gulp-jshint'),
	cssnano = require('gulp-cssnano'),
	clean = require('gulp-clean'),
	runSequence = require('run-sequence');

var concatFiles = function(files, name, dest) {
	dest = dest || 'dist/js';

	return gulp.src(files)
	    .pipe(concat(name))
	    .pipe(gulp.dest(dest));
};

gulp.task('clean-dist', function() {
	gulp.src('dist')
		.pipe(clean());
});

gulp.task('concatHomepageJs', function() {
	var files = ['js/utility/namespacer.js', 
					'js/utility/cdnFallback.js',
					'js/lib/jQuery.min.js', 
					'js/lib/slick.min.js', 
					'js/lib/handlebars.js', 
					'js/lib/picturefill.min.js', 
					'js/flickr-feed.js', 
					'js/county-news-snippet.js',
					'js/homepage-template.js'];
	return concatFiles(files, 'homepage.js');
});

gulp.task('concatTemplateJs', function() {
	var files = ['js/polyfills/array.some.js',
					'js/utility/namespacer.js', 
					'js/utility/cdnFallback.js',
					'js/nifty-forms.js',
					'js/lib/bootstrap-collapse.js',
					'js/skip-nav.js',
					'js/text-resizer.js', 
					'js/bc-google-analytics.js', 
					'js/bc-google-analytics-custom-events.js', 
					'js/lib/review.js', 
					'js/mobile-search.js',
					'js/template-events.js', 
					'js/inside-template.js',
					'js/bc-content-filter.js', 
					'js/accordion-menu.js'];
  	return concatFiles(files, 'template.js');
});

gulp.task('concatFormsJs', function() {
	var files = ['js/lib/moment.min.js',
					'js/lib/validate.min.js',
					'js/inline-form-validation.js'];
	return concatFiles(files, 'forms.js');
});

gulp.task('compressFiles', ['concatHomepageJs', 'concatTemplateJs', 'concatFormsJs'], function() {
	return gulp.src(['dist/js/*.js'])
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('sassAndCompressCss', function () {
	return gulp.src('stylesheets/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
	gulp.watch(['js/*.js', 'js/lib/*.js', 'js/page-specific/*.js'], ['compressFiles']);
	gulp.watch(['stylesheets/*.scss'], ['sassAndCompressCss']);
});

gulp.task('linter', function() {
	return gulp.src(['!js/lib/**/*','js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('default', ['clean-dist'], function(callback) {
	return runSequence(['compressFiles', 'sassAndCompressCss'], callback);
});