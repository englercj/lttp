/// <reference path="../states/State.ts" />

module Lttp.Levels {
    export class Level extends States.State {
        levelKey: string = '';

        private packData: any;

        preload() {
            // should be loaded by the preloader state
            this.packData = this.cache.getJSON(Data.Constants.ASSET_TILEMAP_PACKS_KEY);

            this.load.pack(this.levelKey, null, this.packData);
        }

        create() {
            super.create();

            this.addTilemap(this.levelKey);
        }

    }
}
