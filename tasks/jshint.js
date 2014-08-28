var gulp = require('gulp'),
    jshint = require('gulp-jshint');

/*****
 * JSHint task, lints the lib and test *.js files.
 *****/
gulp.task('jshint', function () {
    return gulp.src(['./src/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-summary'));
});
