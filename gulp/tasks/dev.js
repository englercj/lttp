'use strict';

const gulp      = require('gulp');
const config    = require('../config');

/*****
 * Dev task, incrementally rebuilds less and scripts for development
 *****/
gulp.task('dev', ['build', 'serve'], function () {
    gulp.watch(config.html, ['copy:index']);
    gulp.watch(config.scripts, ['scripts']);
    gulp.watch(config.styles, ['less']);
    gulp.watch(config.assets.images, ['assets:imagemin']);
    gulp.watch(config.assets.levels, ['assets:tilemap-pack', 'assets:jsonmin', 'assets:copy']);
    gulp.watch(config.vendor.js, ['copy:vendor']);
});
