module Lttp.Levels {
    export class Cave034 extends Level {

        preload() {
            // Tilemap
            this.load.tilemap('level_cave_034', 'assets/worlds/cave_034/cave_034.json', null, Phaser.Tilemap.TILED_JSON);

            function noop() { };
        }

    }
}
