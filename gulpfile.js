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
gulp.task('dev', ['build', 'serve'], function () {
    gulp.watch('./index.html', ['copy:index']);
    gulp.watch('./src/ts/**/*.ts', ['scripts']);
    gulp.watch('./src/less/**/*.less', ['less']);
    gulp.watch('./src/assets/**/*.png', ['assets:imagemin']);
    gulp.watch('./src/assets/**/*.{json,tmx}', ['assets:tilemap-pack', 'assets:jsonmin', 'assets:copy']);
    gulp.watch(config.vendorFiles, ['copy:vendor']);
});

/*****
 * Base tasks
 *****/
gulp.task('build', ['less', 'scripts', 'copy', 'assets']);
gulp.task('default', ['build']);
