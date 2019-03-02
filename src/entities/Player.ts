import { Pool } from '../utility/Pool';
import { isInViewCone } from '../math';
import { EEntityType, AUDIO_EFFECT_VOLUME } from '../data/Constants';
import { IItemDescriptor } from '../data/ItemDescriptors';
import { PlayerInventory } from '../data/PlayerInventory';
import { Entity } from './Entity';
import { ParticleEntity } from './misc/Particle';
import { SmashEntity } from './misc/Smash';
import { WorldItem } from './items/WorldItem';

export const READ_SIGN_EVENT = 'readSign';
export const INVENTORY_CHANGE_EVENT = 'inventoryChange';

export class Player extends Entity
{
    // player type
    entityType = EEntityType.Player;

    // maximum maxMagic of this entity
    maxMagic: number;

    // current magic of this entity
    magic: number;

    // objects currently within attack range
    inAttackRange: Entity[];
    colliding: Entity[];

    // a pool of sprite to do smashing animations
    smashPool: Pool<SmashEntity>;

    // a pool of world items to be dropped
    itemPool: Pool<WorldItem>;

    // a pool of particles to throw around
    particlePool: Pool<ParticleEntity>;

    liftSound: Phaser.Sound.BaseSound;
    throwSound: Phaser.Sound.BaseSound;
    openChestSound: Phaser.Sound.BaseSound;
    itemFanfaireSound: Phaser.Sound.BaseSound;
    errorSound: Phaser.Sound.BaseSound;
    fallSound: Phaser.Sound.BaseSound;

    equipted: IItemDescriptor = null;

    inventory = new PlayerInventory();

    carrying: Phaser.GameObjects.Sprite = null;

    attacking = false;
    chargingAttack = false;

    constructor(scene: Phaser.Scene)
    {
        super(scene, 'sprite_link');

        this.ignoreDestroy = true;

        this.name = 'link';
        this.moveSpeed = 90;

        this.maxMagic = 10;
        this.magic = 0;

        this.inAttackRange = [];
        this.colliding = [];

        this.smashPool = new Pool(scene, SmashEntity);
        this.itemPool = new Pool(scene, WorldItem);
        this.particlePool = new Pool(scene, ParticleEntity);

        this.liftSound = scene.sound.add('effect_lift', { volume: AUDIO_EFFECT_VOLUME });
        this.throwSound = scene.sound.add('effect_throw', { volume: AUDIO_EFFECT_VOLUME });
        this.openChestSound = scene.sound.add('effect_chest', { volume: AUDIO_EFFECT_VOLUME });
        this.itemFanfaireSound = scene.sound.add('effect_item_fanfaire', { volume: AUDIO_EFFECT_VOLUME });
        this.errorSound = scene.sound.add('effect_error', { volume: AUDIO_EFFECT_VOLUME });
        this.fallSound = scene.sound.add('effect_fall', { volume: AUDIO_EFFECT_VOLUME });
    }

    setup(): this
    {
        super.setup();

        this.unlock();

        this.body.clearShapes();

        // this.bodyShape = this.body.addRectangle(16, 22, 0, 4);
        // this.bodyShape = this.body.addCapsule(2, 6, 0, 7, Math.PI / 2);
        this.bodyShape = this.body.addCircle(7, 0, 7);

        this.attackSensor = this.body.addCircle(PLAYER_ATTACK_SENSOR_RADIUS, 0, 4);
        this.attackSensor.sensor = true;

        return this;
    }

    move(direction: number, value: number, active: boolean)
    {
        const newValue = active ? value : 0;

        if (this.moving[direction] !== newValue)
        {
            this.moving[direction] = newValue;

            this.moveDirty = true;
            this.textureDirty = true;
        }

        this.evalFacingDirection();
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

        this._checkAttack();
    }

