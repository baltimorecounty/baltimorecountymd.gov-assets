var clean = require('gulp-clean');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var stripCode = require('gulp-strip-code');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

var concatFiles = function concatFiles(files, name, dest) {
    var actualDest = dest || 'dist/js';

    return gulp
        .src(files)
        .pipe(concat(name))
        .pipe(gulp.dest(actualDest));
};

gulp.task('clean-dist', function cleanDist() {
    return gulp.src('dist').pipe(clean());
});

gulp.task('concatBaltCoGoAppJs', function concatBaltCoGoAppJs() {
    var files = [
        'js/page-specific/baltcogo-app/app.js',
        'js/page-specific/baltcogo-app/filters/**/*.js',
        'js/page-specific/baltcogo-app/constants/**/*.js',
        'js/page-specific/baltcogo-app/services/**/*.js',
        'js/page-specific/baltcogo-app/*Ctrl.js'
    ];
    return concatFiles(files, 'baltcogo-reporter.js');
});

gulp.task('concatHomepageJs', function concatHomepageJs() {
    var files = [
        'js/polyfills/*.js',
        'js/utility/cdnFallback.js',
        'js/utility/querystringer.js',
        'js/utility/jsonTools.js',
        'js/lib/jQuery.min.js',
        'js/lib/slick.min.js',
        'js/lib/handlebars.js',
        'js/lib/picturefill.min.js',
        'js/text-resizer.js',
        'js/flickr-feed.js',
        'js/county-news-snippet.js',
        'js/homepage-template.js',
        'js/template-events.js'
    ];
    return concatFiles(files, 'homepage.js');
});

gulp.task('createUtililtyScript', function createUtililtyScript() {
    var files = ['js/utility/*.js'];
    return concatFiles(files, 'bc-utilities.js');
});

gulp.task('createConstantsTemplate', function createConstantsTemplate() {
    var files = [
		'js/utility/namespacer.js',
		'js/constants.js'
	];
    return concatFiles(files, 'bc-constants.js');
});

gulp.task('concatTemplateJs', function concatTemplateJs() {
    var files = [
        'js/polyfills/*.js',
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
        'js/internal-carousel.js',
        'js/mobile-search.js',
        'js/template-events.js',
        'js/internal-template-events.js',
        'js/inside-template.js',
        'js/nifty-tables.js',
        'js/nifty-forms.js',
        'js/bc-content-filter.js',
        'js/accordion-menu.js',
        'js/youtube-playlist-gallery.js',
        'js/photo-gallery.js',
        'js/severe-weather-warning.js'
    ];

    return concatFiles(files, 'templateinside.js');
});

gulp.task('movePageSpecificJs', function movePageSpecificJs() {
    return gulp
        .src(['js/page-specific/*.js', 'js/page-specific/animal-services/*.js'])
        .pipe(gulp.dest('dist/js/page-specific'));
});

gulp.task('moveTemplates', function moveTemplates() {
    return gulp
        .src(['templates/*.js', 'templates/**/*.js'])
        .pipe(gulp.dest('dist/templates'));
});

gulp.task(
    'compressFiles',
    [
        'concatHomepageJs',
        'concatBaltCoGoAppJs',
        'concatTemplateJs',
        'movePageSpecificJs'
    ],
    function compressFiles() {
        return gulp
            .src(['!dist/js/**/*.min.js', 'dist/js/**/*.js'])
            .pipe(
                stripCode({
                    start_comment: 'test-code',
                    end_comment: 'end-test-code'
                })
            )
            .pipe(uglify())
            .on('error', function reportError(err) {
                util.log(util.colors.red('[Error]'), err.toString());
            })
            .pipe(
                rename({
                    suffix: '.min'
                })
            )
            .pipe(gulp.dest('dist/js'));
    }
);

gulp.task('compressPageSpecificFiles', function compressPageSpecificFiles() {
    return gulp
        .src(['!js/page-specific/*.spec.js', 'js/page-specific/*.js'])
        .pipe(
            stripCode({
                start_comment: 'test-code',
                end_comment: 'end-test-code'
            })
        )
        .pipe(uglify())
        .on('error', function reportError(err) {
            util.log(util.colors.red('[Error]'), err.toString());
        })
        .pipe(
            rename({
                suffix: '.min'
            })
        )
        .pipe(gulp.dest('dist/js/page-specific'));
});

gulp.task('sassAndCompressCss', function sassAndCompressCss() {
    return gulp
        .src([
            'stylesheets/*.scss',
            'stylesheets/partials/page-specific/**/*.scss',
            'stylesheets/partials/layouts/*.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(
            cssnano({
                autoprefixer: false
            })
        )
        .pipe(
            rename({
                suffix: '.min'
            })
        )
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function watch() {
    gulp.watch(['js/page-specific/*.js'], ['compressPageSpecificFiles']);
    gulp.watch(['js/*.js', 'js/lib/*.js'], ['compressFiles']);
    gulp.watch(['stylesheets/*.scss'], ['sassAndCompressCss']);
});

gulp.task('linter', function linter() {
    return gulp
        .src(['!js/lib/**/*', 'js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['clean-dist'], function defaultTask(callback) {
    return runSequence(
        [
            'compressPageSpecificFiles',
            'compressFiles',
            'sassAndCompressCss',
            'moveTemplates',
            'createUtililtyScript',
            'createConstantsTemplate'
        ],
        callback
    );
});
