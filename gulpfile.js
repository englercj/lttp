var gulp = require('gulp'),
    http = require('http'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat-sourcemap'),
    ts     = require('gulp-type'),
    jshint = require('gulp-jshint'),
    less   = require('gulp-less'),
    uglify = require('gulp-uglify'),
    size   = require('gulp-size'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    banner = require('fs').readFileSync('./banner.txt', 'utf8'),
    pkg    = require('./package.json'),
    vendorFiles = [
        './bower_components/phaser-official/build/phaser.min.js'
    ];

/*****
 * JSHint task, lints the lib and test *.js files.
 *****/
gulp.task('jshint', function () {
    return gulp.src(['./src/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-summary'));
});

/*****
 * LESS CSS task, builds the main stylesheet.
 *****/
gulp.task('less', function () {
    return gulp.src(['./src/less/main.less'])
        .pipe(sourcemaps.init())
        .pipe(less({ compress: true }))
        .pipe(sourcemaps.write())
        .pipe(buffer())
        .pipe(size({ title: 'main.css' }))
        .pipe(gulp.dest('./public/css'));
});

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
        tsResult = gulp.src(['./src/ts/**/*.ts', './bower_components/phaser-official/build/phaser.d.ts'])
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

    return tsResult.js
        // output normal bundle
        .pipe(concat(fname))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(sourcemaps.write({ includeContent: false, sourceRoot: 'public' }))
        .pipe(size({ title: fname }))
        .pipe(gulp.dest(outputDir))

        // output production bundle
        .pipe(rename(fnameMin))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(size({ title: fnameMin }))
        .pipe(gulp.dest(outputDir));
});

/*****
 * Copy task, copies vendor files to public
 *****/
gulp.task('copy:index', function () {
    return gulp.src(['./index.html', './favicon.ico'])
        .pipe(gulp.dest('./public'));
});

gulp.task('copy:vendor', function () {
    return gulp.src(vendorFiles)
        .pipe(rename(function (path) {
            path.dirname = '';
        }))
        .pipe(gulp.dest('./public/vendor/'));
});

gulp.task('copy', ['copy:index', 'copy:vendor']);

/*****
 * Serve task, starts a static file server and serves the public folder
 *****/
function serve() {
    return connect.server({
        root: 'public',
        port: 8000
    });
}

gulp.task('serve', serve);

/*****
 * Dev task, incrementally rebuilds less and scripts for development
 *****/
gulp.task('dev', ['build'], function () {
    gulp.watch('./src/ts/**/*.ts', ['scripts']);
    gulp.watch('./src/less/**/*.less', ['less']);
    gulp.watch('./index.html', ['copy:index']);
    gulp.watch(vendorFiles, ['copy:vendor']);

    return serve();
});

/*****
 * Base tasks
 *****/
gulp.task('build', ['less', 'scripts', 'copy']);
gulp.task('default', ['build']);
