// TODO: Can I generate the tilemap pack file and inject it into
// the webpack build somehow? That way it can use webpack for loading
// resources and the copy task can go away.

'use strict';

const gulp      = require('gulp');
const gutil     = require('gulp-util');
const tslint    = require('gulp-tslint');
const tiledPack = require('gulp-phaser-tiled-pack');
const del       = require('del');
const runSeq    = require('run-sequence');
const webpack   = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config.js');

const webpackDevConfig = Object.create(webpackConfig);
webpackDevConfig.devtool = 'source-map';
webpackDevConfig.debug = true;

const webpackDevServerConfig = Object.create(webpackConfig);
webpackDevServerConfig.devtool = 'eval';
webpackDevServerConfig.debug = true;

/**
 * default - Task to run when no task is specified.
 */
gulp.task('default', ['build']);

/**
 * build - Builds the bundle and processes resources.
 */
gulp.task('build', function (done) {
    runSeq('pre-build', ['webpack:build'], done);
});

/**
 * dev - Development build meant for rebuilding incrementally during development.
 */
gulp.task('dev', function (done) {
    runSeq('pre-build', ['watch', 'webpack:dev-server'], done);
});

/**
 * watch - WAtches for file changes to the asset pack.
 */
gulp.task('watch', function () {
    return gulp.watch('./assets/levels/**/*.json', ['tilemap:pack', 'copy']);
});

/**
 * clean - Cleans the output path.
 */
gulp.task('clean', function () {
    return del(webpackConfig.output.path);
});

/**
 * pre-build - Run a couple tasks before the build starts.
 */
gulp.task('pre-build', ['lint'], function (done) {
    runSeq('clean', ['tilemap:pack', 'copy'], done);
});

/**
 * lint - Runs a fine-toothed comb over the typescript to remove lint.
 */
gulp.task('lint', function () {
    return gulp.src(['./src/**/*.ts', './typings/**/*/.d.ts'])
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

/**
 * copy - Copy some necessary source files to the output.
 */
gulp.task('copy', function () {
    return gulp.src('./assets/levels/**')
        .pipe(gulp.dest(webpackConfig.output.path + '/assets/levels'));
});

/**
 * webpack:build - Builds the webpack bundle.
 */
gulp.task('webpack:build', function (done) {
    webpack(process.env.NODE_ENV === 'production' ? webpackConfig : webpackDevConfig, webpackCallback.bind(null, done));
});

/**
 * webpack:dev - Builds the webpack bundle, and starts a dev server.
 */
gulp.task('webpack:dev-server', function (done) {
    const port = process.env.PORT || 8000;

    new WebpackDevServer(webpack(webpackDevServerConfig), {
        contentBase: 'public/',
        stats: { colors: true }
    }).listen(port, 'localhost', function (err) {
        if (err)
            throw new gutil.PluginError("webpack-dev-server", err);

        // Server listening
        gutil.log('[webpack-dev-server]', `http://localhost:${port}/`);

        // keep the server alive or continue?
        // done();
    });
});

/**
 * tilemap:pack - Builds a phaser resource pack that represents the tilemaps.
 */
gulp.task('tilemap:pack', function () {
    return gulp.src('./assets/levels/**/*.json')
        .pipe(tiledPack({ baseUrl: 'assets/levels' }))
        .pipe(gulp.dest(webpackConfig.output.path + '/' + webpackConfig.output.assetPath));
});

// helper for when webpack completes
function webpackCallback(done, err, stats) {
    if (err)
        throw new gutil.PluginError('webpack', err);

    gutil.log('[webpack]', stats.toString({ colors: true }));

    done();
}
