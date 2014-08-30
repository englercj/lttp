module Lttp {
    export class Game extends Phaser.Game {

        constructor() {
            // super(Data.Constants.GAME_WIDTH, Data.Constants.GAME_HEIGHT, Phaser.AUTO, 'game');

            //////////////////////////////////////////////////////
            //issue: https://code.google.com/p/chromium/issues/detail?id=134040
            // When that chrome bug that prevents CSS scaling from being NEAREST filtered is fixed, remove this
            // and uncomment above.
            super(
                Data.Constants.GAME_WIDTH * Data.Constants.GAME_SCALE,
                Data.Constants.GAME_HEIGHT * Data.Constants.GAME_SCALE,
                Phaser.AUTO,
                'game'
            );

            PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
            //////////////////////////////////////////////////////

            this.state.add('Boot', States.Boot, false);
            this.state.add('Preloader', States.Preloader, false);
            this.state.add('Intro', States.Intro, false);
            this.state.add('MainMenu', States.MainMenu, false);
            this.state.add('Lightworld', Levels.Lightworld, false);

            this.state.start('Boot');
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

            this.input.keyboard.addKeyCapture([
                Phaser.Keyboard.SPACEBAR,
                Phaser.Keyboard.ENTER,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT
            ]);

            this.input.gamepad.start();
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
