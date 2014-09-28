var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    jsonmin = require('gulp-jsonmin'),
    cached = require('gulp-cached');

/*****
 * Assets Phaser packs task, creates phaser asset loader packs for tilemaps
 *****/
gulp.task('assets:tilemap-pack', function () {
    return gulp.src('./src/assets/**/*.json')
        .pipe(tilemapPack({ baseUrl: 'assets' }))
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

// --------------------------

var through = require('through2'),
    gutil = require('gulp-util'),
    path = require('path'),
    File = require('vinyl');

function tilemapPack(options) {
    options = options || {};
    options.baseUrl = options.baseUrl || '';

    var result = {
        meta: {
            generated: Date.now().toString(),
            version: '1.0',
            app: 'gulp-tilemap-pack',
            url: 'https://github.com/englercj/gulp-tilemap-pack'
        }
    };

    return through.obj(function (file, encoding, cb) {
        if (file.isNull()) {
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-tilemap-pack', 'Streaming not supported'));
            return cb();
        }

        try {
            var fname = path.basename(file.path),
                relDir = file.relative.replace(fname, ''),
                key = path.basename(file.path, path.extname(file.path));

            if (result[key]) {
                gutil.log('gulp-tilemap-pack: Key already exists in asset pack:', key);
                return cb();
            }

            var fdata = JSON.parse(file.contents.toString()),
                assets = [];

            if (fdata && fdata.tilesets) {
                for(var i = 0; i < fdata.tilesets.length; ++i) {
                    assets.push({
                        type: 'image',
                        subtype: 'tileset',
                        key: key + '_tileset_' + fdata.tilesets[i].name,
                        name: fdata.tilesets[i].name,
                        url: path.join(options.baseUrl, relDir, fdata.tilesets[i].image).replace(/\\/g, '/'),
                        overwrite: false
                    });
                }

                assets.push({
                    type: 'tilemap',
                    key: 'tilemap_' + key,
                    url: path.join(options.baseUrl, file.relative).replace(/\\/g, '/'),
                    format: 'TILED_JSON'
                });

                result[key] = assets;
            }
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-tilemap-pack', err));
        }

        cb();
    }, function (cb) {
        this.push(new File({
            path: 'tilemap-assets.json',
            contents: new Buffer(JSON.stringify(result, null, 4))
        }));

        cb();
    });
}
