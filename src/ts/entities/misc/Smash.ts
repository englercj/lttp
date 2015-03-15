module Lttp.Entities.Misc {
    export class Smash extends Entities.Entity {

        grassSound: Phaser.Sound;
        smashSound: Phaser.Sound;

        constructor(game: Game) {
            super(game, 'sprite_particles', false);

            this.grassSound = game.add.sound('effect_grass_cut', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.smashSound = game.add.sound('effect_smash', Data.Constants.AUDIO_EFFECT_VOLUME);

            this.events.onAnimationComplete.add(this._done, this);
            this.events.onAnimationStart.add(this._start, this);

            this._addAnimations();
        }

         private _addAnimations() {
            this._addSlices('pot', 0, 0, 0, 7);
            this._addSlices('grass', 0, 8, 1, 5);
            this._addSlices('grass_pink', 1, 6, 2, 3);
            this._addSlices('rock', 2, 4, 3, 1);
            this._addSlices('grass_white', 3, 2, 3, 9);
            this._addSlices('grass_brown', 4, 0, 4, 7);
            this._addSlices('grass_dark', 4, 8, 5, 6);
        }

        private _addSlices(name, sx, sy, tx, ty) {
            var frames = [];

            while(sx !== tx || sy !== ty) {
                frames.push('slice_' + sx + '_' + sy + '.png');

                sy++

                if(sy > 9) {
                    sx++;
                    sy = 0;
                }
            }

            this.animations.add(name, frames, 12);
        }

        private _start(animation: Phaser.Animation) {
            if(animation.name.indexOf('grass') !== -1) {
                this.grassSound.play();
            }
            else {
                this.smashSound.play();
            }
        }

        private _done(animation: Phaser.Animation) {
            this.visible = false;
        }

    }
}
