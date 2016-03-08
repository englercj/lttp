/// <reference path="Level.ts" />

module Lttp.Levels {
    export class Darkworld extends Levels.Level {

        levelKey: string = 'darkworld';

        preload() {
            super.preload();

            // Music
            this.load.audio('music_darkworld', [
                'assets/audio/music/dark_world.lite.ogg'
            ]);
        }

    }
}
