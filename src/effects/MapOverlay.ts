module Lttp.Effects {
    export class MapOverlay extends Phaser.Group {

        key: Phaser.BitmapData;

        onComplete: Phaser.Signal;

        private _darkener: Phaser.TileSprite;
        private _animator: Phaser.Sprite;

        private _activeEffect: string;

        constructor(game: Phaser.Game) {
            super(game);

            this.fixedToCamera = true;

            this._darkener = game.add.tileSprite(0, 0, Data.Constants.GAME_WIDTH, Data.Constants.GAME_HEIGHT, PIXI.TextureCache['image_black']);
            this._darkener.alpha = 0.5;
            this.add(this._darkener);

            this._animator = game.add.sprite(0, 0, 'sprite_overlays', null, this);
            this._animator.alpha = 0.8;
            this.add(this._animator);

            // add rain animation
            this._animator.animations.add('rain', [
                'rain/rain1.png',
                'rain/rain2.png',
                'rain/rain3.png',
                'rain/rain4.png'
            ], 18, true);

            // this.deactivate();
        }

        activate(anim: string) {
            // this.deactivate();

            this.visible = true;

            this._activeEffect = anim;

            switch(anim) {
                case 'rain':
                    this._animator.animations.play('rain');
                    this._animator.visible = true;
                    this._darkener.visible = true;
            }
        }

        deactivate() {
            // this._animator.animations.stop();
            // this._animator.visible = false;
            //
            // this._darkener.visible = false;
            //
            // this.visible = false;
        }

    }
}
