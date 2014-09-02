module Lttp.Entities.Misc {
    export class Flower extends Entities.Entity {

        constructor(game: Phaser.Game) {
            super(game, 'sprite_misc', false);

            this.animations.add('flower_1', [
                'flower/flower_1_3.png',
                'flower/flower_1_1.png',
                'flower/flower_1_2.png'
            ], 6, true);

            this.animations.add('flower_2', [
                'flower/flower_2_3.png',
                'flower/flower_2_1.png',
                'flower/flower_2_2.png'
            ], 6, true);
        }

    }
}
