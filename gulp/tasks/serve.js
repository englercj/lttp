'use strict';

const gulp      = require('gulp');
const webserver = require('gulp-webserver');
const config    = require('../config');

/*****
 * Serve task, starts a static file server and serves the public folder
 *****/
gulp.task('serve', function () {
    return gulp.src(config.paths.out)
        .pipe(webserver(config.webserver));
});
