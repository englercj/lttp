import Game from '../Game';
import Constants from '../data/Constants';

export default class MapOverlay extends Phaser.Group {
    game: Game;

    key: Phaser.BitmapData;

    onComplete: Phaser.Signal;

    private _darkenerBmd: Phaser.BitmapData;
    private _darkener: Phaser.Image;
    private _animator: Phaser.TileSprite;

    private _activeEffect: string;

    private _cachedCameraPos: Phaser.Point;

    constructor(game: Game) {
        super(game, null, 'map overlay');

        this.fixedToCamera = true;

        this._darkenerBmd = game.add.bitmapData(game.width, game.height);
        this._darkenerBmd.fill.apply(this._darkenerBmd, Constants.COLORS.BLACK);

        this._darkener = this._darkenerBmd.addToWorld();
        this._darkener.alpha = 0.5;
        this._darkener.name = 'darkener';

        this.add(this._darkener);

        this._animator = game.add.tileSprite(0, 0, game.width, game.height, 'sprite_overlays', null, this);
        this._animator.alpha = 0.8;
        this._animator.name = 'animator';
        this.add(this._animator);

        this._cachedCameraPos = new Phaser.Point(this.game.camera.view.x, this.game.camera.view.y);

        // add rain animation
        this._animator.animations.add('rain', [
            'rain/rain1.png',
            'rain/rain2.png',
            'rain/rain3.png',
            'rain/rain4.png',
        ], 18, true);

        // this.deactivate();
    }

    activate(anim: string) {
        // this.deactivate();

        this.visible = true;

        this._activeEffect = anim;

        switch (anim) {
            case 'rain':
                this._animator.animations.play('rain');
                this._animator.visible = true;
                this._darkener.visible = true;
        }
    }

    deactivate() {
        this._animator.animations.stop();
        this._animator.visible = false;

        this._darkener.visible = false;

        this.visible = false;
    }

    update() {
        if (this.game.camera.view.x !== this._cachedCameraPos.x) {
            const diff = this.game.camera.view.x - this._cachedCameraPos.x;

            this._cachedCameraPos.x = this.game.camera.view.x;

            this._animator.tilePosition.x -= diff * Constants.EFFECT_OVERLAY_SCROLL_FACTOR;
        }

        if (this.game.camera.view.y !== this._cachedCameraPos.y) {
            const diff = this.game.camera.view.y - this._cachedCameraPos.y;

            this._cachedCameraPos.y = this.game.camera.view.y;

            this._animator.tilePosition.y -= diff * Constants.EFFECT_OVERLAY_SCROLL_FACTOR;
        }
    }
}
