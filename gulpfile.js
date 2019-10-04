'use strict' ;

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const connect = require('gulp-connect-php');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');

// Set the browser that you want to support
const autoprefixerBrowsers = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

gulp.task('sass', function() {
    return gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
    }))
    .pipe(autoprefixer({browsers: autoprefixerBrowsers}))
    // Minify the file
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

gulp.task('browserSync', function () {
    connect.server({}, function (){
        browserSync({
            proxy: '127.0.0.1:8000/',
            options: {
                reloadDelay: 250
            },
            notify: false
        });
    });
});

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('./scss/*.scss', ['sass']);
    gulp.watch('**/*.php').on('change', function () {
        browserSync.reload();
    });
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
    return gulp.src('./es6/*.js')
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./js'))
});

gulp.task('default', ['browserSync', 'sass','scripts', 'watch']);