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

            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;

            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            // this.stage.disableVisibilityChange = true;

            this.game.state.start('Preloader', true, false);
        }

    }
}
