module Lttp.Entities.Misc {
    export class Torch extends Entities.Entity {

        light: number = 0.25;
        fuelTime: number = 5000;

        constructor(game: Phaser.Game) {
            super(game, 'sprite_misc', false);

            this.animations.add('torch', [
                'torch/torch0.png'
            ]);

            this.animations.add('torch_lit', [
                'torch/torch1.png',
                'torch/torch2.png',
                'torch/torch3.png'
            ], 0.09, true);

            this.animations.add('wall_torch', [
                'torch/wall_torch1.png',
                'torch/wall_torch2.png',
                'torch/wall_torch3.png'
            ], 0.09, true);
        }

        lite() {
            this.animations.play('torch_lit');
            Game.timer.add(this.fuelTime, this.extinguish, this);

            //light up dat world
            // lttp.play.world.findLayer('darkness').alpha -= this.light;
        }

        extinguish() {
            this.animations.stop('torch');

            //darken dat world
            // lttp.play.world.findLayer('darkness').alpha += this.light;
        }

    }
}
