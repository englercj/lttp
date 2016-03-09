import Game from '../Game';
import Constants from '../data/Constants';

export default class ScreenFlash extends Phaser.BitmapData {
    game: Game;

    onComplete: Phaser.Signal;

    private _worldObject: Phaser.Image;

    constructor(game: Game, color?: TColorRGBA) {
        super(game, '', game.width, game.height);

        this._worldObject = this.addToWorld();
        this._worldObject.alpha = 0;

        this.onComplete = new Phaser.Signal();

        this.color = color || Constants.COLORS.WHITE;
    }

    flash(maxAlpha: number = 1, duration: number = 100, easing: any = Phaser.Easing.Linear.None): ScreenFlash {
        this.game.add.tween(this._worldObject)
            .to({ alpha: maxAlpha }, duration, easing)
            .start()
            .onComplete.addOnce(() => {
                this._worldObject.alpha = 0;
                this.onComplete.dispatch(this);
            }, this);

        return this;
    }

    set color(c: TColorRGBA) {
        this.fill(c[0], c[1], c[2], c[3]);
    }

    set alpha(v: number) {
        this._worldObject.alpha = v;
    }
}
