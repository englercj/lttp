module Lttp.Entities {
    export class Entity extends Phaser.Sprite {

        // is this sprite able to move?
        locked: boolean = false;

        // maximum health of this entity
        maxHealth: number = 3;

        // current health of this entity
        health: number = 3;

        // moveSpeed the entity moves at
        moveSpeed: number = 80;

        // current direction of movement
        movement: Phaser.Point = new Phaser.Point();

        // the amount of damage this entity deals normally
        attackDamage: number = 1;

        // state of movement of this entity
        moveState: any = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        // type of this entity
        entityType: Data.ENTITY_TYPE = Data.ENTITY_TYPE.NEUTRAL;

        frames: Phaser.FrameData;

        properties: any;

        constructor(game: Phaser.Game, key: any, physical: boolean = true, frame?: any) {
            super(game, 0, 0, key, frame);

            this.frames = typeof key === 'string' ? game.cache.getFrameData(key) : null;

            if (physical) {
                // Enable physics for this entity
                game.physics.p2.enable(this);

                // Modify a few body properties
                this.body.setZeroDamping();
                this.body.fixedRotation = true;
            }
        }

        heal(amount: number) {
            if (this.alive) {
                this.health += amount;
            }

            return this;
        }

        lock(): Entity {
            this.body.setZeroVelocity();
            this.locked = true;

            return this;
        }

        unlock(): Entity {
            this.body.velocity.x = this.movement.x;
            this.body.velocity.y = this.movement.y;
            this.locked = false;

            return this;
        }

        _addDirectionalFrames(type: string, num: number, frameRate: number = 60, loop: boolean = false) {
            if(type.indexOf('%s') === -1) {
                type += '_%s';
            }

            this._addFrames([
                type.replace(/%s/g, 'left'),
                type.replace(/%s/g, 'right'),
                type.replace(/%s/g, 'down'),
                type.replace(/%s/g, 'up')
            ], num, frameRate, loop);
        }

        _addFrames(types: string[], num: number, frameRate: number = 60, loop: boolean = false) {
            for(var t = 0, tl = types.length; t < tl; ++t) {
                var frames = [],
                    type = types[t],
                    name = type.replace(/.+\/|\.png|_%./g, '');

                if(type.indexOf('%d') === -1) {
                    type += '_%d';
                }

                for(var f = 1; f <= num; ++f) {
                    frames.push(type.replace(/%d/g, f.toString()) + '.png');
                }

                this.animations.add(name, frames, frameRate, loop);
            }
        }

    }
}