    // Talk, run, Lift/Throw/Push/Pull
    use(active: boolean) {
        if (!active || this.locked) {
            return;
        }

        // throw current item if carrying;
        if (this.carrying) {
            return this.throwItem();
        }

        // interact with the first thing in the use cone that you can
        for (let i = 0; i < this.colliding.length; ++i) {
            const ent = this.colliding[i];

            if (isInViewCone(this, ent, PLAYER_USE_CONE)) {
                switch (ent.properties.type) {
                    // TODO: Make the item decide this stuff? They all implement a `use` method instead?
                    case MAP_OBJECTS.CHEST:
                        if (this.facing === Phaser.UP) {
                            this.openChest(ent);
                        }
                        break;

                    case MAP_OBJECTS.SIGN:
                        if (this.facing === Phaser.UP) {
                            this.onReadSign.dispatch(ent);
                        }
                        else {
                            this.liftItem(ent);
                        }
                        break;

                    case MAP_OBJECTS.ROCK:
                        if (this.inventory.gloves) {
                            this.liftItem(ent);
                        }
                        break;

                    case MAP_OBJECTS.GRASS:
                    case MAP_OBJECTS.POT:
                        this.liftItem(ent);
                        break;
                }

                // only act on a single object in the cone
                break;
            }
        }
    }

    useItem(active: boolean) {
        if (active) { return; }

        // if there is no item equipted or the item costs more magic than the player has currently
        if (!this.equipted || this.magic < this.equipted.cost) {
            this.errorSound.play();
            return;
        }

        // take out magic cost
        this.magic -= this.equipted.cost;

        // create the item particle
        let particle = this.particlePool.alloc();
        particle.boot(this.equipted);

        this.parent.addChild(particle);
    }

    destroy() {
        // debugger;
    }

    throwItem() {
        const v = this.getFacingVector();
        const yf = v.y === -1 ? 0 : 1;

        this.carrying = null;
        this.throwSound.play();

        this.game.add.tween(this.carrying)
            .to({
                x: this.carrying.x + (PLAYER_THROW_DISTANCE_X * v.x),
                y: this.carrying.y + (PLAYER_THROW_DISTANCE_Y * v.y) + (yf * this.height),
            }, 250)
            .start()
            .onComplete.addOnce(() => {
                this._destroyObject(this.carrying);
            }, this);

        this.textureDirty = true;
    }

    // TODO: Move this into a new Chest class
    openChest(chest: Entity) {
        if (!chest.properties.loot) {
            return;
        }

        // conditional loot based on inventory
        let loot = chest.properties.loot.split(',');
        let i = 0;

        // find the first loot item they don't have already
        while (i < loot.length - 1 && this.inventory[loot[i]]) {
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
        const obj = this.itemPool.alloc();
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
                // TODO: Show dialog when first time item has been got

                // unlock the player
                this.unlock();

                // remove the item
                this.itemPool.free(obj);
                obj.pickup();

                // update the inventory
                this.inventory[obj.itemType] += obj.value;

                this.onInventoryChange.dispatch();
            }, this);

