/// <reference path="Level.ts" />

module Lttp.Levels {
    export class LinksHouse extends Levels.Level {

        levelKey: string = 'linkshouse';

        preload() {
            super.preload();

            this.load.audio('music_village', [
                'assets/audio/music/kakariko_village.lite.ogg'
            ]);
        }

    }
}
