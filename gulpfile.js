var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano')
	clean = require('gulp-clean');

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

gulp.task('concatHomepageJs', ['clean-dist'], function() {
	var files = ['js/lib/require.js',
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
	var files = ['js/lib/require.js',
					'js/polyfills/array.some.js',
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
					'js/accordion-menu.js'];
  	return concatFiles(files, 'template.js');
});

gulp.task('compressFiles', ['concatHomepageJs', 'concatTemplateJs'], function() {
		return gulp.src(['!dist/js/*min.js', 'dist/js/*.js'])
			.pipe(uglify())
			.pipe(rename({
	            suffix: '.min'
	        }))
		    .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', ['clean-dist'], function() {
  return gulp.src('stylesheets/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('compressCss', ['sass'], function () {
  return gulp.src('dist/css/homepage.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
	gulp.watch(['js/*.js', 'js/lib/*.js', 'js/page-specific/*.js'], ['compressFiles']);
	gulp.watch(['stylesheets/*.scss', 'stylesheets/**/**/*.scss'], ['sass']);
});

gulp.task('default', ['compressFiles', 'compressCss'], function() {
	return;
});