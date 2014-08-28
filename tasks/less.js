var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    size   = require('gulp-size'),
    less   = require('gulp-less');

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
