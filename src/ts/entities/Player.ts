/// <reference path="Entity.ts" />

module Lttp.Entities {
    export class Player extends Entities.Entity {
        //player type
        entityType = Data.ENTITY_TYPE.PLAYER;

        //maximum maxMagic of this entity
        maxMagic: number;

        //current magic of this entity
        magic: number

        //objects currently within attack range
        inAttackRange: Entities.Entity[];
        colliding: Entities.Entity[];

        //a pool of sprite to do smashing animations
        smashPool;

        //a pool of world items to be dropped
        itemPool;

        //a pool of particles to throw around
        particlePool;

        liftSound: Phaser.Sound;
        throwSound: Phaser.Sound;
        openChestSound: Phaser.Sound;
        itemFanfaireSound: Phaser.Sound;
        errorSound: Phaser.Sound;
        fallSound: Phaser.Sound;

        equipted: Data.ItemDescriptor;

        lastDirection: string;

        inventory: PlayerInventory;

        carrying: Phaser.Sprite;

        attacking: boolean;
        chargingAttack: boolean;

        private _coneVec: Phaser.Point;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, 'sprite_link');

            this.name = 'link';
            this.moveSpeed = 87;

            this.maxMagic = 10;
            this.magic = 0;

            this.inAttackRange = [];
            this.colliding = [];

            this.smashPool = new Utility.Pool<Entities.Misc.Smash>(game, Entities.Misc.Smash);
            this.itemPool = new Utility.Pool<Entities.Items.WorldItem>(game, Entities.Items.WorldItem);
            this.particlePool = new Utility.Pool<Entities.Misc.Particle>(game, Entities.Misc.Particle);

