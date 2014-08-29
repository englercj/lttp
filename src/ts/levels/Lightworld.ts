/// <reference path="Level.ts" />

module Lttp.Levels {
    export class Lightworld extends Levels.Level {

        preload() {
            // Tilemap and assets
            this.load.pack('lightworld', 'assets/tilemap-assets.json');

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
