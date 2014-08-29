module Lttp.States {
    export class State extends Phaser.State {
        private packCache: { [key: string]: any } = {};
        private packCallbackRegistered: boolean = false;

        preload() {
            if (!this.packCallbackRegistered) {
                this.load.onPackComplete.add(this.onPackLoaded, this);
                this.packCallbackRegistered = true;
            }
        }

        onPackLoaded(key: string, success: boolean, totalLoaded: number, total: number) {
            this.packCache[key] = this.load._packList[this.load._packIndex];
        }

        addLevel(key?: string, tileWidth?: number, tileHeight?: number, width?: number, height?: number) {
            var level = this.add.tilemap.apply(this, arguments),
                pack = this.packCache[key.replace('tilemap_', '')];

            // add the tileset images
            for (var i = 0, il = pack && pack.length || 0; i < il; ++i) {
                if (pack[i].subtype === 'tileset') {
                    level.addTilesetImage(pack[i].key, pack[i].key);
                }
            }

            //create the layers
            var layer = level.createLayer('NAME');

            //resize world
            layer.resizeWorld();
        }
    }
}
