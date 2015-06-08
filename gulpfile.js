var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

var concatFiles = function(files, name, dest) {
	dest = dest || './dist/';

	return gulp.src(files)
	    .pipe(concat(name))
	    .pipe(gulp.dest(dest));
};

gulp.task('concatHomepageJs', function() {
	var files = ['./js/lib/jQuery.min.js', './js/lib/slick.min.js', './js/lib/handlebars.js', './js/lib/picturefill.min.js', './js/flickr-feed.js', './js/county-news-snippet.js', './js/homepage-template.js'];
	return concatFiles(files, 'homepage.js');
});

gulp.task('concatTemplateJs', function() {
	var files = ['./js/skip-nav.js','./js/text-resizer.js', './js/bc-google-analytics.js', './js/bc-google-analytics-custom-events.js', './js/lib/review.js'];
  	return concatFiles(files, 'template.js');
});

gulp.task('compressFiles', ['concatHomepageJs', 'concatTemplateJs'], function() {
  return gulp.src('dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compressFiles'], function() {
	var homepage =  gulp.src("dist/homepage.js")
		.pipe(rename("homepage.min.js"))
		.pipe(gulp.dest("./dist")); 

	var template = gulp.src("dist/template.js")
		.pipe(rename("template.min.js"))
		.pipe(gulp.dest("./dist"));

		return;
});