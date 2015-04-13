module Lttp.Effects {
    export class MapOverlay extends Phaser.Sprite {

        key: Phaser.BitmapData;

        onComplete: Phaser.Signal;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, 'sprite_overlays');

            this.animations.add('rain', ['rain1.png', 'rain2.png', 'rain3.png']);
        }

    }
}
