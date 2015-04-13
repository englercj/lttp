/// <reference path="State.ts" />

module Lttp.States {
    export class Play extends State {

        preload() {
            super.preload();

            this.load.image('image_preloader', 'assets/ui/loader.png');
            this.load.atlas('sprite_rog_font', 'assets/sprites/fonts/retofganon.png', 'assets/sprites/fonts/retofganon.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        }

        create() {
            super.create();

            this.game.player = new Entities.Player(this.game);

            // load the save data into the player
            this.game.loadedSave.copyTo(this.game.player);

            // todo load active level from save file
            this.game.state.start('level_' + this.game.loadedSave.lastUsedExit.name);
        }

    }
}
