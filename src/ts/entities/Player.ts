/// <reference path="Entity.ts" />

module Lttp.Entities {
    export class Player extends Entities.Entity {
        //player type
        entityType = Data.ENTITY_TYPE.PLAYER;

        //maximum maxMagic of this entity
        maxMagic: number;

        //current magic of this entity
        magic: number;

        //objects currently within attack range
        inAttackRange: Entities.Entity[];
        colliding: Entities.Entity[];

        //a pool of sprite to do smashing animations
        smashPool: Utility.Pool<Entities.Misc.Smash>;

        //a pool of world items to be dropped
        itemPool: Utility.Pool<Entities.Items.WorldItem>;

        //a pool of particles to throw around
        particlePool: Utility.Pool<Entities.Misc.Particle>;

        liftSound: Phaser.Sound;
        throwSound: Phaser.Sound;
        openChestSound: Phaser.Sound;
        itemFanfaireSound: Phaser.Sound;
        errorSound: Phaser.Sound;
        fallSound: Phaser.Sound;

        equipted: Data.ItemDescriptor;

        inventory: Data.PlayerInventory;

        carrying: Phaser.Sprite;

        attacking: boolean;
        chargingAttack: boolean;

        constructor(game: Game) {
            super(game, 'sprite_link');

            this.name = 'link';
            this.moveSpeed = 90;

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

            this.inventory = new Data.PlayerInventory();

            this.carrying = null;

            this.attacking = false;
            this.chargingAttack = false;

            this.anchor.set(0.5);

            // TODO: carry follow
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

            this.textureDirty = true;
        }

        private _addDirectionalPrefixedFrames(type: string, num: number, frameRate: number = 60, loop: boolean = false) {
            this._addDirectionalFrames(type + '_%s/' + type + '_%s', num, frameRate, loop);
        }

        private _updateAnimation() {
            // update attack animation
            if (this.attacking) {
                this.animations.play('attack_' + this.facing);
                return;
            }

            // update movement animation
            var moving = this.moving[Phaser.UP] || this.moving[Phaser.DOWN] || this.moving[Phaser.LEFT] || this.moving[Phaser.RIGHT];

            var anim = (moving ? 'walk' : 'idle');

            if (this.carrying) {
                anim = 'lift_' + anim;
            }
            else if (this.inventory.shield) {
                anim += '_shield'
            }

            this.animations.play(anim + '_' + this._getFacingString());
        }

        setup(level: Levels.Level): Player {
            super.setup(level);

            // TODO: add atack sensor shapes

            return this;
        }

        update() {
            super.update();

            if (this.textureDirty) {
                this.textureDirty = false;

                this._updateAnimation();
            }

            if (!this.locked && this.moveDirty) {
                // Update X movement
                if (this.moving[Phaser.LEFT]) {
                    this.body.velocity.x = -this.moving[Phaser.LEFT] * this.moveSpeed;
                }
                else if (this.moving[Phaser.RIGHT]) {
                    this.body.velocity.x = this.moving[Phaser.RIGHT] * this.moveSpeed;
                }
                else {
                    this.body.velocity.x = 0;
                }

                // Update Y movement
                if (this.moving[Phaser.UP]) {
                    this.body.velocity.y = -this.moving[Phaser.UP] * this.moveSpeed;
                }
                else if (this.moving[Phaser.DOWN]) {
                    this.body.velocity.y = this.moving[Phaser.DOWN] * this.moveSpeed;
                }
                else {
                    this.body.velocity.y = 0;
                }
            }
        }

        move(direction: number, value: number, active: boolean) {
            this.moving[direction] = active ? value : 0;

            this.facing = direction;

            this.moveDirty = true;
            this.textureDirty = true;
        }

        attack(active: boolean) {
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

            this.textureDirty = true;

            for(var i = this.inAttackRange.length - 1; i > -1; --i) {
                var ent = this.inAttackRange[i];

                if(math.isInViewCone(this, ent, Data.Constants.PLAYER_ATTACK_CONE)) {
                    ent.damage(this.attackDamage);
                }
            }
        }

