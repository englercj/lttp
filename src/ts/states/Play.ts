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

            var menu = this.game.state.states.state_mainmenu;

            // load the save data into the player
            menu.saves[menu.selected].copyTo(this.game.player);

            // todo load active level from save file
            this.game.state.start('level_' + this.game.player.saveData.map);
        }

    }
}
