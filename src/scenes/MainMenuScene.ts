import { BaseLttpScene } from './BaseLttpScene';
import { Pool } from '../utility/Pool';
import { Save } from '../utility/Save';
import { ReturnOfGanonFont } from '../fonts/ReturnOfGanonFont';
import {
    AUDIO_MUSIC_VOLUME,
    AUDIO_EFFECT_VOLUME,
} from '../data/Constants';
import { GameScene } from './GameScene';

enum EActiveMenu
{
    Select,
    Register,
    Erase,
    Copy,
};

enum ESelection
{
    Slot1,
    Slot2,
    Slot3,
    Copy,
    Erase,
};

export class MainMenuScene extends BaseLttpScene
{
    static KEY = 'MainMenuScene';

    music: Phaser.Sound.BaseSound = null;

    selectGroup: Phaser.GameObjects.Container = null;
    registerGroup: Phaser.GameObjects.Container = null;
    charactersGroup: Phaser.GameObjects.Container = null;

    selectSound: Phaser.Sound.BaseSound = null;
    cursorSound: Phaser.Sound.BaseSound = null;
    eraseSound: Phaser.Sound.BaseSound = null;
    errorSound: Phaser.Sound.BaseSound = null;
    lowhpSound: Phaser.Sound.BaseSound = null;

    selectSprite: Phaser.GameObjects.Sprite = null;
    registerSprite: Phaser.GameObjects.Sprite = null;
    pointerSprite: Phaser.GameObjects.Sprite = null;
    fairySprite: Phaser.GameObjects.Sprite = null;

    linkSprites: Phaser.GameObjects.Sprite[] = null;

    heartsGroups: Phaser.GameObjects.Container[] = null;

    slotTexts: ReturnOfGanonFont[] = [];

    pname: ReturnOfGanonFont = null;

    heartpool: Phaser.GameObjects.Group = null;

    private active: EActiveMenu = null;
    private pnameI = 0;
    private selected = ESelection.Slot1;
    private selectedChar = new Phaser.Math.Vector2(0, 0);
    private delta = new Phaser.Math.Vector2(0, 0);

    private line: Phaser.GameObjects.Graphics = null;

    private saves: Save[] = [];

    private characters: ReturnOfGanonFont[][] = [];

    constructor()
    {
        super({ key: MainMenuScene.KEY });
    }

    create()
    {
        this.active = EActiveMenu.Select;
        this.selected = 0;
        this.selectedChar = new Phaser.Math.Vector2(6, 0);
        this.delta = new Phaser.Math.Vector2(16, 16);

        this.saves = null;

        this.music = this.sound.add('music_select', { volume: AUDIO_MUSIC_VOLUME, loop: true });

        // this.frames = this.anims.generateFrameNames('sprite_select');

        this.selectSound = this.sound.add('effect_menu_select', { volume: AUDIO_EFFECT_VOLUME });
        this.cursorSound = this.sound.add('effect_menu_select_cursor', { volume: AUDIO_EFFECT_VOLUME });
        this.eraseSound = this.sound.add('effect_menu_select_erase', { volume: AUDIO_EFFECT_VOLUME });
        this.errorSound = this.sound.add('effect_error', { volume: AUDIO_EFFECT_VOLUME });
        this.lowhpSound = this.sound.add('effect_lowhp', { volume: AUDIO_EFFECT_VOLUME });

        this.heartpool = this.add.group({
            defaultKey: 'sprite_gui',
        });

        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._onKeyboardDown, this);
        this.input.gamepad.on(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._onGamepadDown, this);

