var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    addSrc = require('gulp-add-src'),
    ts     = require('gulp-typescript'),
    uglify = require('gulp-uglify'),
    size   = require('gulp-size'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    banner = require('fs').readFileSync('./banner.txt', 'utf8'),
    pkg    = require('../package.json');

/*****
 * Build task, creates the browser bundle.
 *****/
var tsProject = ts.createProject({
    target: 'es5',
    sortOutput: true,
    defaultLib: false,
    noExternalResolve: false
});

gulp.task('scripts', function () {
    var fname = 'lttp.js',
        fnameMin = 'lttp.min.js',
        outputDir = './public/js',
        tsResult = gulp.src([
                './src/ts/**/*.ts',
                './bower_components/phaser-official/build/phaser.d.ts'
            ])
            // .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

    return tsResult.js
        .pipe(addSrc.prepend([
            './node_modules/lz-string/libs/lz-string.js'
        ]))
        // output normal bundle
        .pipe(concat(fname))
        .pipe(header(banner, { pkg: pkg }))
        // .pipe(sourcemaps.write())
        .pipe(size({ title: fname }))
        .pipe(gulp.dest(outputDir))

        // output production bundle
        .pipe(rename(fnameMin))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(size({ title: fnameMin }))
        .pipe(gulp.dest(outputDir));
});
