module Lttp.Levels {
    export class Darkworld extends Level {

        preload() {
            // Tilemap
            this.load.tilemap('level_darkworld', 'assets/worlds/darkworld/darkworld.json', null, Phaser.Tilemap.TILED_JSON);

            // Music
            this.load.audio('music_darkworld', [
                'assets/audio/music/dark_world.lite.ogg'
            ]);
        }

    }
}
