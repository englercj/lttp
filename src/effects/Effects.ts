module Lttp.Effects {
    export class Effects extends Phaser.Plugin {

        game: Game;

        private _boundsCache: Phaser.Rectangle;

        private _shakeWorldTime: number = 20;
        private _shakeWorldMax: number = 20;

        private _overScales: any[] = [];
        private _overScalesCounter = 0;

        private _screenFlashPool: ScreenFlash[] = [];

        constructor(game: Game) {
            super(game, null);

            this._boundsCache = Phaser.Utils.extend(false, {}, game.world.bounds);
        }

        /**
         * Begins the screen shake effect.
         *
         * @param [duration=20] {number} The duration of the screen shake
         * @param [strength=20] {number} The strength of the screen shake
         */
        shakeScreen(duration: number, strength: number) {
            this._shakeWorldTime = duration || 20;
            this._shakeWorldMax = strength || 20;

            this.game.world.setBounds(
                this._boundsCache.x - this._shakeWorldMax,
                this._boundsCache.y - this._shakeWorldMax,
                this._boundsCache.width + this._shakeWorldMax,
                this._boundsCache.height + this._shakeWorldMax
            );
        }

        /**
         * Flashes a color to the screen.
         *
         * @param color - The color to use for the flash.
         * @param maxAlpha - The max alpha to flash to.
         * @param duration - The duration of the flash.
         */
        flashScreen(color: string = 'white', duration?: number, maxAlpha: number = 0, easing?) {
            var obj = this._screenFlashPool.pop() || this._createScreenFlashForPool();

            obj.color = color;
            obj.alpha = 1;
            obj.flash(maxAlpha, duration, easing);

            return obj;
        }

        /**
         * Fades the screen to a color.
         *
         * @param color - The color to use for the flash.
         * @param maxAlpha - The max alpha to flash to.
         * @param duration - The duration of the flash.
         */
        fadeScreen(color: string = 'white', duration?: number, maxAlpha: number = 1, easing?) {
            var obj = this._screenFlashPool.pop() || this._createScreenFlashForPool();

            obj.color = color;
            obj.alpha = 0;
            obj.flash(maxAlpha, duration, easing);

            return obj;
        }

        private _createScreenFlashForPool(): ScreenFlash {
            var obj = new ScreenFlash(this.game);

            obj.onComplete.add(this._onFlashComplete, this);

            return obj;
        }

        private _onFlashComplete(obj: ScreenFlash) {
            this._screenFlashPool.push(obj);
        }

        /**
         * Creates the over scale effect on the given object.
         *
         * @param object - The object to over scale.
         * @param scale - The scale amount to overscale by.
         * @param initialScale - The initial scale of the object.
         *
         */
        overScale(object: Phaser.Sprite, scale: number = 1.5, initialScale?: Phaser.Point) {
            initialScale = initialScale || object.scale.clone();

            this._overScales.push({
                object: object,
                cache: initialScale,
                scale: scale
            });
        }

        /**
         * Creates the jelly effect on the given object
         *
         * @param object - The object to gelatinize.
         * @param strength - The strength of the effect.
         * @param delay - The delay of the snap-back tween. 50ms are automaticallly added to whatever the delay amount is.
         * @param initialScale - The initial scale of the object.
         */
        jelly(object: Phaser.Sprite, strength: number = 0.2, delay: number = 0, initialScale?: Phaser.Point) {
            initialScale = initialScale || object.scale.clone();

            this.game.add.tween(object.scale)
                .to({ x: initialScale.x + (initialScale.x * strength) }, 50, Phaser.Easing.Quadratic.InOut, true, delay)
                .to({ x: initialScale.x }, 600, Phaser.Easing.Elastic.Out, true)
                .start();

            this.game.add.tween(object.scale)
                .to({ y: initialScale.y + (initialScale.y * strength)}, 50, Phaser.Easing.Quadratic.InOut, true, delay + 50)
                .to({ y: initialScale.y }, 600, Phaser.Easing.Elastic.Out, true)
                .start();
        }

        /**
         * Creates the mouse stretch effect on the given object
         *
         * @param object - The object to mouse stretch.
         * @param strength - The strength of the effect.
         * @param initialScale - The initial scale of the object.
         */
        mouseStretch(object: Phaser.Sprite, strength: number = 0.5, initialScale?: Phaser.Point) {
            initialScale = initialScale || object.scale.clone();

            object.scale.x = initialScale.x + (Math.abs(object.x - this.game.input.activePointer.x) / 100) * strength;
            object.scale.y = initialScale.y + (initialScale.y * strength) - (object.scale.x * strength);
        }

        /**
         * Runs the core update function and causes screen shake and overscaling effects to occur
         * if they are queued to do so.
         */
        update() {
            var scaleObj;

            // screen shake
            if (this._shakeWorldTime > 0) {
                var magnitude = (this._shakeWorldTime / this._shakeWorldMax) * this._shakeWorldMax;
                var x = this.game.rnd.integerInRange(-magnitude, magnitude);
                var y = this.game.rnd.integerInRange(-magnitude, magnitude);

                this.game.camera.x = x;
                this.game.camera.y = y;

                this._shakeWorldTime--;

                if (this._shakeWorldTime <= 0) {
                    this.game.world.setBounds(this._boundsCache.x, this._boundsCache.x, this._boundsCache.width, this._boundsCache.height);
                }
            }

            // over scales
            for (var i = this._overScales.length - 1; i >= 0; --i) {
                scaleObj = this._overScales[i];

                if (scaleObj.scale > 0.01) {
                    scaleObj.object.scale.x = scaleObj.scale * scaleObj.cache.x;
                    scaleObj.object.scale.y = scaleObj.scale * scaleObj.cache.y;
                    scaleObj.scale -= this.game.time.elapsed * scaleObj.scale * 0.35;
                }
                else {
                    scaleObj.object.scale.x = scaleObj.cache.x;
                    scaleObj.object.scale.y = scaleObj.cache.y;

                    this._overScales.splice(i, 1);
                }
            }
        }
    }
}
