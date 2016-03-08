module Lttp.States {
    export interface GamepadAxisState {
        axis: number; //the axis index
        value: number; //the value of the axis
    }

    export class State extends Phaser.State {

        game: Game;

        onInputDown: Phaser.Signal;
        onInputUp: Phaser.Signal;

        constructor() {
            super();

            // create signals
            this.onInputDown = new Phaser.Signal();
            this.onInputUp = new Phaser.Signal();
        }

        create() {
            // add callbacks for keyboard/gamepad data
            this.input.keyboard.addCallbacks(this, this.onKeyboardDown, this.onKeyboardUp);
            this.input.gamepad.addCallbacks(this, {
                onDown: this.onGamepadDown,
                onUp: this.onGamepadUp,
                onAxis: this.onGamepadAxis
            });

            // destroy old timer
            if (Game.timer) {
                Game.timer.destroy();
            }

            // start the static game timer
            Game.timer = this.time.create(false);
            Game.timer.start();
        }

        shutdown() {
            this.onInputDown.removeAll();
            this.onInputUp.removeAll();
            this.sound.stopAll();
        }

        onKeyboardDown(event) {
            this.onInputDown.dispatch(event.keyCode, 1, event);
        }

        onKeyboardUp(event) {
            this.onInputUp.dispatch(event.keyCode, 1, event);
        }

        onGamepadDown(button: number, value: number) {
            this.onInputDown.dispatch(button, value, event);
        }

        onGamepadUp(button: number, value: number) {
            this.onInputUp.dispatch(button, value, event);
        }

        onGamepadAxis(pad: Phaser.SinglePad, index: number, value: number) {
            // if we pass the threshold send a "down" signal
            if (value > Data.Constants.INPUT_GAMEPAD_AXIS_THRESHOLD ||
                value < -Data.Constants.INPUT_GAMEPAD_AXIS_THRESHOLD
            ) {
                this.onInputDown.dispatch(index, value, null);
            }
            // otherwise send an "up" signal
            else {
                this.onInputUp.dispatch(index, value, null);
            }
        }

    }
}
