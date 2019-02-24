import { Entity } from '../Entity';

export class Torch extends Entity
{
    light: number = 0.25;
    fuelTime: number = 5000;

    constructor(scene: Phaser.Scene)
    {
        super(scene, 'sprite_misc');
    }

    lite()
    {
        this.anims.play('torch_lit');
        this.scene.time.delayedCall(this.fuelTime, this.extinguish, [], this);

        // light up dat world
        // lttp.play.world.findLayer('darkness').alpha -= this.light;
    }

    extinguish()
    {
        this.anims.play('torch');

        // darken dat world
        // lttp.play.world.findLayer('darkness').alpha += this.light;
    }
}
