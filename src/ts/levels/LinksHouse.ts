/// <reference path="Level.ts" />

module Lttp.Levels {
    export class LinksHouse extends Level {

        preload() {
            // Tilemap
            this.load.tilemap('level_linkshouse', 'assets/worlds/linkshouse/linkshouse.json', null, Phaser.Tilemap.TILED_JSON);

            this.load.audio('music_village', [
                'assets/audio/music/kakariko_village.lite.ogg'
            ]);
        }

    }
}
