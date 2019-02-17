import { ReturnOfGanonFont } from '../fonts/ReturnOfGanonFont';
import { AUDIO_EFFECT_VOLUME } from '../data/Constants';

const rgxNewlines = /\n/g;
const DEFAULT_TYPE_SPEED = 60;

export class Dialog extends Phaser.GameObjects.Container
{
    static EVT_TYPING_COMPLETE: string = 'typing_complete';

    openSound: Phaser.Sound.BaseSound;
    letterSound: Phaser.Sound.BaseSound;

    frameSprite: Phaser.GameObjects.Sprite;

    font: ReturnOfGanonFont;

    text: string = '';
    queue: string[] = [];
    range: number[] = [0, 1]; // start pos, length

    fastSpeed: number = 15;
    typeSpeed: number = DEFAULT_TYPE_SPEED;
    speed: number = 60;

    speedCooldown: number = 250;

    padding: number = 5;

    typing: boolean = false;

    autoAdvance: boolean;

    buffer: Phaser.GameObjects.RenderTexture;
    bufferScroll: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene, x: number, y: number, showFrame: boolean = true, autoAdvance: boolean = false)
    {
        super(scene, x, y);

        this.autoAdvance = autoAdvance;

        // load sound
        this.openSound = scene.sound.add('effect_pause_close', { volume: AUDIO_EFFECT_VOLUME });
        this.letterSound = scene.sound.add('effect_text_letter', { volume: AUDIO_EFFECT_VOLUME });

        // setup visibility
        this.visible = false;

        // add background
        this.frameSprite = scene.add.sprite(0, 0, 'sprite_gui', 'dialog.png');
        this.frameSprite.name = 'frame';
        this.frameSprite.visible = showFrame;
        this.add(this.frameSprite);

        // add font
        this.font = new ReturnOfGanonFont(scene, 8, 8);
        this.font.name = 'text';
        this.add(this.font);

        // initialize the render buffer
        this.buffer = scene.add.renderTexture(this.font.x, this.font.y, scene.cameras.main.width, scene.cameras.main.height);
        this.buffer.name = 'buffer';

        this.bufferScroll = new Phaser.Math.Vector2();
    }

    show(text: (string|string[]), speed: number = DEFAULT_TYPE_SPEED, insertNewlines: boolean = true, playSound: boolean = true)
    {
        this.visible = true;

        this.range[0] = 0;
        this.range[1] = 1;

        this.speed = speed;
        this.text = '';
        this.font.text = '';

        if (playSound)
        {
            this.openSound.play();
        }

        if (text instanceof Array)
        {
            for (let i = 0; i < text.length; ++i)
            {
                this.append(text[i], insertNewlines);
            }
        }
        else
        {
            this.append(text, insertNewlines);
        }

        return this;
    }

    hide()
    {
        this.visible = false;

        return this;
    }

    append(text: string, insertNewlines: boolean = true)
    {
        let newText = insertNewlines ? this._insertNewlines(text) : text;

        if (newText.charAt(newText.length - 1) !== '\n')
        {
            newText += '\n';
        }

        if (!this.typing)
        {
            this.text += newText;
            this._type();
        }
        else
        {
            this.queue.push(newText);
        }

        return this;
    }

    advance()
    {
        if (this.typing)
        {
            this.speedUp();
        }
        else if (this.queue.length)
        {
            this.append(this.queue.pop());
        }
    }

    speedUp()
    {
        this.speed = this.fastSpeed;

        this.scene.time.addEvent({
            delay: this.speedCooldown,
            callback: () => { this.speed = this.typeSpeed; },
        });

        return this;
    }

    // TODO: This needs to be cleaned up quite a bit
    private _type()
    {
        const newlines = this.font.text.match(rgxNewlines);

        if ((this.range[0] + this.range[1]) > this.text.length)
        {
            this.typing = false;

            this.font.visible = true;
            this.buffer.clear();
            this.buffer.draw(this.font, this.bufferScroll.x, this.bufferScroll.y);
            this.buffer.visible = true;
            this.font.visible = false;

            if (!this.queue.length)
            {
                this.emit(Dialog.EVT_TYPING_COMPLETE);
            }
            else if (this.autoAdvance)
            {
                this.append(this.queue.pop());
            }
        }
        else if (newlines && newlines.length && newlines.length === 3)
        {
            this.typing = true;

            this.font.visible = true;
            this.buffer.clear();
            this.buffer.draw(this.font, this.bufferScroll.x, this.bufferScroll.y);
            this.buffer.visible = true;
            this.font.visible = false;

            this.bufferScroll.y--;

            if (this.bufferScroll.y > -this.font.fontSize)
            {
                this.scene.time.addEvent({
                    delay: this.fastSpeed,
                    callback: this._type,
                    callbackScope: this,
                });
            }
            else
            {
                const newStart = this.text.indexOf('\n', this.range[0]);

                this.range[1] = this.range[1] - (newStart - this.range[0]) - 1;
                this.range[0] = newStart + 1;

                this.font.text = this.text.substr(this.range[0], this.range[1] - 1);

                this.bufferScroll.y = 0;

                this.scene.time.addEvent({
                    delay: this.speed,
                    callback: this._type,
                    callbackScope: this,
                });
            }
        }
        else
        {
            this.typing = true;

            this.font.visible = true;
            this.buffer.visible = false;

            this.font.text = this.text.substr(this.range[0], this.range[1]);

            this.range[1]++;

            this.scene.time.addEvent({
                delay: this.speed,
                callback: this._type,
                callbackScope: this,
            });
        }
    }

    private _getPreviousSpace(str: string, i: number)
    {
        let sub = 0;

        do
        {
            if (str[i - sub] === ' ')
            {
                return i - sub;
            }

            sub++;
        }
        while ((i + sub) < str.length || (i - sub) > 0);

        return 0;
    }

    private _insertNewlines(text: string)
    {
        let i = 30;
        while (text[i])
        {
            const sp = this._getPreviousSpace(text, i);
            text = [text.slice(0, sp), text.slice(sp + 1)].join('\n');
            i += 30;
        }

        return text;
    }
}
