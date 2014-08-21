/// <reference path="Level.ts" />

module Lttp.Levels {
    export class Lightworld extends Level {

        preload() {
            // Tilemap
            this.load.tilemap('level_lightworld', 'assets/worlds/lightworld/lightworld.json', null, Phaser.Tilemap.TILED_JSON);

            // Overlay sprite atlases
            //this.load.atlas('sprite_overlay',       'assets/sprites/overlays/overlays.png',         'assets/sprites/overlays/overlays.json',        null, gf.ATLAS_FORMAT.JSON_HASH);

            // Music
            this.load.audio('music_lightworld', [
                'assets/audio/music/overworld.lite.ogg'
            ]);

            this.load.audio('music_village', [
                'assets/audio/music/kakariko_village.lite.ogg'
            ]);
        }

    }
}
