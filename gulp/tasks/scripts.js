'use strict';

const gulp          = require('gulp');
const sourcemaps    = require('gulp-sourcemaps');
const concat        = require('gulp-concat');
const ts            = require('gulp-typescript');
const uglify        = require('gulp-uglify');
const size          = require('gulp-size');
const rename        = require('gulp-rename');
const config        = require('../config');

const tsProject = ts.createProject(config.typescript);

/*****
 * Scripts task, builds the typescript source into the output file.
 *****/
gulp.task('scripts', function () {
    return gulp.src([
            config.paths.scripts.source
        ].concat(config.paths.scripts.defs))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js

        // output normal bundle
        .pipe(concat(config.paths.scripts.outName))
        .pipe(sourcemaps.write())
        .pipe(size({ title: config.paths.scripts.outName }))
        .pipe(gulp.dest(config.paths.scripts.out))

        // output production bundle
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(size({ title: config.paths.scripts.outName + ' (minified)' }))
        .pipe(gulp.dest(config.paths.scripts.out));
});
