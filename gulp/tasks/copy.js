'use strict';

const gulp      = require('gulp');
const rename    = require('gulp-rename');
const config    = require('../config');

gulp.task('copy', [
    'copy:index',
    'copy:vendor'
]);

/*****
 * Copy index task, copies index and favicon to output
 *****/
gulp.task('copy:index', function () {
    return gulp.src([config.paths.assets.html, config.paths.assets.favicon])
        .pipe(gulp.dest(config.paths.out));
});

/*****
 * Copy vendor task, copies external vendor files to output
 *****/
gulp.task('copy:vendor', function () {
    return gulp.src(config.paths.vendor.js)
        .pipe(rename(function (path) {
            path.dirname = '';
        }))
        .pipe(gulp.dest(config.paths.vendor.out));
});
