var gulp = require('gulp'),
    connect = require('gulp-connect');

/*****
 * Serve task, starts a static file server and serves the public folder
 *****/
gulp.task('serve', function () {
    return connect.server({
        root: 'public',
        port: 8000
    });
});
