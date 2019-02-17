import Game from '../../Game';
import Entity from '../Entity';
import { IItemDescriptor } from '../../data/ItemDescriptors';

export class Particle extends Entity {
    particleType: string;

    constructor(game: Game) {
        super(game, 'sprite_particles');

        this.body.data.shapes[0].sensor = true;

        this.particleType = '';

        this.anchor.set(0, 1);

        this.events.onAnimationComplete.add(this.expire, this);
    }

    boot(item: IItemDescriptor, phys: boolean = false) {
        const cfg = item.particle;

        this.visible = true;
        // this.hitArea = cfg.hitArea || new Rectangle(0, 8, 8, 8);

        if (!this.animations.getAnimation(item.name)) {
            const frames: string[] = [];

            for (let i = 0; i < cfg.num; ++i) {
                frames.push(cfg.path + (i + 1) + cfg.ext);
            }

            this.animations.add(item.name, frames, cfg.framerate, cfg.loop);
        }

        // set type
        this.name = item.name;
        this.particleType = cfg.type;

        // play animation for this item
        this.animations.play(item.name);
        // this.enablePhysics(phys);

        // set position
        const player = this.game.player;
        const space = cfg.spacing;

        switch (player.facing) {
            case Phaser.UP:
                this.x = player.x + (player.width / 2) - (this.width / 2);
                this.y = player.y - space - player.height;
                break;

            case Phaser.DOWN:
                this.x = player.x + (player.width / 2) - (this.width / 2);
                this.y = player.y + space + this.height;
                break;

            case Phaser.LEFT:
                this.x = player.x - space - this.width;
                this.y = player.y - 3;
                break;

            case Phaser.RIGHT:
                this.x = player.x + space + player.width;
                this.y = player.y - 3;
                break;

        }

        // if there is a velocity set it
        // if (cfg.velocity) {
        //     this.velocity = cfg.velocity.clone();
        //     this.setVelocity(this.velocity);

        //     if(cfg.velocityTimer) {
        //         var cb;
        //         if(cfg.velocityReverse) {
        //             cb = this.reverse;
        //         } else {
        //             cb = this.expire;
        //         }

        //         this.velto = setTimeout(cb.bind(this), cfg.velocityTimer)
        //     }
        // }
    }

    expire() {
        // clearTimeout(this.velto);
        this.animations.stop();
        this.visible = false;
        // this.disablePhysics();
    }

    reverse() {
        // clearTimeout(this.velto);
        // this.velocity.x = -this.velocity.x;
        // this.velocity.y = -this.velocity.y;

        // this.setVelocity(this.velocity);
    }

    // private _collide(obj, vec, colShape, myShape) {
    //     //fire particle
    //     if(this.type === 'fire') {
    //         if(obj.lite) {
    //             obj.lite();
    //         }
    //     }

    //     //firerod hitting wall
    //     if(this.name === 'firerod') {
    //         if(obj.type === C.ENTITY.TILE) {
    //             this.expire();
    //         }
    //     }
    //     //boomerang hitting stuff
    //     else if(this.name === 'boomerang') {
    //         switch(obj.type) {
    //             //reverse the velocity back to the player
    //             case C.ENTITY.TILE:
    //                 this.reverse();
    //                 break;

    //             //expire (player caught it)
    //             case C.ENTITY.PLAYER:
    //                 this.expire();
    //                 break;
    //         }
    //     }
    // }
}
