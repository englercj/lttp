'use strict';

const env = process.env || 'dev';
const out = './public';

module.exports = {
    env: env,
    debug: env !== 'production',
    typescript: {
        target: 'ES5',
        sortOutput: true,
        defaultLib: false,
        noExternalResolve: true
    },
    webserver: {
        livereload: true,
        directoryListing: true,
        open: true,
        port: process.env.PORT || 8000
    },
    paths: {
        out: out,

        assets: {
            root: './assets',
            get html()      { return this.root + '/index.html'; },
            get favicon()   { return this.root + '/favicon.ico'; },
            get levels()    { return this.root + '/levels/**/*.{json,tmx}'; },
            get images()    { return this.root + '/**/*.png'; },
            get json()      { return this.root + '/**/*.json'; },
            get copy()      { return this.root + '/**/*.{ogg,jpg,tmx}'; },
            get out()       { return out + '/assets'; }
        },

        scripts: {
            root: 'src',
            outName: 'lttp.js',
            defs: [
                './node_modules/phaser/typescript/phaser.d.ts',
                './node_modules/phaser/typescript/p2.d.ts',
                './node_modules/phaser/typescript/pixi.d.ts',
                './node_modules/lz-string/typings/lz-string.d.ts'
            ],
            get source()    { return this.root + '/**/*.ts'; },
            get out()       { return out + '/js'; }
        },

        styles: {
            root: 'less',
            outName: 'main.css',
            get entry() { return this.root + '/main.less'; },
            get out()   { return out + '/css'; }
        },

        vendor: {
            js: [
                './node_modules/phaser/dist/phaser.js',
                './node_modules/phaser/dist/phaser.min.js',
                './node_modules/phaser/dist/phaser.map',
                './node_modules/phaser-debug/dist/phaser-debug.js',
                './node_modules/phaser-tiled/dist/phaser-tiled.js',
                './node_modules/lz-string/libs/lz-string.js'
            ],
            get out() { return out + '/vendor'; }
        }
    }
};
