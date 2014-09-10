module Lttp {
    export class Game extends Phaser.Game {

        player: Entities.Player = null;

        static timer: Phaser.Timer = null;

        constructor() {
            // super(
            //     Data.Constants.GAME_WIDTH,
            //     Data.Constants.GAME_HEIGHT,
            //     Phaser.AUTO,// renderer
            //     'game',     // DOM parent ID
            //     null,       // default state obj
            //     false,      // transparent
            //     false,      // antialias
            //     { p2: true }// physics config
            // );

            //////////////////////////////////////////////////////
            //issue: https://code.google.com/p/chromium/issues/detail?id=134040
            // When that chrome bug that prevents CSS scaling from being NEAREST filtered is fixed, remove this
            // and uncomment above.
            super(
                Data.Constants.GAME_WIDTH * Data.Constants.GAME_SCALE,
                Data.Constants.GAME_HEIGHT * Data.Constants.GAME_SCALE,
                Phaser.AUTO,// renderer
                'game',     // DOM parent ID
                null,       // default state obj
                false,      // transparent
                false,      // antialias
                { p2: true }// physics config
            );
            //////////////////////////////////////////////////////

            this.addStates(States, 'state', ['State', 'MainMenuActiveMenu']);
            this.addStates(Levels, 'level', ['Level']);

            this.state.start('state_boot');
        }

        addStates(mod: any, type: string, blacklist: Array<string>) {
            for(var name in mod) {
                if (blacklist.indexOf(name) !== -1) continue;

                this.state.add(type + '_' + name.toLowerCase(), mod[name], false);
            }
        }

        boot() {
            super.boot();

            // // This sets the limits for Phaser's auto scaling
            // this.scale.minWidth = Data.Constants.GAME_WIDTH;
            // this.scale.minHeight = Data.Constants.GAME_HEIGHT;

            // this.scale.maxWidth = Data.Constants.GAME_WIDTH * Data.Constants.GAME_SCALE;
            // this.scale.maxHeight = Data.Constants.GAME_HEIGHT * Data.Constants.GAME_SCALE;

            // // Then we tell Phaser that we want it to scale between those values, the largest the browser can fit
            // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.setScreenSize();

            //////////////////////////////////////////////////////
            //issue: https://code.google.com/p/chromium/issues/detail?id=134040
            // When that chrome bug that prevents CSS scaling from being NEAREST filtered is fixed, remove this
            // and uncomment above.
            this.world.scale.set(Data.Constants.GAME_SCALE);
            //////////////////////////////////////////////////////

            //  Enable p2 physics
            // this.physics.startSystem(Phaser.Physics.P2JS);

            // capture keyboard keys
            this.input.keyboard.addKeyCapture([
                Phaser.Keyboard.SPACEBAR,
                Phaser.Keyboard.ENTER,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT
            ]);

            // start polling for gamepad input
            this.input.gamepad.start();

            this.add.plugin(Phaser.Plugin.Debug);
        }

        gamePaused(event: Object) {
            super.gamePaused(event);

            this.sound.pauseAll();
        }

        gameResumed(event: Object) {
            super.gameResumed(event);

            this.sound.resumeAll();
        }

    }
}
