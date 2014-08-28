var gulp = require('gulp'),
    fs = require('fs'),
    config = require('./tasks/config.js');;

var files = fs.readdirSync('./tasks');

files.forEach(function (file) {
    try {
        require('./tasks/' + file);
    } catch(e) {
        console.error('Unable to require file "' + file + '":', e);
    }
});

/*****
 * Dev task, incrementally rebuilds less and scripts for development
 *****/
gulp.task('dev', ['build'], function () {
    gulp.watch('./src/ts/**/*.ts', ['scripts']);
    gulp.watch('./src/less/**/*.less', ['less']);
    gulp.watch('./index.html', ['copy:index']);
    gulp.watch(config.vendorFiles, ['copy:vendor']);

    return gulp.run('serve');
});

/*****
 * Base tasks
 *****/
gulp.task('build', ['less', 'scripts', 'copy']);
gulp.task('default', ['build']);
