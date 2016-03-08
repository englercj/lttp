'use strict';

const fs        = require('fs');
const path      = require('path');
const gulp      = require('gulp');
const runSequence = require('run-sequence');

// Load tasks
const taskBase  = path.join(__dirname, 'gulp', 'tasks');
fs.readdirSync(taskBase).forEach(function (file) {
    try { require(path.join(taskBase, file)); }
    catch (e) { console.error('Unable to require file "' + file + '":', e); }
});

// default task
gulp.task('default', function (done) {
    runSequence('clean', ['lint', 'build'], done);
});
