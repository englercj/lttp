'use strict';

const gulp          = require('gulp');
const jscs          = require('gulp-jscs');
const eslint        = require('gulp-eslint');
const config        = require('../config');

gulp.task('lint', function () {
    return gulp.src(config.paths.scripts.source)
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(eslint())
        .pipe(eslint.format());
});
