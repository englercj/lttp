'use strict';

const gulp      = require('gulp');
const tiledPack = require('gulp-phaser-tiled-pack');
const imagemin  = require('gulp-imagemin');
const jsonmin   = require('gulp-jsonmin');
const cached    = require('gulp-cached');
const config    = require('../config');

gulp.task('assets', [
    'assets:tilemap-pack',
    'assets:imagemin',
    'assets:jsonmin',
    'assets:copy'
]);

/*****
 * Assets Phaser packs task, creates phaser asset loader packs for tilemaps
 *****/
gulp.task('assets:tilemap-pack', function () {
    return gulp.src(config.paths.assets.levels)
        .pipe(tiledPack({ baseUrl: 'assets/levels' }))
        .pipe(gulp.dest(config.paths.assets.out));
});

/*****
 * Assets imagemin task, minifies the images and copies them to the public location
 *****/
gulp.task('assets:imagemin', function () {
    return gulp.src(config.paths.assets.images)
        .pipe(cached('imagemin'))
        // TODO: Uncomment when ready for minified images
        // .pipe(imagemin()).on('error', console.error)
        .pipe(gulp.dest(config.paths.assets.out));
});

/*****
 * Assets jsonmin task, minifies the json files and copies them to the public location
 *****/
gulp.task('assets:jsonmin', function () {
    return gulp.src(config.paths.assets.json)
        .pipe(cached('jsonmin'))
        .pipe(jsonmin())
        .pipe(gulp.dest(config.paths.assets.out));
});

/*****
 * Assets copy task, copies any assets that we don't modify first
 *****/
gulp.task('assets:copy', function () {
    return gulp.src(config.paths.assets.copy)
        .pipe(gulp.dest(config.paths.assets.out));
});