        //Talk, run, Lift/Throw/Push/Pull
        use(active: boolean) {
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

                if(math.isInViewCone(this, ent, Data.Constants.PLAYER_USE_CONE)) {
                    switch(ent.entityType) {
                        // TODO: Make the item decide this stuff? They all implement a `use` method instead?
                        case Data.ENTITY_TYPE.CHEST:
                            if (this.facing === Phaser.UP) {
                                this.openChest(ent);
                            }
                            break;

                        case Data.ENTITY_TYPE.SIGN:
                            if (this.facing === Phaser.UP) {
                                this.readSign(ent);
                            }
                            else {
                                this.liftItem(<Entities.Items.WorldItem>ent);
                            }
                            break;

                        case Data.ENTITY_TYPE.ROCK:
                            if (this.inventory.gloves) {
                                this.liftItem(<Entities.Items.WorldItem>ent);
                            }
                            break;

                        case Data.ENTITY_TYPE.GRASS:
                        case Data.ENTITY_TYPE.POT:
                            this.liftItem(<Entities.Items.WorldItem>ent);
                            break;
                    }

                    // only act on a single object in the cone
                    break;
                }
            }
        }

        useItem(active: boolean) {
            if(active) return;

            var particle;

            // if there is no item equipted or the item costs more magic than the player has currently
            if (!this.equipted || this.magic < this.equipted.cost) {
                this.errorSound.play();
                return;
            }

            // take out magic cost
            this.magic -= this.equipted.cost;

            // create the item particle
            particle = this.particlePool.alloc();
            particle.boot(this.equipted);

            this.parent.addChild(particle);
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
            var v = this._getFacingVector(),
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

            this.textureDirty = true;
        }

        // TODO: Move this into a new Chest class
        openChest(chest: Entities.Entity) {
            if (!chest.properties.loot) {
                return;
            }

            // conditional loot based on inventory
            var loot = chest.properties.loot.split(','),
                i = 0;

            // find the first loot item they don't have already
            while(i < loot.length - 1 && this.inventory[loot[i]]) {
                ++i;
            }

            // use the loot they don't have, or the last one
            loot = loot[i];

            // lock player movement and go to the open animation
            this.lock().animations.stop('lift_walk_down');

            // set chest texture to the open state
            chest.setFrame(this.game.cache.getFrameData('sprite_worlditems').getFrameByName('dungeon/chest_open.png'));

            // play the check open sound
            this.openChestSound.play();

            // show loot
            var obj = this.itemPool.alloc();
            this.parent.addChild(obj);
            obj.boot(chest, loot);
            obj.position.y -= 5;

            // small animation
            Game.timer.add(100, function () {
                this.itemFanfaireSound.play();
            }, this);

            this.game.add.tween(obj)
                .to({ y: obj.y - 5 }, 1500)
                .start()
                .onComplete.addOnce(function () {
                    //TODO: Show dialog when first time item has been got

                    // unlock the player
                    this.unlock();

                    // remove the item
                    this.itemPool.free(obj);
                    obj.pickup();

                    // update the inventory/hud
                    this.inventory[obj.itemType] += obj.value;

                    //TODO: hud updates
                    // this.emit('updateHud');
                }, this);

            // TODO: remove loot from level for next time
            // this._markEmpty(chest);
        }

        readSign(sign) {
            // TODO: Signage
            // this.emit('readSign', sign);
        }

        liftItem(item: Entities.Items.WorldItem) {
            // lock player movement
            this.lock();

            //TODO: item physics
            // change physics to sensor
            // item.disablePhysics();
            // item.sensor = true;
            // item.enablePhysics();

            // remove from collision list
            var idx = this.colliding.indexOf(item);
            if (idx !== -1) {
                this.colliding.splice(idx, 1);
            }

            // drop the loot
            if (item.properties.loot) {
                item.dropLoot();
            }

            // make it just below loot in the draw array (so you can see loot on top)
            item.parent.removeChild(item);
            this.parent.addChild(item);

            // set the correct texture
            item.setFrame(item.frames.getFrameByName('dungeon/' + item.itemType + (item.properties.heavy ? '_heavy' : '') + '.png'));

            //lift the item
            this.animations.play('lift_' + this._getFacingString());
            this.liftSound.play();

            this.game.add.tween(item)
                .to({ x: this.x, y: this.y - this.height + 5 }, 150)
                .start()
                .onComplete.addOnce(function () {
                    this.unlock().carrying = item;
                }, this);
        }

        collectLoot(item: Entities.Items.WorldItem) {
            switch(item.itemType) {
                case 'heart':
                    this.heal(1);
                    break;

                case 'magic':
                    this.magic += item.value;
                    if(this.magic > this.maxMagic) {
                        this.magic = this.maxMagic;
                    }
                    break;

                case 'arrows':
                case 'bombs':
                case 'rupees':
                    this.inventory[item.type] += item.value;
                    break;
            }

            item.pickup();
            this.itemPool.free(item);
        }

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

//         ,
//         ,

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
