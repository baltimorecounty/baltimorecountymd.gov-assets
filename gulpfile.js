var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass');

var concatFiles = function(files, name, dest) {
	dest = dest || './dist/js';

	return gulp.src(files)
	    .pipe(concat(name))
	    .pipe(gulp.dest(dest));
};

gulp.task('concatHomepageJs', function() {
	var files = ['./js/lib/jQuery.min.js', 
					'./js/lib/slick.min.js', 
					'./js/lib/handlebars.js', 
					'./js/lib/picturefill.min.js', 
					'./js/flickr-feed.js', 
					'./js/county-news-snippet.js',
					'./js/homepage-template.js'];
	return concatFiles(files, 'homepage.js');
});

gulp.task('concatTemplateJs', function() {
	var files = ['./js/skip-nav.js',
					'./js/text-resizer.js', 
					'./js/bc-google-analytics.js', 
					'./js/bc-google-analytics-custom-events.js', 
					'./js/lib/review.js', 
					'./js/mobile-search.js',
					'./js/template-events.js', 
					'./js/inside-template.js'];
  	return concatFiles(files, 'template.js');
});

gulp.task('compressFiles', ['concatHomepageJs', 'concatTemplateJs'], function() {
		return gulp.src(['!./dist/js/*min.js', './dist/js/*.js'])
			.pipe(uglify())
			.pipe(rename({
	            suffix: '.min'
	        }))
		    .pipe(gulp.dest('./dist/js'));
});
gulp.task('sass', function () {
  gulp.src('./stylesheets/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
	gulp.watch(['js/*.js', 'js/lib/*.js', 'js/page-specific/*.js'], ['compressFiles']);
	gulp.watch(['./stylesheets/*.scss', './stylesheets/**/**/*.scss'], ['sass']);
});

gulp.task('default', ['compressFiles', 'sass'], function() {
	return;
});