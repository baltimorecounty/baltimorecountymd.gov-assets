var clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	cssnano = require('gulp-cssnano'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	runSequence = require('run-sequence'),
	sass = require('gulp-sass'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify');

var concatFiles = function(files, name, dest) {
	dest = dest || 'dist/js';

	return gulp.src(files)
	    .pipe(concat(name))
	    .pipe(gulp.dest(dest));
};

gulp.task('clean-dist', function() {
	return gulp.src('dist')
		.pipe(clean());
});

gulp.task('concatHomepageJs', function() {
	var files = ['js/lib/jQuery.min.js', 
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
					'js/skip-nav.js',
					'js/lib/bootstrap-collapse.js',
					'js/text-resizer.js', 
					'js/bc-google-analytics.js', 
					'js/bc-google-analytics-custom-events.js', 
					'js/lib/review.js', 
					'js/mobile-search.js',
					'js/template-events.js', 
					'js/inside-template.js',
					'js/bc-content-filter.js', 
					'js/accordion-menu.js',
					'js/youtube-playlist-gallery.js'];
  	return concatFiles(files, 'insidetemplate.js');
});

gulp.task('compressFiles', ['concatHomepageJs', 'concatTemplateJs'], function() {
		return gulp.src(['!dist/js/*min.js', 'dist/js/*.js'])
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

gulp.task('linter', function() {
	return gulp.src(['js/**/*.js', '!js/lib/*'])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
	gulp.watch(['js/*.js', 'js/lib/*.js', 'js/page-specific/*.js'], ['compressFiles']);
	gulp.watch(['stylesheets/*.scss', 'stylesheets/**/**/*.scss'], ['sass']);
});

gulp.task('default', ['clean-dist'], function(callback) {
	runSequence(['compressFiles', 'sassAndCompressCss'], callback)
});