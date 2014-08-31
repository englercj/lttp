module Lttp.Entities {
    export class Entity extends Phaser.Sprite {

        // is this sprite able to move?
        locked: boolean = false;

        // maximum health of this entity
        maxHealth: number = 3;

        // current health of this entity
        health: number = 3;

        // moveSpeed the entity moves at
        moveSpeed: number = 75;

        // current direction of movement
        movement: Phaser.Point = new Phaser.Point();

        // the amount of damage this entity deals normally
        attackDamage: number = 1;

        moveState: any = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        entityType: Data.ENTITY_TYPE = Data.ENTITY_TYPE.NEUTRAL;

        constructor(game: Phaser.Game, x: number = 0, y: number = 0, key?: any, frame?: any) {
            super(game, x, y, key, frame);
        }

        heal(amount: number) {
            if (this.alive) {
                this.health += amount;
            }

            return this;
        }

        lock() {
            this.setVelocity(new gf.Vector());
            this.locked = true;
        }

        unlock() {
            this.setVelocity(this.movement);
            this.locked = false;
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
