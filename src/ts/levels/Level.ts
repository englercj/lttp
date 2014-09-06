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

            var player = (<Lttp.Game>this.game).player;

            this.game.physics.p2.world.gravity[0] = 0;
            this.game.physics.p2.world.gravity[1] = 0;

            // this.game.physics.startSystem(Phaser.Physics.P2JS);

            // // Enable physics for the player
            // this.game.physics.p2.enable(player, true);

            // // Modify a few body properties
            // player.body.setZeroDamping();
            // player.body.fixedRotation = true;

            this.game.physics.p2.addBody(player.body);

            this.game.add.existing(player);
            this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);

            this.onInputDown.add(player.onInputDown, player);
            this.onInputUp.add(player.onInputUp, player);
        }

    }
}