            this.liftSound = game.add.sound('effect_lift', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.throwSound = game.add.sound('effect_throw', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.openChestSound = game.add.sound('effect_chest', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.itemFanfaireSound = game.add.sound('effect_item_fanfaire', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.errorSound = game.add.sound('effect_error', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.fallSound = game.add.sound('effect_fall', Data.Constants.AUDIO_EFFECT_VOLUME);

            this.equipted = null;

            this.lastDirection = 'down';

            this.inventory = new PlayerInventory();

            this.carrying = null;

            this.attacking = false;
            this.chargingAttack = false;

            this._coneVec = new Phaser.Point();

            this.anchor.set(0.5);

            // this.on('physUpdate', this._physUpdate.bind(this));

            this.addAnimations();
        }

        addAnimations() {
            //add walking animations
            this._addDirectionalPrefixedFrames('walk', 8, 24, true);

            //add idle shield animations
            this.animations.add('idle_shield_left', ['walk_shield_left/walk_shield_left_1.png']);
            this.animations.add('idle_shield_right', ['walk_shield_right/walk_shield_right_1.png']);
            this.animations.add('idle_shield_down', ['walk_shield_down/walk_shield_down_1.png']);
            this.animations.add('idle_shield_up', ['walk_shield_up/walk_shield_up_1.png']);

            this.animations.add('idle_left', ['walk_left/walk_left_1.png']);
            this.animations.add('idle_right', ['walk_right/walk_right_1.png']);
            this.animations.add('idle_down', ['walk_down/walk_down_1.png']);
            this.animations.add('idle_up', ['walk_up/walk_up_1.png']);

            this.animations.add('lift_idle_left', ['lift_walk_left/lift_walk_left_1.png']);
            this.animations.add('lift_idle_right', ['lift_walk_right/lift_walk_right_1.png']);
            this.animations.add('lift_idle_down', ['lift_walk_down/lift_walk_down_1.png']);
            this.animations.add('lift_idle_up', ['lift_walk_up/lift_walk_up_1.png']);

            //add attack animations
            this._addDirectionalPrefixedFrames('attack', 9, 36);

            //add bow attack animations
            this._addDirectionalPrefixedFrames('attack_bow', 3, 24);

            //add spin attack animations
            this._addDirectionalPrefixedFrames('attack_spin', 12, 24);

            //add attack tap animations
            this._addDirectionalPrefixedFrames('attack_tap', 3, 24);

            //add fall in hole animations
            this._addFrames(['fall_in_hole/fall_in_hole'], 4, 3);

            //add lifting animations
            this._addDirectionalPrefixedFrames('lift', 4, 12);

            //add lifting walking animations
            this.animations.add('lift_walk_left', [
                'lift_walk_left/lift_walk_left_1.png',
                'lift_walk_left/lift_walk_left_2.png',
                'lift_walk_left/lift_walk_left_3.png',
                'lift_walk_left/lift_walk_left_2.png'
            ], 12, true);

            this.animations.add('lift_walk_right', [
                'lift_walk_right/lift_walk_right_1.png',
                'lift_walk_right/lift_walk_right_2.png',
                'lift_walk_right/lift_walk_right_3.png',
                'lift_walk_right/lift_walk_right_2.png'
            ], 12, true);

            //this._addFrames(['lift_walk_left', 'lift_walk_right'], 3, 0.2, true);
            this._addFrames(['lift_walk_down/lift_walk_down', 'lift_walk_up/lift_walk_up'], 6, 15, true);

            //add pulling animations
            this._addDirectionalPrefixedFrames('push', 5, 6, true);

            //add walking-attacking animations
            this._addFrames(['walk_attack_left/walk_attack_left', 'walk_attack_right/walk_attack_right'], 3, 24, true);
            this._addFrames(['walk_attack_down/walk_attack_down', 'walk_attack_up/walk_attack_up'], 6, 24, true);

            //add walking with shield animations
            this._addDirectionalPrefixedFrames('walk_shield', 8, 24, true);

            //set active
            this.lastDirection = 'down';

            this._setMoveAnimation();

            (<Lttp.Game>this.game).onInputDown.add(this._onInputDown, this);
            (<Lttp.Game>this.game).onInputUp.add(this._onInputUp, this);
        }

        destroy(destroyChildren?: boolean) {
            (<Lttp.Game>this.game).onInputDown.removeAll(this);
            (<Lttp.Game>this.game).onInputUp.removeAll(this);

            super.destroy(destroyChildren);
        }

        unlock() {
            this._setMoveAnimation();

            super.unlock();
        }

        private _addDirectionalPrefixedFrames(type: string, num: number, frameRate: number = 60, loop: boolean = false) {
            this._addDirectionalFrames(type + '_%s/' + type + '_%s', num, frameRate, loop);
        }

        /*******************************
         * Input private methods
         *******************************/

        private _onInputDown(key: number, value: number) {
            switch(key) {
                case Phaser.Keyboard.E:
                case Phaser.Gamepad.XBOX360_A:
                    this._checkUse(key, true, value);
                    break;

                case Phaser.Keyboard.V:
                case Phaser.Gamepad.XBOX360_Y:
                    this._checkUseItem(key, true, value);
                    break;

                case Phaser.Keyboard.SPACEBAR:
                case Phaser.Gamepad.XBOX360_A:
                    this._checkAttack(key, true, value);
                    break;

                default:
                    this._checkMovement(key, true, value);
                    break;
            }
        }

        private _onInputUp(key: number) {
            switch(key) {
                case Phaser.Keyboard.E:
                case Phaser.Gamepad.XBOX360_A:
                    this._checkUse(key, false, 0);
                    break;

                case Phaser.Keyboard.V:
                case Phaser.Gamepad.XBOX360_Y:
                    this._checkUseItem(key, false, 0);
                    break;

                case Phaser.Keyboard.SPACEBAR:
                case Phaser.Gamepad.XBOX360_B:
                    this._checkAttack(key, false, 0);
                    break;

                default:
                    this._checkMovement(key, false, 0);
                    break;
            }
        }

        /*******************************
         * Move private methods
         *******************************/

        private _checkMovement(key: number, active: boolean, value: number) {
            switch(key) {
                // UP
                case Phaser.Keyboard.UP:
                case Phaser.Keyboard.W:
                case Phaser.Gamepad.XBOX360_DPAD_UP:
                    this.moveState.up = active;
                    break;

                // DOWN
                case Phaser.Keyboard.DOWN:
                case Phaser.Keyboard.S:
                case Phaser.Gamepad.XBOX360_DPAD_DOWN:
                    this.moveState.down = active;
                    break;

                // LEFT
                case Phaser.Keyboard.LEFT:
                case Phaser.Keyboard.A:
                case Phaser.Gamepad.XBOX360_DPAD_LEFT:
                    this.moveState.left = active;
                    break;

                // RIGHT
                case Phaser.Keyboard.RIGHT:
                case Phaser.Keyboard.D:
                case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
                    this.moveState.right = active;
                    break;

                // AXIS UP/DOWN
                case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
                    this.moveState.up = (value > 0) ? active : false;
                    this.moveState.down = (value < 0) ? active : false;
                    break;

                // AXIS LEFT/RIGHT
                case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
                    this.moveState.left = (value < 0) ? active : false;
                    this.moveState.right = (value > 0) ? active : false;
                    break;

                // Non-movement input, ignore
                default:
                    return;
            }

            // movement is done with boolean states that are then checked ensures that pressing
            // multiple keys at once and releasing only one of them works properly.
            if(this.moveState.left && this.moveState.right) {
                this.movement.x = 0;
            }
            else if(this.moveState.left) {
                this.movement.x = -this.moveSpeed;
            }
            else if(this.moveState.right) {
                this.movement.x = this.moveSpeed;
            }
            else {
                this.movement.x = 0;
            }

            // do the same checks as above but for the Y axis
            if(this.moveState.up && this.moveState.down) {
                this.movement.y = 0;
            }
            else if(this.moveState.up) {
                this.movement.y = -this.moveSpeed;
            }
            else if(this.moveState.down) {
                this.movement.y = this.moveSpeed;
            }
            else {
                this.movement.y = 0;
            }

            // if the entity is locked, then just return
            if(this.locked) return;

            this._setMoveAnimation();
            this.setVelocity(this.movement);
        }

        private _setMoveAnimation(force: boolean = false) {
            var anim = force || ((this.movement.x || this.movement.y) ? 'walk' : 'idle');
            //clearTimeout(this._toBlockedAnim);

            if (this.carrying) {
                this._setMoveDirAnimation('lift_' + anim)
            }
            else if (this.inventory.shield) {
                this._setMoveDirAnimation(anim + '_shield');
            }
            else {
                this._setMoveDirAnimation(anim);
            }
        }

        private _setMoveDirAnimation(anim) {
            if (this.movement.isZero()) {
                this.animations.stop(anim + '_' + this.lastDirection, true);
            }
            else {
                if (this.movement.x) {
                    this.lastDirection = this.movement.x > 0 ? 'right' : 'left';
                }

                if (this.movement.y) {
                    this.lastDirection = this.movement.y > 0 ? 'down' : 'up';
                }

                this.animations.play(anim + '_' + this.lastDirection);
            }
        }

        /*******************************
         * Attack private methods
         *******************************/

        private _checkAttack(key: number, active: boolean, value: number) {
            if (!this.inventory.sword || this.carrying) {
                return;
            }

            if (!active) {
                this.chargingAttack = false;
                return;
            }

            if (this.locked || this.chargingAttack) {
                return;
            }

            this.lock();
            this.attacking = true;
            this.chargingAttack = true;

            this.animations.play('attack_' + this.lastDirection);

            for(var i = this.inAttackRange.length - 1; i > -1; --i) {
                var ent = this.inAttackRange[i];

                if(this._inCone(ent, Data.Constants.PLAYER_ATTACK_CONE)) {
                    ent.damage(this.attackDamage);
                    // if(ent.damage(this.attackDamage)) {
                    //     e.takeDamage(this.damage)
                    // } else if(t.match(/grass|grass_brown/) === null) {
                    //     this._destroyObject(e);
                    // }
                }
            }
        }

        private _getDirVector(): Phaser.Point {
            //check if 'e' is withing a conic area in the direction we face
            switch(this.lastDirection) {
                case 'left':
                    return Data.Constants.VECTOR_LEFT;
                case 'right':
                    return Data.Constants.VECTOR_RIGHT;
                case 'up':
                    return Data.Constants.VECTOR_UP;
                case 'down':
                    return Data.Constants.VECTOR_DOWN;
            }
        }

        /*******************************
         * Use action private methods
         *******************************/

        //Talk, run, Lift/Throw/Push/Pull
        private _checkUse(key: number, active: boolean, value: number) {
            if (!active || this.locked) {
                return;
            }

            // throw current item if carrying;
            if (this.carrying) {
                return this.throwItem();
            }

            // interact with the first thing in the use cone that you can
            for(var i = 0; i < this.colliding.length; ++i) {
                var ent = this.colliding[i];

                if(this._inCone(ent, Data.Constants.PLAYER_USE_CONE)) {
                    switch(ent.entityType) {
                        case Data.ENTITY_TYPE.CHEST:
                            if(this.lastDirection === 'up') {
                                this.openChest(ent);
                            }
                            break;

                        case Data.ENTITY_TYPE.SIGN:
                            if(this.lastDirection === 'up') {
                                this.readSign(ent);
                            } else {
                                this.liftItem(ent);
                            }
                            break;

                        case Data.ENTITY_TYPE.ROCK:
                            if(this.inventory.gloves) {
                                this.liftItem(ent);
                            }
                            break;

                        case Data.ENTITY_TYPE.GRASS:
                        case Data.ENTITY_TYPE.POT:
                            this.liftItem(ent);
                            break;
                    }

                    //break loop
                    break;
                }
            }
        }

        /*******************************
         * Use item private methods
         *******************************/
         private _checkUseItem(key: number, active: boolean, value: number) {
            if(active) return;

            var particle;

            // if there is no item equipted or the item costs more magic than the player has currently
            if(!this.equipted || this.magic < this.equipted.cost) {
                this.errorSound.play();
                return;
            }

            //take out magic cost
            this.magic -= this.equipted.cost;

            // create the item particle
            particle = this.particlePool.alloc();
            particle.boot(this.equipted, this._phys.system);
            this.parent.addChild(particle);

            // this.emit('updateHud');
        }

        private _destroyObject(obj: any) {
            var spr = this.smashPool.alloc();

            spr.animations.play(obj.properties.type);
            spr.anchor.copyFrom(obj.anchor);
            spr.position.copyFrom(obj.position);
            spr.visible = true;

            //add sprite
            obj.parent.addChild(spr);

            //TODO: drops?
            obj.destroy();
        }

        throwItem() {
            var v = this._getDirVector(),
                yf = v.y === -1 ? 0 : 1;

            this.carrying = null;
            this.throwSound.play();

            this.game.add.tween(this.carrying)
                .to({
                    x: this.carrying.x + (Data.Constants.PLAYER_THROW_DISTANCE_X * v.x),
                    y: this.carrying.y + (Data.Constants.PLAYER_THROW_DISTANCE_Y * v.y) + (yf * this.height)
                }, 250)
                .start()
                .onComplete.addOnce(function () {
                    this._destroyObject(this.carrying);
                }, this);

            this._setMoveAnimation();
        }

        openChest(chest: Entities.Entity) {
            // if(!chest.properties.loot)
            //     return;

            // //conditional loot based on inventory
            // var loot = chest.properties.loot.split(','),
            //     i = 0;

            // //find the first loot item they don't have already
            // while(i < loot.length - 1 && this.inventory[loot[i]])
            //     ++i;

            // //use this loot
            // loot = loot[i];

            // this.lock();
            // this.goto(0, 'lift_walk_down').stop();

            // //open chest
            // chest.setTexture(lttp.game.cache.getTextures('sprite_worlditems')['dungeon/chest_open.png']);
            // this.sounds.openChest.play();

            // //show loot
            // var obj = this.itempool.create();
            // this.parent.addChild(obj);
            // obj.setup(chest, null, loot);
            // obj.position.y -= 5;

            // //small animation
            // var self = this;
            // setTimeout(function() {
            //     self.sounds.itemFanfaire.play();
            // }, 100);
            // TweenLite.to(obj.position, 1.5, {
            //     y: '-=5',
            //     ease: Linear.easenone,
            //     onComplete: function() {
            //         //TODO: SHOW DIALOG
            //         self.unlock();
            //         self.itempool.free(obj);
            //         obj.pickup();

            //         //update hud
            //         self.inventory[obj.type] += obj.value;
            //         self.emit('updateHud');
            //     }
            // })

            // //remove loot for next time
            // this._markEmpty(chest);
        }

        readSign(sign) {
            // this.emit('readSign', sign);
        }

        liftItem(item) {
            // //Do lifting of the object
            // this.lock();

            // //change physics to sensor
            // item.disablePhysics();
            // item.sensor = true;
            // item.enablePhysics();

            // //remove from collision list
            // var idx = this.colliding.indexOf(item);
            // if(idx !== -1) {
            //     this.colliding.splice(idx, 1);
            // }

            // //drop the loot
            // if(item.properties.loot) {
            //     this.dropLoot(item);
            // }

            // //make it just below loot
            // item.parent.removeChild(item);
            // this.parent.addChild(item);

            // //set the correct texture
            // var tx = 'dungeon/' + item.properties.type + (item.properties.heavy ? '_heavy' : '') + '.png';
            // item.setTexture(lttp.game.cache.getTextures('sprite_worlditems')[tx]);

            // //lift the item
            // this.goto(0, 'lift_' + this.lastDir).play();
            // this.sounds.lift.play();

            // var self = this;
            // TweenLite.to(item.position, 0.15, {
            //     x: self.position.x,
            //     y: self.position.y - self.height + 5,
            //     ease: Linear.easeNone,
            //     onComplete: function() {
            //         //set that we are carrying it
            //         self.carrying = item;
            //         self.unlock();
            //     }
            // });
        }

        /*******************************
         * Utility private methods
         *******************************/

        private _inCone(obj: Entities.Entity, cone: number) {
            this._coneVec.set(
                obj.x - this.x,
                obj.y - this.y
            );

            this._coneVec.normalize();

            //check if 'e' is withing a conic area in the direction we face
            switch(this.lastDirection) {
                case 'left':
                    return (this._coneVec.x < 0 && this._coneVec.y > -cone && this._coneVec.y < cone);
                case 'right':
                    return (this._coneVec.x > 0 && this._coneVec.y > -cone && this._coneVec.y < cone);
                case 'up':
                    return (this._coneVec.y < 0 && this._coneVec.x > -cone && this._coneVec.x < cone);
                case 'down':
                    return (this._coneVec.y > 0 && this._coneVec.x > -cone && this._coneVec.x < cone);
            }
        }

        // private _setAttackAnimation() {
        //     if(!this._attackAnchorMap) {
        //         this._attackAnchorMap = {
        //             up: {
        //                 0: [0, 1],
        //                 1: [-0.05, 1],
        //                 2: [0.05, 1],
        //                 3: [0, 1],
        //                 6: [0.2, 1],
        //                 7: [0.3, 1],
        //                 8: [0.4, 1]
        //             },
        //             down: {
        //                 0: [0.2, 1],
        //                 2: [0.2, 0.95],
        //                 3: [0.2, 0.79],
        //                 4: [0.1, 0.75],
        //                 5: [0.1, 0.75],
        //                 6: [0.1, 0.75],
        //                 7: [0.1, 0.75],
        //                 8: [0.1, 0.8],
        //                 9: [0.1, 0.75]
        //             },
        //             right: {
        //                 0: [0, 1],
        //                 7: [0, 0.75],
        //                 8: [0, 0.7]
        //             },
        //             left: {
        //                 0: [0.5, 1],
        //                 7: [0.5, 0.8]
        //             }
        //         }
        //     }

        //     var ax = this.anchor.x,
        //         ay = this.anchor.y,
        //         dir = this.lastDir,
        //         mp = this._attackAnchorMap[dir],
        //         self = this,
        //         frame = function(anim, fr) {
        //             if(mp && mp[fr]) {
        //                 self.anchor.x = mp[fr][0];
        //                 self.anchor.y = mp[fr][1];
        //             }
        //         };

        //     this.on('frame', frame);
        //     this.once('complete', function() {
        //         self.anchor.x = ax;
        //         self.anchor.y = ay;
        //         self.actions.attack = false;
        //         self.off('frame', frame);
        //         self.unlock();
        //     });
        //     this.goto(0, 'attack_' + dir).play();
        // },

    }

    export class PlayerInventory {
        // upgradable items
        armor:          number = 0;
        sword:          number = 0;
        shield:         number = 0;
        gloves:         number = 0;

        // normal inventory items
        boomerang:      number = 0;
        bow:            number = 0;
        byrna:          number = 0;
        somaria:        number = 0;
        mushroom:       number = 0;
        firerod:        number = 0;
        flute:          number = 0;
        hammer:         number = 0;
        hookshot:       number = 0;
        icerod:         number = 0;
        lantern:        number = 0;
        cape:           number = 0;
        mirror:         number = 0;
        powder:         number = 0;
        net:            number = 0;
        shovel:         number = 0;

        // keys
        big_key:        number = 0;
        keys:           number = 0;

        // medallions
        bombos:         number = 0;
        ether:          number = 0;
        quake:          number = 0;

        // expendibles
        arrows:         number = 0;
        bombs:          number = 0;
        rupees:         number = 0;

        // passives
        flippers:       number = 0;
        boot:           number = 0;
        mudora:         number = 0;
        pearl:          number = 0;
        heartPieces:    number = 0;

        // victory tokens
        crystals:       number = 0;
        pendants:       number = 0;
    }
}

//         addAttackSensor: function(phys) {
//             if(this.atkSensor) return;

//             this.atkSensor = phys.addCustomShape(this, new gf.Circle(0, 0, C.ATTACK_SENSOR_RADIUS), true);
//             /*this.atkSensor = new gf.Body(this);
//             this.atkSensor.shape = new gf.Circle(0, 0, C.ATTACK_SENSOR_RADIUS);
//             this.atkSensor.sensor = true;

//             phys.addBody(this.atkSensor);*/
//         },

//         dropLoot: function(item) {
//             if(!item.properties.loot) return;

//             var obj = this.itempool.create();

//             obj.setup(item, this._phys.system);
//             this.parent.addChild(obj);

//             this._markEmpty(item);
//         },
//         collectLoot: function(obj) {
//             switch(obj.type) {
//                 case 'heart':
//                     this.heal(1);
//                     break;

//                 case 'magic':
//                     this.magic += obj.value;
//                     if(this.magic > this.maxMagic)
//                         this.magic = this.maxMagic;
//                     break;

//                 case 'arrows':
//                 case 'bombs':
//                 case 'rupees':
//                     this.inventory[obj.type] += obj.value;
//                     break;
//             }

//             obj.pickup();
//             this.itempool.free(obj);
//             this.emit('updateHud');
//         },

//         _markEmpty: function(item) {
//             //mark as empty
//             if(item.parent)
//                 item.parent.objects[item._objIndex].properties.loot = null;

//             item.properties.loot = null;
//         },

//         _physUpdate: function() {
//             if(this.carrying) {
//                 this.carrying.setPosition(
//                     this.position.x,
//                     this.position.y - this.height + 5
//                 );
//             }
//         },
//         jumpDown: function(vec) {
//             //TODO: Play sound

//             this.lock();
//             this.stop();
//             this._phys.system.pause();

//             vec.normalize();

//             var jump = 2,
//                 p = vec.x ? 'x' : 'y',
//                 amount = (C.JUMP_DISTANCE + jump) * (-vec[p]),
//                 self = this;

//             setTimeout(function() {
//                 self.sounds.fall.play();
//             }, C.JUMP_TIME / 4);

//             //do a small jump up if we are pointing down
//             if(vec.y < 0) {
//                 var opts = {
//                     ease: Linear.easeNone,
//                     onUpdate: function() {
//                         self.setPosition(
//                             self.position.x,
//                             self.position.y
//                         );
//                     },
//                     onComplete: this._doJumpDown.bind(this, p, amount)
//                 };
//                 opts[p] = this.position[p] - jump;

//                 TweenLite.to(this.position, C.JUMP_TIME / 4, opts);
//             } else {
//                 this._doJumpDown(p, amount);
//             }
//         },
//         _doJumpDown: function(p, amount) {
//             var self = this,
//                 opts = {
//                     ease: Linear.easeNone,
//                     onUpdate: function() {
//                         self.setPosition(
//                             self.position.x,
//                             self.position.y
//                         );
//                     },
//                     onComplete: function() {
//                         self.unlock();
//                         self._phys.system.resume();
//                     }
//                 };

//             opts[p] = amount;

//             TweenLite.to(this.position, (C.JUMP_TIME / 4) * 3, opts);
//         },
//         //on collision
//         _collide: function(obj, vec, colShape, myShape) {
//             //we got into range of something to attack
//             if(myShape === this.atkSensor) {
//                 if(obj.type) {
//                     this.inAttackRange.push(obj);

//                     //something new walked in while we were attacking
//                     if(this.actions.attack)
//                         this._checkAttack();
//                 }
//             }
//             //colliding with a new zone
//             else if(obj.type === 'zone') {
//                 this.emit('zone', obj, vec);
//             }
//             //collide with an exit
//             else if(obj.type === 'exit') {
//                 this.emit('exit', obj, vec);
//             }
//             //colliding with a blocking object
//             else if(!obj.sensor) {
//                 obj.__colVec = new gf.Vector(vec.x, vec.y);
//                 this.colliding.push(obj);
//                 //this._isBlocked();
//             }
//             //colliding with a sensor object
//             else {
//                 //pickup some loot
//                 if(obj.loot)
//                     this.collectLoot(obj);
//             }
//         },
//         _separate: function(obj, colShape, myShape) {
//             //remove from attack range
//             if(myShape === this.atkSensor) {
//                 var i = this.inAttackRange.indexOf(obj);

//                 if(i >= 0) {
//                     this.inAttackRange.splice(i, 1);
//                 }
//             }
//             //remove from collision list
//             else if(!obj.sensor) {
//                 var i = this.colliding.indexOf(obj);

//                 if(i >= 0) {
//                     this.colliding.splice(i, 1);
//                 }

//                 /*if(!this.colliding.length)
//                     this._notBlocked();*/
//             }
//         }
//     });

//     return Link;
// });
