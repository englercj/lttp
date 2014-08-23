module Lttp.Effects {
    export class ScreenFlash extends Phaser.Sprite {

        onComplete: Phaser.Signal;

        constructor(game: Phaser.Game, color?: String) {
            super(game, 0, 0, game.add.bitmapData(game.width, game.height));

            color = color || 'white';
            this.key.ctx.fillStyle = color;
            this.key.ctx.fillRect(0, 0, game.width, game.height);

            this.alpha = 0;

            this.onComplete = new Phaser.Signal();
        }

        flash = function(maxAlpha?: number, duration?: number, easing?: Function): ScreenFlash {
            maxAlpha = maxAlpha || 1;
            duration = duration || 100;
            easing = easing || Phaser.Easing.Linear.None;

            this.game.add.tween(this)
                .to({ alpha: maxAlpha }, duration, easing)
                .start()
                .onComplete.add(function() {
                    this.alpha = 0;
                    this.onComplete.dispatch();
                }, this);

            return this;
        }

    }
}
