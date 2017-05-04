var clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	cssnano = require('gulp-cssnano'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	runSequence = require('run-sequence'),
	sass = require('gulp-sass'),
	stripCode = require('gulp-strip-code'),
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
	var files = ['js/polyfills/*.js',
					'js/utility/namespacer.js', 
					'js/utility/cdnFallback.js',
					'js/utility/querystringer.js',
					'js/utility/jsonTools.js',
					'js/lib/jQuery.min.js', 
					'js/lib/slick.min.js', 
					'js/lib/handlebars.js', 
					'js/lib/picturefill.min.js', 
					'js/flickr-feed.js', 
					'js/county-news-snippet.js',
					'js/homepage-template.js'];
	return concatFiles(files, 'homepage.js');
});

gulp.task('concatTemplateJs', function () {
	var files = ['js/polyfills/*.js',
					'js/utility/namespacer.js', 
					'js/utility/*.js',
					'js/lib/bootstrap-collapse.js',
					'js/lib/handlebars.js', 
					'js/skip-nav.js',
					'js/text-resizer.js', 
					'js/bc-google-analytics.js', 
					'js/bc-google-analytics-custom-events.js', 
					'js/lib/slick.min.js', 
					'js/lib/review.js', 
					'js/mobile-search.js',
					'js/template-events.js', 
					'js/inside-template.js',
					'js/nifty-tables.js',
					'js/nifty-forms.js', 
					'js/bc-content-filter.js', 
					'js/accordion-menu.js',
					'js/youtube-playlist-gallery.js',
					'js/photo-gallery.js'];
  	return concatFiles(files, 'templateinside.js');
});

gulp.task('movePageSpecificJs', function() {
	return gulp.src('js/page-specific/*.js')
		.pipe(gulp.dest('dist/js/page-specific'));
});

gulp.task('compressFiles', ['concatHomepageJs', 'concatTemplateJs', 'movePageSpecificJs'], function() {
	return gulp.src(['!dist/js/**/*.min.js', 'dist/js/**/*.js'])
		.pipe(stripCode({
			start_comment: 'test-code',
			end_comment: 'end-test-code'			
		}))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('compressPageSpecificFiles', function () {
	return gulp.src(['!js/page-specific/*.spec.js', 'js/page-specific/*.js'])
		.pipe(stripCode({
			start_comment: 'test-code',
			end_comment: 'end-test-code'
		}))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/js/page-specific'));
});

gulp.task('sassAndCompressCss', function () {
	return gulp.src(['stylesheets/*.scss', 'stylesheets/partials/page-specific/**/*.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(cssnano({
			autoprefixer: false
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('linter', function() {
	return gulp.src(['js/**/*.js', '!js/lib/*'])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
	gulp.watch(['js/page-specific/*.js'], ['compressPageSpecificFiles']);
	gulp.watch(['js/*.js', 'js/lib/*.js'], ['compressFiles']);
	gulp.watch(['stylesheets/*.scss'], ['sassAndCompressCss']);

});

gulp.task('linter', function() {
	return gulp.src(['!js/lib/**/*','js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['clean-dist'], function(callback) {
	return runSequence(['compressPageSpecificFiles', 'compressFiles', 'sassAndCompressCss'], callback);
});
