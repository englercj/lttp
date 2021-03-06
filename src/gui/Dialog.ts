import Game from '../Game';
import Constants from '../data/Constants';
import ReturnOfGanon from '../fonts/ReturnOfGanon';

const rgxNewlines = /\n/g;

export default class Dialog extends Phaser.Group {
    game: Game;

    openSound: Phaser.Sound;
    letterSound: Phaser.Sound;

    frameSprite: Phaser.Sprite;

    font: ReturnOfGanon;

    text: string = '';
    queue: string[] = [];
    range: number[] = [0, 1]; // start pos, length

    fastSpeed: number = 15;
    typeSpeed: number = 60;
    speed: number = 60;

    speedCooldown: number = 250;

    padding: number = 5;

    typing: boolean = false;

    autoAdvance: boolean;

    buffer: Phaser.RenderTexture;
    bufferSprite: Phaser.Sprite;
    bufferScroll: Phaser.Point;

    onTypingComplete: Phaser.Signal;

    constructor(game: Game, parent?: any, showFrame: boolean = true, autoAdvance: boolean = false) {
        super(game, parent, 'dialog');

        this.autoAdvance = autoAdvance;

        // load sound
        this.openSound = this.game.add.audio('effect_pause_close', Constants.AUDIO_EFFECT_VOLUME);
        this.letterSound = this.game.add.audio('effect_text_letter', Constants.AUDIO_EFFECT_VOLUME);

        // setup visibility
        // this.position.set(102, 438);
        this.visible = false;

        // add background
        this.frameSprite = this.game.add.sprite(0, 0, 'sprite_gui', 'dialog.png', this);
        this.frameSprite.name = 'frame';
        this.frameSprite.visible = showFrame;

        // add font
        this.font = new ReturnOfGanon(game, 8, 8);
        this.font.name = 'text';
        this.add(this.font);

        // initialize the render buffer
        this.buffer = game.add.renderTexture(game.width, game.height);
        this.bufferScroll = new Phaser.Point();
        this.bufferSprite = game.add.sprite(0, 0, this.buffer, null, this);
        this.bufferSprite.name = 'buffer';
        this.bufferSprite.position.set(this.font.position.x, this.font.position.y);

        this.onTypingComplete = new Phaser.Signal();
    }

    show(text: (string|string[]), speed?: number, insertNewlines: boolean = true, playSound: boolean = true) {
        this.visible = true;

        this.range[0] = 0;
        this.range[1] = 1;

        this.speed = speed || this.typeSpeed;
        this.text = '';
        this.font.text = '';

        if (playSound) {
            this.openSound.play();
        }

        if (Array.isArray(text)) {
            for (let i = 0; i < text.length; ++i) {
                this.append(text[i], insertNewlines);
            }
        }
        else {
            this.append(text, insertNewlines);
        }

        return this;
    }

    hide() {
        this.visible = false;

        return this;
    }

    append(text: string, insertNewlines: boolean = true) {
        let newText = insertNewlines ? this._insertNewlines(text) : text;

        if (newText.charAt(newText.length - 1) !== '\n') {
            newText += '\n';
        }

        if (!this.typing) {
            this.text += newText;
            this._type();
        }
        else {
            this.queue.push(newText);
        }

        return this;
    }

    advance() {
        if (this.typing) {
            this.speedUp();
        }
        else if (this.queue.length) {
            this.append(this.queue.pop());
        }
    }

    speedUp() {
        this.speed = this.fastSpeed;

        Game.timer.add(this.speedCooldown, () => { this.speed = this.typeSpeed; }, this);

        return this;
    }

    // TODO: This needs to be cleaned up quite a bit
    private _type() {
        const newlines = this.font.text.match(rgxNewlines);

        if ((this.range[0] + this.range[1]) > this.text.length) {
            this.typing = false;

            this.font.visible = true;
            this.buffer.renderXY(this.font, this.bufferScroll.x, this.bufferScroll.y, true);
            this.bufferSprite.visible = true;
            this.font.visible = false;

            if (!this.queue.length) {
                this.onTypingComplete.dispatch();
            }
            else if (this.autoAdvance) {
                this.append(this.queue.pop());
            }
        }
        else if (newlines && newlines.length && newlines.length === 3) {
            this.typing = true;

            this.font.visible = true;
            this.buffer.renderXY(this.font, this.bufferScroll.x, this.bufferScroll.y, true);
            this.bufferSprite.visible = true;
            this.font.visible = false;

            this.bufferScroll.y--;

            if (this.bufferScroll.y > -this.font.fontSize) {
                Game.timer.add(this.fastSpeed, this._type, this);
            }
            else {
                const newStart = this.text.indexOf('\n', this.range[0]);

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

    private _getPreviousSpace(str: string, i: number) {
        let sub = 0;

        do {
            if (str[i - sub] === ' ') {
                return i - sub;
            }

            sub++;
        } while ((i + sub) < str.length || (i - sub) > 0);
    }

    private _insertNewlines(text: string) {
        let i = 30;
        while (text[i]) {
            const sp = this._getPreviousSpace(<string>text, i);
            text = [text.slice(0, sp), text.slice(sp + 1)].join('\n');
            i += 30;
        }

        return text;
    }
}
