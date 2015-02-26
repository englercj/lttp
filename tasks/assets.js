var gulp = require('gulp'),
    tiledPack = require('gulp-phaser-tiled-pack'),
    imagemin = require('gulp-imagemin'),
    jsonmin = require('gulp-jsonmin'),
    cached = require('gulp-cached');

/*****
 * Assets Phaser packs task, creates phaser asset loader packs for tilemaps
 *****/
gulp.task('assets:tilemap-pack', function () {
    return gulp.src('./src/assets/levels/**/*.json')
        .pipe(tiledPack({ baseUrl: 'assets/levels' }))
        .pipe(gulp.dest('./public/assets'));
});

/*****
 * Assets imagemin task, minifies the images and copies them to the public location
 *****/
gulp.task('assets:imagemin', function () {
    return gulp.src('./src/assets/**/*.png')
        .pipe(cached('imagemin'))
        .pipe(imagemin()).on('error', console.error)
        .pipe(gulp.dest('./public/assets'));
});

/*****
 * Assets jsonmin task, minifies the json files and copies them to the public location
 *****/
gulp.task('assets:jsonmin', function () {
    return gulp.src('./src/assets/**/*.json')
        .pipe(cached('jsonmin'))
        .pipe(jsonmin())
        .pipe(gulp.dest('./public/assets'));
});

/*****
 * Assets copy task, copies any assets that we don't modify first
 *****/
gulp.task('assets:copy', function () {
    return gulp.src('./src/assets/**/*.{ogg,jpg}')
        .pipe(gulp.dest('./public/assets'));
});

gulp.task('assets', ['assets:tilemap-pack', 'assets:imagemin', 'assets:jsonmin', 'assets:copy']);
