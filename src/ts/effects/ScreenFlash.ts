module Lttp.Effects {
    export class ScreenFlash extends Phaser.Sprite {

        key: Phaser.BitmapData;

        onComplete: Phaser.Signal;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, game.add.bitmapData(game.width, game.height, '', true));

            this.color = 'white';

            this.alpha = 0;

            this.onComplete = new Phaser.Signal();
        }

        flash(maxAlpha: number = 1, duration: number = 100, easing: any = Phaser.Easing.Linear.None): ScreenFlash {
            this.game.add.tween(this)
                .to({ alpha: maxAlpha }, duration, easing)
                .start()
                .onComplete.addOnce(function() {
                    this.alpha = 0;
                    this.onComplete.dispatch(this);
                }, this);

            return this;
        }

        get color(): string {
            return this.key.ctx.fillStyle;
        }
        set color(theColor: string) {
            this.key.ctx.fillStyle = theColor || 'white';
            this.key.ctx.fillRect(0, 0, this.game.width, this.game.height);
        }

    }
}