        // TODO: remove loot from level for next time
        // this._markEmpty(chest);
    }

    liftItem(item: Entity) {
        // lock player movement
        this.lock();

        // TODO: item physics
        // change physics to sensor
        // item.disablePhysics();
        // item.sensor = true;
        // item.enablePhysics();

        // remove from collision list
        const idx = this.colliding.indexOf(item);
        if (idx !== -1) {
            this.colliding.splice(idx, 1);
        }

        // drop the loot
        if (item.properties.loot) {
            const obj = this.itemPool.alloc();

            obj.boot(item);
            this.game.add.existing(obj);

            this._markEmpty(item);
        }

        // make it just below loot in the draw array (so you can see loot on top)
        // item.parent.removeChild(item);
        // this.parent.addChild(item);

        // set the correct texture
        // TODO: Looks like the old code expected WorldItems to be spawned for map objects
        // now they are just sprites, and they share a texture! Need to create a new texture and
        // set the proper frame for it when lifting.
        // console.log(item.objectType, item.itemType);
        // item.setTexture(new PIXI.Texture(item.texture.baseTexture));
        // item.setFrame(item.frames.getFrameByName('dungeon/' + item.itemType + (item.properties.heavy ? '_heavy' : '') + '.png'));

        // lift the item
        this.animations.play('lift_' + this.getFacingString());
        this.liftSound.play();

        this.game.add.tween(item.body)
            .to({ x: this.x, y: this.y - this.height + 5 }, 150)
            .start()
            .onComplete.addOnce(function () {
                this.unlock().carrying = item;
            }, this);
    }

    collectLoot(item: WorldItem) {
        switch (item.itemType) {
            case WORLD_ITEMS.HEART:
                this.heal(1);
                break;

            case WORLD_ITEMS.MAGIC:
                this.magic += item.value;
                if (this.magic > this.maxMagic) {
                    this.magic = this.maxMagic;
                }
                break;

            case WORLD_ITEMS.ARROWS:
            case WORLD_ITEMS.BOMBS:
            case WORLD_ITEMS.RUPEES:
                this.inventory[item.type] += item.value;
                break;
        }

        item.pickup();
        this.itemPool.free(item);
    }

    postUpdate() {
        super.postUpdate();

        if (this.carrying) {
            this.carrying.position.x = this.position.x;
            this.carrying.position.y = this.position.y - this.height + 5;
        }
    }

    onBeginContact(obj: Entity /*| Phaser.Plugin.Tiled.ITiledObject*/, objShape: p2.Shape, myShape: p2.Shape) {
        // we got into range of something to attack
        if (myShape === this.attackSensor) {
            if (obj.type && obj.body) {
                this.inAttackRange.push(obj);

                // something new walked in while we were attacking
                if (this.attacking) {
                    this._checkAttack();
                }
            }
        }
        // colliding with a blocking object
        else if (obj.body && !obj.body.data.shapes[0].sensor) {
            this.colliding.push(obj);
            // this._isBlocked();
        }
        // colliding with a sensor object, see if we can collect it
        else if ((<WorldItem>obj).itemType) {
            this.collectLoot((<WorldItem>obj));
        }
    }

    onEndContact(obj: Entity /*| Phaser.Plugin.Tiled.ITiledObject*/, objShape: p2.Shape, myShape: p2.Shape) {
        // remove from attack range
        if (myShape === this.attackSensor) {
            const i = this.inAttackRange.indexOf(obj);

            if (i >= 0) {
                this.inAttackRange.splice(i, 1);
            }
        }
        // remove from collision list
        else if (obj.body && !obj.body.data.shapes[0].sensor) {
            const i = this.colliding.indexOf(obj);

            if (i >= 0) {
                this.colliding.splice(i, 1);
            }

            // if(!this.colliding.length) {
            //     this._notBlocked();
            // }
        }
    }

    private _markEmpty(item: Entity) {
        item.properties.loot = null;

        if (item.parent) {
            const layer = <Phaser.Plugin.Tiled.Objectlayer>item.parent;

            layer.objects[(<any>item)._objIndex].properties.loot = null;

            this.game.loadedSave.updateZoneData(layer);
        }
    }

    private _destroyObject(obj: any) {
        const spr = this.smashPool.alloc();

        spr.animations.play(obj.properties.type);
        spr.anchor.copyFrom(obj.anchor);
        spr.position.copyFrom(obj.position);
        spr.visible = true;

        // add sprite
        obj.parent.addChild(spr);

        // TODO: drops?
        obj.destroy();
    }

    private _updateAnimation() {
        // update attack animation
        if (this.attacking) {
            this.animations.play('attack_' + this.facing);
            return;
        }

        // update movement animation
        const moving = this.moving[Phaser.UP] || this.moving[Phaser.DOWN] || this.moving[Phaser.LEFT] || this.moving[Phaser.RIGHT];

        let anim = (moving ? 'walk' : 'idle');

        if (this.carrying) {
            anim = 'lift_' + anim;
        }
        else if (this.inventory.shield) {
            anim += '_shield';
        }

        this.animations.play(anim + '_' + this.getFacingString());
    }

    private _checkAttack() {
        for (let i = this.inAttackRange.length - 1; i > -1; --i) {
            const ent = this.inAttackRange[i];

            if (isInViewCone(this, ent, PLAYER_ATTACK_CONE)) {
                ent.damage(this.attackDamage);
            }
        }
    }
}
