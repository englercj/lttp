module Lttp.Entities {
    export class Entity extends Phaser.Sprite {

        //is this sprite able to move?
        locked: boolean = false;

        //maximum health of this entity
        maxHealth: number = 3;

        //current health of this entity
        health: number = 3;

        //moveSpeed the entity moves at
        moveSpeed: number = 75;

        constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any) {
            super(game, x, y, key, frame);
        }

        heal(amount: number) {
            if (this.alive) {
                this.health += amount;
            }

            return this;
        }

        _addDirectionalFrames(type: string, num: number, speed: number, loop: boolean) {
            if(type.indexOf('%s') === -1) {
                type += '_%s';
            }

            this._addFrames([
                type.replace(/%s/g, 'left'),
                type.replace(/%s/g, 'right'),
                type.replace(/%s/g, 'down'),
                type.replace(/%s/g, 'up')
            ], num, speed, loop);
        }

        _addFrames(types: string[], num: number, speed: number, loop: boolean) {
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

                this.animations.add(name, frames, speed, loop);
            }
        }

    }
}
