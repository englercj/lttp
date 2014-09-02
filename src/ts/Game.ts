module Lttp {
    export class Game extends Phaser.Game {

        player: Entities.Player = null;

        onInputDown: Phaser.Signal = null;
        onInputUp: Phaser.Signal = null;

        static timer: Phaser.Timer = null;

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

            this.onInputDown = new Phaser.Signal();
            this.onInputUp = new Phaser.Signal();
            Game.timer = this.time.create(false);
        }

        create() {
            //  Enable p2 physics
            this.physics.startSystem(Phaser.Physics.P2JS);

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

            // add callbacks for keyboard/gamepad data
            this.input.keyboard.addCallbacks(this, this.onKeyboardDown, this.onKeyboardUp);
            this.input.gamepad.addCallbacks(this, {
                onDown: this.onGamepadDown,
                onUp: this.onGamepadUp,
                onAxis: this.onGamepadAxis
            });

            // start the static game timer
            Game.timer.start();
        }

        gamePaused(event: Object) {
            super.gamePaused(event);

            this.sound.pauseAll();
        }

        gameResumed(event: Object) {
            super.gameResumed(event);

            this.sound.resumeAll();
        }

        onKeyboardDown(event) {
            this.onInputDown.dispatch(event.keyCode, 1, event);
        }

        onKeyboardUp(event) {
            this.onInputUp.dispatch(event.keyCode, 1, event);
        }

        onGamepadDown(button: number, value: number, padIndex: number) {
            this.onInputDown.dispatch(button, value, event);
        }

        onGamepadUp(button: number, value: number, padIndex: number) {
            this.onInputUp.dispatch(button, value, event);
        }

        onGamepadAxis(axisState: GamepadAxisState, padIndex: number) {
            // if we pass the threshold send a "down" signal
            if (axisState.value > Data.Constants.INPUT_GAMEPAD_AXIS_THRESHOLD ||
                axisState.value < -Data.Constants.INPUT_GAMEPAD_AXIS_THRESHOLD
            ) {
                this.onInputDown.dispatch(axisState.axis, axisState.value, null);
            }
            // otherwise send an "up" signal
            else {
                this.onInputUp.dispatch(axisState.axis, axisState.value, null);
            }
        }

    }

    export interface GamepadAxisState {
        axis: number; //the axis index
        value: number; //the value of the axis
    }
}