        this.events.on('shutdown', () =>
        {
            this.input.keyboard.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._onKeyboardDown, this);
            this.input.gamepad.off(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._onGamepadDown, this);
        });

        this._setupSelect();
        this._setupRegister();

        this.activate(EActiveMenu.Select);
    }

    moveSelection(dir: number)
    {
        if (this.active === EActiveMenu.Select)
        {
            if (dir === Phaser.DOWN)
            {
                this.selected++;
                this.selected %= 5;
            }
            else if (dir === Phaser.UP)
            {
                this.selected--;

                if (this.selected === -1)
                {
                    this.selected = 4;
                }
            }

            switch (this.selected)
            {
                case ESelection.Slot1:
                    this.fairySprite.y = 72;
                    break;

                case ESelection.Slot2:
                    this.fairySprite.y = 103;
                    break;

                case ESelection.Slot3:
                    this.fairySprite.y = 132;
                    break;

                case ESelection.Copy:
                    this.fairySprite.y = 177;
                    break;

                case ESelection.Erase:
                    this.fairySprite.y = 192;
                    break;
            }

            this.cursorSound.play();
        }
        else if (this.active === EActiveMenu.Register)
        {
            // move line around, and move text around
            switch (dir)
            {
                case Phaser.DOWN:
                    this.selectedChar.y++;
                    break;

                case Phaser.UP:
                    this.selectedChar.y--;
                    break;

                case Phaser.LEFT:
                    this.selectedChar.x--;
                    break;

                case Phaser.RIGHT:
                    this.selectedChar.x++;
                    break;
            }

            this.selectedChar.x = Phaser.Math.Clamp(this.selectedChar.x, 0, 28);
            this.selectedChar.y = Phaser.Math.Clamp(this.selectedChar.y, 0, 3);

            this.line.y = 132 + (this.selectedChar.y * this.delta.y);
            this.charactersGroup.x = -((this.selectedChar.x - 6) * this.delta.x);
        }
        else if (this.active === EActiveMenu.Erase)
        {
            // TODO: Implement ERASE
        }
        else if (this.active === EActiveMenu.Copy)
        {
            // TODO: Implement COPY
        }
    }

    complete()
    {
        this.scene.start(GameScene.KEY, this.saves[this.selected]);
    }

    select()
    {
        if (this.active === EActiveMenu.Select)
        {
            // select a save to play
            if (this.selected <= ESelection.Slot3)
            {
                if (!this.saves[this.selected].saveFileExists)
                {
                    this.activate(EActiveMenu.Register);
                }
                else
                {
                    this.complete();
                }
            }
            else if (this.selected === ESelection.Erase)
            {
                this.errorSound.play();
                return;
            }
            else if (this.selected === ESelection.Copy)
            {
                this.errorSound.play();
                return;
            }

            this.selectSound.play();
        }
        else if (this.active === EActiveMenu.Register)
        {
            // add letter
            let n = this.pname.text;
            const ch = this.characters[this.selectedChar.y][this.selectedChar.x];

            if (ch.name === 'end')
            {
                if (!n.trim())
                {
                    return this.activate(EActiveMenu.Select);
                }

                const ls = new Save(this.selected, n.split('').filter((ch: string, i: number) => (i % 2 === 0)).join(''));
                ls.save();

                this.selectSound.play();
                return this.activate(EActiveMenu.Select);
            }

            if (ch.name === 'left')
            {
                this.pnameI = Math.max(0, this.pnameI - 1);
                this.pointerSprite.x = 30 + (this.pnameI * 2 * this.pname.monospace);
                return;
            }

            if (ch.name === 'right')
            {
                this.pnameI = Math.min((n.length / 2), this.pnameI + 1);
                this.pointerSprite.x = 30 + (this.pnameI * 2 * this.pname.monospace);
                return;
            }

            // max length, replace other characters
            if (n.length === 11 || this.pnameI < (n.length / 2))
            {
                const i = this.pnameI * 2;

                n = n.substr(0, i) + ch.text + n.substr(i + 1);
            }
            // otherwise just add new character
            else
            {
                if (n.length)
                {
                    n += ' ';
                }

                n += ch.text;
            }

            this.pnameI = (this.pnameI + 1) % 6;

            this.pname.text = n;

            this.pointerSprite.x = 30 + (this.pnameI * this.pname.monospace);

            this.lowhpSound.play();
        }
        else if (this.active === EActiveMenu.Erase)
        {
            // TODO: Implement ERASE
        }
        else if (this.active === EActiveMenu.Copy)
        {
            // TODO: Implement COPY
        }
    }

    activate(menu: EActiveMenu)
    {
        this.selectGroup.visible = false;
        this.registerGroup.visible = false;

        this.active = menu;

        if (menu === EActiveMenu.Register)
        {
            this.registerGroup.visible = true;

            this.pname.text = '';
            this.pnameI = 0;
            this.pointerSprite.x = 30;
        }
        else if (menu === EActiveMenu.Select)
        {
            this.selectGroup.visible = true;

            const s = this.saves = [
                new Save(0),
                new Save(1),
                new Save(2),
            ];

            for (let i = 0; i < s.length; ++i)
            {
                const sv = s[i].load();
                const spr = this.linkSprites[i];
                const txt = this.slotTexts[i];

                txt.text = (i + 1) + '.' + (sv.saveFileExists ? sv.name : '');

                if (sv.saveFileExists)
                {
                    spr.visible = true;

                    if (sv.inventory.sword === 1 && sv.inventory.shield === 1)
                        spr.setFrame('link4.png');
                    else if (sv.inventory.shield === 1)
                        spr.setFrame('link3.png');
                    else if (sv.inventory.sword === 1)
                        spr.setFrame('link2.png');
                    else
                        spr.setFrame('link1.png');

                    this._renderHearts(this.heartsGroups[i], sv.health, sv.maxHealth);
                }
            }
        }
    }

    private _renderHearts(group: Phaser.GameObjects.Container, value: number, max: number)
    {
        let x = 0;
        let y = 20;
        const size = 16;
        const perRow = 10;

        let done = 0;

        for (let hp = value; hp > 0; --hp)
        {
            done++;

            const spr = this.heartpool.get(x, y + (hp < 1 ? 2 : 0));
            spr.setFrame(hp < 1 ? 'heart-half.png' : 'heart-full.png');
            spr.visible = true;

            if ((x / size) >= (perRow - 1))
            {
                x = 0;
                y += size;
            }
            else
            {
                x += size;
            }

            group.add(spr);
        }

        for (; done < max; ++done)
        {
            const spr = this.heartpool.get(x, y);

            spr.setFrame('heart-empty.png');
            spr.visible = true;

            if ((x / size) >= (perRow - 1))
            {
                x = 0;
                y += size;
            }
            else
            {
                x += size;
            }

            group.add(spr);
        }
    }

    private _setupSelect()
    {
        this.anims.create({
            key: 'flap',
            frames: [
                { key: 'sprite_select', frame: 'fairy1.png' },
                { key: 'sprite_select', frame: 'fairy2.png' },
            ],
            frameRate: 6,
            repeat: -1,
        });

        this.selectSprite = this.add.sprite(0, 0, 'sprite_select', 'select.png');
        this.selectSprite.name = 'select';

        this.fairySprite = this.add.sprite(27, 72, 'sprite_select', null);
        this.fairySprite.anims.play('flap');
        this.fairySprite.name = 'fairy';

        this.linkSprites = [
            this.add.sprite(52, 64, 'sprite_select', null),
            this.add.sprite(52, 96, 'sprite_select', null),
            this.add.sprite(52, 124, 'sprite_select', null),
        ];
        this.linkSprites[0].visible = false;
        this.linkSprites[0].name = 'link-1';
        this.linkSprites[1].visible = false;
        this.linkSprites[1].name = 'link-2';
        this.linkSprites[2].visible = false;
        this.linkSprites[2].name = 'link-3';

        this.heartsGroups = [
            this.add.container(142, 63),
            this.add.container(142, 93),
            this.add.container(142, 142),
        ];
        this.heartsGroups[0].name = 'hearts-1';
        this.heartsGroups[1].name = 'hearts-2';
        this.heartsGroups[2].name = 'hearts-3';

        const textGroup = this.add.container(0, 0);
        textGroup.name = 'text';

        textGroup.add(new ReturnOfGanonFont(this, 40, 25, 'PLAYER SELECT', 16));
        textGroup.add(new ReturnOfGanonFont(this, 50, 178, 'COPY  PLAYER', 16));
        textGroup.add(new ReturnOfGanonFont(this, 50, 193, 'ERASE PLAYER', 16));

        this.slotTexts = [
            new ReturnOfGanonFont(this, 72, 72, '1.', 16),
            new ReturnOfGanonFont(this, 72, 102, '2.', 16),
            new ReturnOfGanonFont(this, 72, 132, '3.', 16),
        ];
        textGroup.add(this.slotTexts);

        this.selectGroup = this.add.container(0, 0, [
            this.selectSprite,
            this.fairySprite,
            ...this.linkSprites,
            ...this.heartsGroups,
            textGroup,
        ]);
        this.selectGroup.name = 'select_container';
    }

    private _setupRegister()
    {
        this.pointerSprite = this.add.sprite(30, 88, 'sprite_select', 'pointer.png');
        this.pointerSprite.name = 'pointer';

        const textGroup = this.add.container(0, 0);
        textGroup.name = 'text';
        const lines = [
            'ABCDEFGHIJ  abcdefghij  01234',
            'KLMNOPQRST  klmnopqrst  56789',
            'UVWXYZDPC   uvwxyzDPC   EQPP ',
            '     <> =+       <> =+  <> =+',
        ];

        textGroup.add(new ReturnOfGanonFont(this, 40, 40, 'REGISTER  YOUR  NAME', 16));

        this.pname = new ReturnOfGanonFont(this, 30, 96, '', 16);
        textGroup.add(this.pname);

        // create all the characters
        this.charactersGroup = this.add.container(0, 0);
        this.charactersGroup.name = 'characters';
        textGroup.add(this.charactersGroup);
        this.characters = [];

        const sx = 32;
        const sy = 125;
        let cx = sx;
        let cy = sy;

        for (let y = 0; y < lines.length; ++y)
        {
            this.characters[y] = [];

            const line = lines[y].split('');

            for (let x = 0; x < line.length; ++x)
            {
                const txt = new ReturnOfGanonFont(this, cx, cy);
                this.charactersGroup.add(txt);

                this.characters[y][x] = txt;

                if (line[x] === '=')
                {
                    txt.text = 'END';
                    txt.name = 'end';
                }
                else if (line[x] === '+')
                {
                    txt.text = ' ';
                    txt.name = 'end';
                }
                else if (line[x] === '<')
                {
                    txt.text = '<';
                    txt.name = 'left';
                }
                else if (line[x] === '>')
                {
                    txt.text = '>';
                    txt.name = 'right';
                }
                else
                {
                    txt.text = line[x];
                }

                cx += this.delta.x;
            }

            cy += this.delta.y;
            cx = sx;
        }

        this.line = this.add.graphics({ x: 24, y: 132 });
        this.line.name = 'line';
        this.line.lineStyle(1, 0xffffff, 1);
        this.line.moveTo(0, 0);
        this.line.lineTo(624, 0);

        this.registerSprite = this.add.sprite(0, 0, 'sprite_select', 'register.png');
        this.registerSprite.name = 'register';

        this.registerGroup = this.add.container(0, 0, [
            this.pointerSprite,
            textGroup,
            this.line,
            this.registerSprite,
        ]);
        this.registerGroup.visible = false;
        this.registerGroup.name = 'register';
    }

    private _onGamepadDown(index: number, value: number, button: Phaser.Input.Gamepad.Button)
    {
        switch (index)
        {
            case Phaser.Input.Gamepad.Configs.XBOX_360.UP:
                this.moveSelection(Phaser.UP);
                break;

            case Phaser.Input.Gamepad.Configs.XBOX_360.DOWN:
                this.moveSelection(Phaser.DOWN);
                break;

            case Phaser.Input.Gamepad.Configs.XBOX_360.LEFT:
                this.moveSelection(Phaser.LEFT);
                break;

            case Phaser.Input.Gamepad.Configs.XBOX_360.RIGHT:
                this.moveSelection(Phaser.RIGHT);
                break;

            case Phaser.Input.Gamepad.Configs.XBOX_360.A:
            case Phaser.Input.Gamepad.Configs.XBOX_360.B:
            case Phaser.Input.Gamepad.Configs.XBOX_360.START:
                this.select();
                break;
        }
    }

    private _onKeyboardDown(event: KeyboardEvent)
    {
        switch (event.keyCode)
        {
            case Phaser.Input.Keyboard.KeyCodes.UP:
            case Phaser.Input.Keyboard.KeyCodes.W:
                this.moveSelection(Phaser.UP);
                break;

            case Phaser.Input.Keyboard.KeyCodes.DOWN:
            case Phaser.Input.Keyboard.KeyCodes.S:
                this.moveSelection(Phaser.DOWN);
                break;

            case Phaser.Input.Keyboard.KeyCodes.LEFT:
            case Phaser.Input.Keyboard.KeyCodes.A:
                this.moveSelection(Phaser.LEFT);
                break;

            case Phaser.Input.Keyboard.KeyCodes.RIGHT:
            case Phaser.Input.Keyboard.KeyCodes.D:
                this.moveSelection(Phaser.RIGHT);
                break;

            // case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
            //     this.move(value > 0 ? Phaser.DOWN : Phaser.UP);
            //     break;

            // case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
            //     this.move(value > 0 ? Phaser.RIGHT : Phaser.LEFT);
            //     break;

            case Phaser.Input.Keyboard.KeyCodes.ENTER:
            case Phaser.Input.Keyboard.KeyCodes.SPACE:
                this.select();
                break;
        }
    }
}
