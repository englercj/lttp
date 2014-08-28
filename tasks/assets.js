var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    jsonmin = require('gulp-jsonmin');

/*****
 * Assets Phaser packs task, creates phaser asset loader packs for tilemaps
 *****/
gulp.task('assets:generate-phaser-packs', function () {

});

/*****
 * Assets imagemin task, minifies the images and copies them to the public location
 *****/
gulp.task('assets:imagemin', function () {
    return gulp.src('./src/assets/**/*.png')
        .pipe(imagemin())
        .on('error', console.error)
        .pipe(gulp.dest('./public/assets'));
});

/*****
 * Assets jsonmin task, minifies the json files and copies them to the public location
 *****/
gulp.task('assets:jsonmin', function () {
    return gulp.src('./src/assets/**/*.json')
        .pipe(jsonmin())
        .pipe(gulp.dest('./public/assets'));
});

/*****
 * Assets copy task, copies any assets that we don't modify first
 *****/
gulp.task('assets:copy', function () {
    return gulp.src('./src/assets/**/*.{ogg}')
        .pipe(gulp.dest('./public/assets'));
});


gulp.task('assets', ['assets:generate-phaser-packs', 'assets:imagemin', 'assets:jsonmin', 'assets:copy']);
