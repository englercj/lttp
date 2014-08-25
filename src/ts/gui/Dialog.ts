var dialogGuid = 0;

module Lttp.Gui {
    export class Dialog extends Phaser.Group {
        openSound: Phaser.Sound;

        frameSprite: Phaser.Sprite;

        font: Fonts.ReturnOfGanon;

        doneCb: () => void;

        text: string = '';
        range: number[] = [0, 1]; //start pos, length

        fastSpeed: number = 15;
        typeSpeed: number = 60;
        speed: number = 60;

        speedCooldown: number = 250;

        padding: number = 5;

        constructor(game: Phaser.Game, parent?: any) {
            super(game, parent, 'Dialog_' + (++dialogGuid));

            // load sound
            this.openSound = this.game.add.audio('effect_pause_close', Data.Constants.AUDIO_MUSIC_VOLUME);

            // setup visibility
            this.position.set(102, 438);
            this.visible = false;

            // add background
            this.frameSprite = this.game.add.sprite(0, 0, 'sprite_gui', 'dialog.png', this);

            //add font
            this.font = new Fonts.ReturnOfGanon(game, 8, 8);
            // this.font.scale.set(0.5);
            this.add(this.font);
        }

        show(text: string, speed?: number, showFrame?: boolean, cb?: () => void) {
            this.visible = true;
            this.openSound.play();

            this.range[0] = 0;
            this.range[1] = 1;

            this.text = text;
            this.speed = speed || this.typeSpeed;
            this.doneCb = null;

            this.frameSprite.visible = showFrame !== undefined ? showFrame : true;

            // replace a space with a newline every 30 characters
            var i = 30;
            while(this.text[i]) {
                var sp = this._getPreviousSpace(this.text, i);
                this.text = [this.text.slice(0, sp), this.text.slice(sp + 1)].join('\n');
                i += 30;
            }

            this.font.text = '';

            var self = this;
            this._type(function() {
                setTimeout(function() {
                    self.doneCb = cb;
                }, self.speedCooldown);
            });

            return this;
        }

        hide() {
            this.visible = false;

            return this;
        }

        advance() {
            // done typing
            if(this.doneCb) {
                this.doneCb();
                this.doneCb = null;
            }
            // speed up typing
            else {
                this.speed = this.fastSpeed;

                var self = this;
                setTimeout(function() {
                    self.speed = self.typeSpeed;
                }, this.speedCooldown);
            }

            return this;
        }

        private _type(cb: () => void) {
            this.font.text = this.text.substr(this.range[0], this.range[1]);

            this.range[1]++;

            //TODO: Messages longer than 1 box should bump up the text

            if(this.range[1] > this.text.length) {
                if(cb) cb();
            } else {
                setTimeout(this._type.bind(this, cb), this.speed);
            }
        }

        private _getPreviousSpace(str, i) {
            var sub = 0;

            do {
                if(str[i - sub] === ' ') {
                    return i - sub;
                }

                sub++;
            } while((i + sub) < str.length || (i - sub) > 0);
        }
    }
}
