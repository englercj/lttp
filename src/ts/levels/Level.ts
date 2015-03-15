/// <reference path="../states/State.ts" />

module Lttp.Levels {
    export class Level extends States.State {

        // key for the level data
        levelKey: string = '';

        // the reference to the tiled map
        tiledmap: any = null;

        // the data loaded for this level in its pack
        private packData: any;

        keymap: Data.Keymap = {
            keyboard: {
                up:         Phaser.Keyboard.W,
                down:       Phaser.Keyboard.S,
                left:       Phaser.Keyboard.A,
                right:      Phaser.Keyboard.D,

                use:        Phaser.Keyboard.E,
                useItem:    Phaser.Keyboard.V,
                attack:     Phaser.Keyboard.SPACEBAR,

                menuSave:   Phaser.Keyboard.B,
                menuMap:    Phaser.Keyboard.M,
                menuInv:    Phaser.Keyboard.I
            },
            gamepad: {
                up:         Phaser.Gamepad.XBOX360_DPAD_UP,
                down:       Phaser.Gamepad.XBOX360_DPAD_DOWN,
                left:       Phaser.Gamepad.XBOX360_DPAD_LEFT,
                right:      Phaser.Gamepad.XBOX360_DPAD_RIGHT,

                use:        Phaser.Gamepad.XBOX360_A,
                useItem:    Phaser.Gamepad.XBOX360_Y,
                attack:     Phaser.Gamepad.XBOX360_B,

                menuSave:   Phaser.Gamepad.XBOX360_BACK,
                menuMap:    Phaser.Gamepad.XBOX360_X,
                menuInv:    Phaser.Gamepad.XBOX360_START
            }
        };

        preload() {
            super.preload();

            // should be loaded by the preloader state
            this.packData = this.cache.getJSON(Data.Constants.ASSET_TILEMAP_PACKS_KEY);

            this.load.pack(this.levelKey, null, this.packData);
        }

        create() {
            super.create();

            this.tiledmap = this.add.tiledmap(this.levelKey);

            this.physics.p2.convertTiledmap(this.tiledmap, 'collisions');

            var self = this;
            this.tiledmap.getTilelayer('collisions').bodies.forEach(function (body) {
                body.debug = true;
                body.debugBody.draw();

                // body.setCollisionGroup(self.game.collisionGroups.ground);
                // body.collides(self.game.collisionGroups.all);
            });

            var player = this.game.player;

            this.game.physics.p2.world.gravity[0] = 0;
            this.game.physics.p2.world.gravity[1] = 0;

            this.game.player.reset(0, 0);
            this.game.player.setup(this);

            this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);

            this.game.add.existing(player);
        }

        /**
         * Input Handling
         */
        onKeyboardDown(event) {
            super.onKeyboardDown(event);

            this.handleKeyboard(event.keyCode, true);
        }

        onKeyboardUp(event) {
            super.onKeyboardUp(event);

            this.handleKeyboard(event.keyCode, false);
        }

        onGamepadDown(button: number, value: number) {
            super.onGamepadDown(button, value);

            this.handleGamepadButton(button, value, true);
        }

        onGamepadUp(button: number, value: number) {
            super.onGamepadUp(button, value);

            this.handleGamepadButton(button, value, false);
        }

        onGamepadAxis(pad: Phaser.SinglePad, index: number, value: number) {
            super.onGamepadAxis(pad, index, value);

            this.handleGamepadAxis(index, value, true);
        }

        handleGamepadAxis(index: number, value: number, active: boolean) {
            //TODO: stick handling
            // switch(index) {
            //     // AXIS UP/DOWN
            //     case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
            //         this.game.player.lookUp(value > 0 ? active : false);
            //         this.game.player.duck(value < 0 ? active : false);
            //         GarageServerIO.addInput({ name: 'lookUp', active: value > 0 ? active : false, value: value });
            //         GarageServerIO.addInput({ name: 'duck', active: value < 0 ? active : false, value: value });
            //         break;

            //     // AXIS LEFT/RIGHT
            //     case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
            //         this.game.player.move(Phaser.RIGHT, value, value > 0 ? active : false);
            //         this.game.player.move(Phaser.LEFT, -value, value < 0 ? active : false);
            //         GarageServerIO.addInput({ name: 'forward', active: value > 0 ? active : false, value: value });
            //         GarageServerIO.addInput({ name: 'backward', active: value < 0 ? active : false, value: -value });
            //         break;
            // }
        }

        handleKeyboard(key: number, active: boolean) {
            switch(key) {
                // use
                case this.keymap.keyboard.use:
                    this.game.player.use(active);
                    break;

                // use item
                case this.keymap.keyboard.useItem:
                    this.game.player.useItem(active);
                    break;

                // attack
                case this.keymap.keyboard.attack:
                    this.game.player.attack(active);
                    break;

                // UP
                case this.keymap.keyboard.up:
                    this.game.player.move(Phaser.UP, 1, active);
                    break;

                // DOWN
                case this.keymap.keyboard.down:
                    this.game.player.move(Phaser.DOWN, 1, active);
                    break;

                // LEFT
                case this.keymap.keyboard.left:
                    this.game.player.move(Phaser.LEFT, 1, active);
                    break;

                // RIGHT
                case this.keymap.keyboard.right:
                    this.game.player.move(Phaser.RIGHT, 1, active);
                    break;
            }
        }

        handleGamepadButton(button, value, active) {
            switch(button) {
                // UP
                case this.keymap.gamepad.up:
                    this.game.player.move(Phaser.UP, value, active);
                    break;

                // DOWN
                case this.keymap.gamepad.down:
                    this.game.player.move(Phaser.DOWN, value, active);
                    break;

                // LEFT
                case this.keymap.gamepad.left:
                    this.game.player.move(Phaser.LEFT, value, active);
                    break;

                // RIGHT
                case this.keymap.gamepad.right:
                    this.game.player.move(Phaser.RIGHT, value, active);
                    break;
            }
        }

    }

}

