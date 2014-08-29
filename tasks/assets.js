var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    jsonmin = require('gulp-jsonmin');

/*****
 * Assets Phaser packs task, creates phaser asset loader packs for tilemaps
 *****/
gulp.task('assets:generate-phaser-packs', function () {
    return gulp.src('./src/assets/**/*.json')
        .pipe(tilemapPack({ baseUrl: 'assets' }))
        .pipe(gulp.dest('./public/assets'));
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
            version: "1.0",
            app: "gulp-phaser-pack",
            url: "https://github.com/englercj/gulp-phaser-pack"
        }
    };

    return through.obj(function (file, encoding, cb) {
        if (file.isNull()) {
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-phaser-pack', 'Streaming not supported'));
            return cb();
        }

        try {
            var fname = path.basename(file.path),
                key = path.basename(file.path, path.extname(file.path));

            if (result[key]) {
                gutil.log('gulp-phaser-pack: Key already exists in asset pack:', key);
                return cb();
            }

            var fdata = JSON.parse(file.contents.toString()),
                assets = [];

            if (fdata && fdata.tilesets) {
                for(var i = 0; i < fdata.tilesets.length; ++i) {
                    assets.push({
                        type: 'image',
                        key: fdata.tilesets[i].name,
                        url: path.join(options.baseUrl, file.relative, fdata.tilesets[i].image).replace(/\\/g, '/'),
                        overwrite: false
                    });
                }

                assets.push({
                    type: 'tilemap',
                    key: 'tilemap_' + key,
                    url: path.join(options.baseUrl, file.relative, fname).replace(/\\/g, '/'),
                    format: 'TILED_JSON'
                });

                result[key] = assets;
            }
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-jsonmin', err));
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
