'use strict';

const gulp      = require('gulp');
const del       = require('del');
const config    = require('../config');

gulp.task('clean', function () {
    return del(config.paths.out);
});
