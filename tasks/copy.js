var gulp = require('gulp'),
    rename = require('gulp-rename'),
    config = require('./config.js');

/*****
 * Copy task, copies vendor files to public
 *****/
gulp.task('copy:index', function () {
    return gulp.src(['./index.html', './favicon.ico'])
        .pipe(gulp.dest('./public'));
});

gulp.task('copy:vendor', function () {
    return gulp.src(config.vendorFiles)
        .pipe(rename(function (path) {
            path.dirname = '';
        }))
        .pipe(gulp.dest('./public/vendor/'));
});

gulp.task('copy', ['copy:index', 'copy:vendor']);
