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

            // create tiled map and setup physics for it
            this.tiledmap = this.add.tiledmap(this.levelKey);

            this.physics.p2.convertTiledmap(this.tiledmap, 'collisions');

            var self = this;
            this.tiledmap.getTilelayer('collisions').bodies.forEach(function (body) {
                body.debug = true;
                console.log(body);

                // body.setCollisionGroup(self.game.collisionGroups.ground);
                // body.collides(self.game.collisionGroups.all);
            });

            // setup the player for a new level
            var player = this.game.player;

            this.game.player.reset(2240, 2864);
            this.game.player.setup(this);

            this.tiledmap.getObjectlayer('player').add(player);

            // ensure gravity is off
            this.game.physics.p2.world.gravity[0] = 0;
            this.game.physics.p2.world.gravity[1] = 0;

            // setup camera to follow the player
            this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);

            // setup handlers for player sensor collisions
            this.game.physics.p2.onBeginContact.add(this.onBeginContact, this);
            this.game.physics.p2.onEndContact.add(this.onEndContact, this);

            //spawn exits & zones
            this.tiledmap.getObjectlayer('exits').spawn();
            this.tiledmap.getObjectlayer('zones').spawn();

            // this.firstZone = true;

            // this.lastExit = exit;

            // set link position
            // this.game.player.position.set(
            //     exit.properties.loc[0],
            //     exit.properties.loc[1]
            // );
        }

        onBeginContact(bodyA: Phaser.Physics.P2.Body, bodyB: Phaser.Physics.P2.Body, shapeA: p2.Shape, shapeB: p2.Shape, contactEquations) {
            this._checkContact('onBeginContact', bodyA, bodyB, shapeA, shapeB, contactEquations);
        }

        onEndContact(bodyA: Phaser.Physics.P2.Body, bodyB: Phaser.Physics.P2.Body, shapeA: p2.Shape, shapeB: p2.Shape, contactEquations) {
            this._checkContact('onEndContact', bodyA, bodyB, shapeA, shapeB, contactEquations);
        }

        private _checkContact(method: string, bodyA: Phaser.Physics.P2.Body, bodyB: Phaser.Physics.P2.Body, shapeA: p2.Shape, shapeB: p2.Shape, contactEquations) {
            if (bodyA.sprite !== this.game.player && bodyB.sprite !== this.game.player) {
                return;
            }

            var playerIsA = bodyA.sprite === this.game.player,
                playerBody = playerIsA ? bodyA : bodyB,
                playerShape = playerIsA ? shapeA : shapeB,
                objBody = playerIsA ? bodyB : bodyA,
                objShape = playerIsA ? shapeB : shapeA,
                obj = objBody.sprite;

            console.log(contactEquations);

            // colliding with a new zone
            if(obj.objectType === 'zone') {
                // this.emit('zone', obj, vec);
                console.log(obj);
            }
            // collide with an exit
            else if(obj.objectType === 'exit') {
                // this.emit('exit', obj, vec);
                console.log(obj);
            }
            else {
                this.game.player[method](obj, objShape, playerShape);
            }
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

