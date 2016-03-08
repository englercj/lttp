'use strict';

const gulp      = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const buffer    = require('vinyl-buffer');
const size      = require('gulp-size');
const less      = require('gulp-less');
const config    = require('../config');

/*****
 * LESS CSS task, builds the main stylesheet.
 *****/
gulp.task('styles', function () {
    return gulp.src(config.paths.styles.entry)
        .pipe(sourcemaps.init())
        .pipe(less({ compress: true }))
        .pipe(sourcemaps.write())
        .pipe(buffer())
        .pipe(size({ title: config.paths.styles.outName }))
        .pipe(gulp.dest(config.paths.styles.out));
});
