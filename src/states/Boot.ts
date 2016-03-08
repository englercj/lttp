/// <reference path="State.ts" />

module Lttp.States {
    export class Boot extends State {

        preload() {
            super.preload();

            this.load.image('image_preloader', 'assets/ui/loader.png');
            this.load.atlas('sprite_rog_font', 'assets/sprites/fonts/retofganon.png', 'assets/sprites/fonts/retofganon.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        }

        create() {
            super.create();

            // don't specifically need multitouch, so turn it off.
            this.input.maxPointers = 1;

            this.game.state.start('state_preloader');
        }

    }
}
