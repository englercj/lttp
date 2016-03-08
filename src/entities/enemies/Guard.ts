/// <reference path="../Enemy.ts" />

// TODO: Finish up guard entity

module Lttp.Entities.Enemies {
    export class Guard extends Entities.Enemies.Enemy {
        /**********
        var Guard = function(type) {
            Enemy.call(this, lttp.game.cache.getTextures('sprite_enemies'), 0.2);

            this.name = type;

            this._addAnimations(type);
        };

        gf.inherit(Guard, Enemy, {
            _addAnimations: function(type) {
                var prefix = 'guards/guard_' + type;

                switch(type) {
                    case 'small':
                        this._addDirectionalFrames(prefix + '/walk', 2, 0.2, true);
                        this._addDirectionalFrames(prefix + '/walk_%s_look', 2, 0.2, true);
                        break;
                    case 'green':
                    case 'blue':
                        this._addDirectionalFrames(prefix + '/walk', 4, 0.2, true);
                        this._addDirectionalFrames(prefix + '/walk_%s_look', 2, 0.2, true);
                        break;
                    case 'block':
                        this.addAnimation('up', this.spritesheet[prefix + '/up.png'].frames[0]);
                        this.addAnimation('down', this.spritesheet[prefix + '/down.png'].frames[0]);
                        this.addAnimation('left', this.spritesheet[prefix + '/left.png'].frames[0]);
                        this.addAnimation('right', this.spritesheet[prefix + '/right.png'].frames[0]);
                        break;
                }
            }
        });
        **********/
    }
}
