var rgxNewlines = /\n/g;

module Lttp.Gui {
    export class Dialog extends Phaser.Group {
        openSound: Phaser.Sound;
        letterSound: Phaser.Sound;

        frameSprite: Phaser.Sprite;

        font: Fonts.ReturnOfGanon;

        text: string = '';
        range: number[] = [0, 1]; //start pos, length

        fastSpeed: number = 15;
        typeSpeed: number = 60;
        speed: number = 60;

        speedCooldown: number = 250;

        padding: number = 5;

        typing: boolean = false;

        buffer: Phaser.RenderTexture;
        bufferSprite: Phaser.Sprite;
        bufferScroll: Phaser.Point;

        onTypingComplete: Phaser.Signal;

        constructor(game: Phaser.Game, parent?: any, showFrame: boolean = true) {
            super(game, parent);

            // load sound
            this.openSound = this.game.add.audio('effect_pause_close', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.letterSound = this.game.add.audio('effect_text_letter', Data.Constants.AUDIO_EFFECT_VOLUME);

            // setup visibility
            // this.position.set(102, 438);
            this.visible = false;

            // add background
            this.frameSprite = this.game.add.sprite(0, 0, 'sprite_gui', 'dialog.png', this);
            this.frameSprite.name = 'frame';
            this.frameSprite.visible = showFrame;

            // add font
            this.font = new Fonts.ReturnOfGanon(game, 8, 8, '', 0, 32);
            this.font.name = 'text';
            this.font.scale.set(0.5, 0.5);
            this.add(this.font);

            // initialize the render buffer
            this.buffer = game.add.renderTexture(348, 92); // 174, 46
            this.bufferScroll = new Phaser.Point(0, 0);
            this.bufferSprite = game.add.sprite(0, 0, this.buffer, null, this);
            this.bufferSprite.name = 'buffer';
            this.bufferSprite.scale.set(0.5, 0.5);
            this.bufferSprite.position.set(this.font.position.x, this.font.position.y);

            this.onTypingComplete = new Phaser.Signal();
        }

        show(text: string, speed?: number, insertNewlines: boolean = true, playSound: boolean = true, cb?: () => void) {
            this.visible = true;

            this.range[0] = 0;
            this.range[1] = 1;

            this.text = insertNewlines ? this._insertNewlines(text) : text;
            this.speed = speed || this.typeSpeed;
            this.font.text = '';

            if (this.text.charAt(this.text.length - 1) !== '\n') {
                this.text += '\n';
            }

            if (playSound) {
                this.openSound.play();
            }

            this._type();

            return this;
        }

        hide() {
            this.visible = false;

            return this;
        }

        append(text: string, insertNewlines: boolean = true) {
            this.text += insertNewlines ? this._insertNewlines(text) : text;

            if (this.text.charAt(this.text.length - 1) !== '\n') {
                this.text += '\n';
            }

            if (!this.typing) {
                this._type();
            }

            return this;
        }

        speedUp() {
            this.speed = this.fastSpeed;

            Game.timer.add(this.speedCooldown, () => { this.speed = this.typeSpeed }, this);

            return this;
        }

        // TODO: This needs to be cleaned up quite a bit
        private _type() {
            var newlines = this.font.text.match(rgxNewlines);

            if((this.range[0] + this.range[1]) > this.text.length) {
                this.typing = false;

                this.font.visible = true;
                this.buffer.render(this.font, this.bufferScroll, true);
                this.bufferSprite.visible = true;
                this.font.visible = false;

                this.onTypingComplete.dispatch();
            }
            else if (newlines && newlines.length && newlines.length === 3) {
                this.typing = true;

                this.font.visible = true;
                this.buffer.render(this.font, this.bufferScroll, true);
                this.bufferSprite.visible = true;
                this.font.visible = false;

                this.bufferScroll.y -= 2;

                if (this.bufferScroll.y > -32) {
                    Game.timer.add(this.fastSpeed, this._type, this);
                } else {
                    var newStart = this.text.indexOf('\n', this.range[0]);

                    this.range[1] = this.range[1] - (newStart - this.range[0]) - 1;
                    this.range[0] = newStart + 1;

                    this.font.text = this.text.substr(this.range[0], this.range[1] - 1);

                    this.bufferScroll.y = 0;

                    Game.timer.add(this.speed, this._type, this);
                }
            }
            else {
                this.typing = true;

                this.font.visible = true;
                this.bufferSprite.visible = false;

                this.font.text = this.text.substr(this.range[0], this.range[1]);

                this.range[1]++;

                Game.timer.add(this.speed, this._type, this);
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

        private _insertNewlines(text: string) {
            var i = 30;
            while(text[i]) {
                var sp = this._getPreviousSpace(text, i);
                text = [text.slice(0, sp), text.slice(sp + 1)].join('\n');
                i += 30;
            }

            return text;
        }
    }
}
