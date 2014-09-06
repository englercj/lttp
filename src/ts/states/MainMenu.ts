/// <reference path="State.ts" />

module Lttp.States {
    export enum MainMenuActiveMenu {
        SELECT,
        REGISTER,
        ERASE,
        COPY
    };

    export class MainMenu extends State {

        private active: MainMenuActiveMenu;
        private pnameI: number;
        private selected: number;
        private selectedChar: Phaser.Point;
        private delta: Phaser.Point;

        private line: Phaser.Graphics;

        private saves: Utility.PlayerSave[];

        private characters: Fonts.ReturnOfGanon[][];

        music: Phaser.Sound;

        frames: Phaser.FrameData;

        selectGroup: Phaser.Group;
        registerGroup: Phaser.Group;
        charactersGroup: Phaser.Group;

        selectSound: Phaser.Sound;
        cursorSound: Phaser.Sound;
        eraseSound: Phaser.Sound;
        errorSound: Phaser.Sound;
        lowhpSound: Phaser.Sound;

        selectSprite: Phaser.Sprite;
        registerSprite: Phaser.Sprite;
        pointerSprite: Phaser.Sprite;
        fairySprite: Phaser.Sprite;
        linkSprite1: Phaser.Sprite;
        linkSprite2: Phaser.Sprite;
        linkSprite3: Phaser.Sprite;

        heartsGroup1: Phaser.Group;
        heartsGroup2: Phaser.Group;
        heartsGroup3: Phaser.Group;

        slotText1: Fonts.ReturnOfGanon;
        slotText2: Fonts.ReturnOfGanon;
        slotText3: Fonts.ReturnOfGanon;

        pname: Fonts.ReturnOfGanon;

        fontpool: Utility.Pool<Fonts.ReturnOfGanon>;
        heartpool: Utility.Pool<Phaser.Sprite>;

        preload() {
            super.preload();
        }

        create() {
            super.create();

            this.active = MainMenuActiveMenu.SELECT;
            this.selected = 0;
            this.selectedChar = new Phaser.Point(6, 0);
            this.delta = new Phaser.Point(16, 16);

            this.saves = null;

            this.music = this.add.audio('music_select', Data.Constants.AUDIO_MUSIC_VOLUME, true);

            this.frames = this.cache.getFrameData('sprite_select');

            this.selectSound = this.add.audio('effect_menu_select', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.cursorSound = this.add.audio('effect_menu_select_cursor', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.eraseSound = this.add.audio('effect_menu_select_erase', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.errorSound = this.add.audio('effect_error', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.lowhpSound = this.add.audio('effect_lowhp', Data.Constants.AUDIO_EFFECT_VOLUME);

            this.fontpool = new Utility.Pool<Fonts.ReturnOfGanon>(this.game, Fonts.ReturnOfGanon);
            this.heartpool = new Utility.Pool<Phaser.Sprite>(this.game, Phaser.Sprite);

            this.pnameI = 0;

            this.onInputDown.add(this._onInputDown, this);
            this.onInputUp.add(this._onInputUp, this);

            this._setupSelect();
            this._setupRegister();

            this.activate(MainMenuActiveMenu.SELECT);
        }

        move(direction: number) {
            if (this.active === MainMenuActiveMenu.SELECT) {
                if(direction === Phaser.DOWN) {
                    this.selected++;
                    this.selected %= 5;
                }
                else if(direction === Phaser.UP) {
                    this.selected--;

                    if(this.selected === -1) {
                        this.selected = 4;
                    }
                }

                switch(this.selected) {
                    case 0: //slot 1
                        this.fairySprite.position.y = 72;
                        break;

                    case 1: //slot 2
                        this.fairySprite.position.y = 103;
                        break;

                    case 2: //slot 3
                        this.fairySprite.position.y = 132;
                        break;

                    case 3: //copy
                        this.fairySprite.position.y = 177;
                        break;

                    case 4: //erase
                        this.fairySprite.position.y = 192;
                        break;
                }

                this.cursorSound.play();
            }
            else if (this.active === MainMenuActiveMenu.REGISTER) {
                //move line around, and move text around
                switch(direction) {
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

                this.selectedChar.clampY(0, 3);
                this.selectedChar.clampX(0, 28);

                this.line.position.y = 132 + (this.selectedChar.y * this.delta.y);
                this.charactersGroup.position.x = -((this.selectedChar.x - 6) * this.delta.x);
            }
            else if(this.active === MainMenuActiveMenu.ERASE) {

            }
            else if(this.active === MainMenuActiveMenu.COPY) {

            }
        }

        complete() {
            var data = this.saves[this.selected];
            this.game.state.start('level_lightworld', true);
        }

        select() {
            if (this.active === MainMenuActiveMenu.SELECT) {
                // select a save to play
                if (this.selected <= 2) {
                    if (!this.saves[this.selected].data) {
                        this.activate(MainMenuActiveMenu.REGISTER);
                    }
                    else {
                        this.complete();
                    }
                }
                // select ERASE
                else if (this.selected === 3) {
                    this.errorSound.play();
                    return;
                }
                // select COPY
                else if (this.selected === 4) {
                    this.errorSound.play();
                    return;
                }

                this.selectSound.play();
            }
            else if (this.active === MainMenuActiveMenu.REGISTER) {
                //add letter
                var n = this.pname.text,
                    ch = this.characters[this.selectedChar.y][this.selectedChar.x];

                if (ch.name === 'end') {
                    if (!n.trim()) {
                        return this.activate(MainMenuActiveMenu.SELECT);
                    }
                    else {
                        var ls = new Utility.PlayerSave(this.selected, n.split('').filter(function(ch, i) { return (i % 2 === 0); }).join(''));
                        ls.save();

                        this.selectSound.play();
                        return this.activate(MainMenuActiveMenu.SELECT);
                    }
                }
                else if (ch.name === 'left') {
                    this.pnameI = Math.max(0, this.pnameI - 1);
                    this.pointerSprite.position.x = 30 + (this.pnameI * 2 * this.pname.monospace);
                    return;
                }
                else if (ch.name === 'right') {
                    this.pnameI = Math.min((n.length / 2), this.pnameI + 1);
                    this.pointerSprite.position.x = 30 + (this.pnameI * 2 * this.pname.monospace);
                    return;
                }

                // max length, replace other characters
                if (n.length === 11 || this.pnameI < (n.length / 2)) {
                    var i = this.pnameI * 2;

                    n = n.substr(0, i) + ch.text + n.substr(i + 1);
                }
                // otherwise just add new character
                else {
                    if (n.length) {
                        n += ' ';
                    }

                    n += ch.text;
                }

                this.pnameI = (this.pnameI + 1) % 6;

                this.pname.text = n;

                this.pointerSprite.position.x = 30 + (this.pnameI * this.pname.monospace);

                this.lowhpSound.play();
            }
            else if(this.active === MainMenuActiveMenu.ERASE) {

            }
            else if(this.active === MainMenuActiveMenu.COPY) {

            }
        }

        activate(menu: MainMenuActiveMenu) {
            this.selectGroup.visible = false;
            this.registerGroup.visible = false;

            this.active = menu;

            if (menu === MainMenuActiveMenu.REGISTER) {
                this.registerGroup.visible = true;

                this.pname.text = '';
                this.pnameI = 0;
                this.pointerSprite.x = 30;
            }
            else if (menu === MainMenuActiveMenu.SELECT) {
                this.selectGroup.visible = true;

                var s = this.saves = [
                    new Utility.PlayerSave(0),
                    new Utility.PlayerSave(1),
                    new Utility.PlayerSave(2)
                ];

                for(var i = 0; i < s.length; ++i) {
                    var n = i + 1,
                        sv = s[i].load(),
                        inv = sv ? sv.inventory : null,
                        spr: Phaser.Sprite = this['linkSprite' + n];

                    this['slotText' + n].text = n + '.' + (sv ? sv.name : '');

                    if(inv) {
                        spr.visible = true;

                        if (inv.sword === 1 && inv.shield === 1) {
                            spr.setFrame(this.frames.getFrameByName('link4.png'));
                        }
                        else if (inv.shield === 1) {
                            spr.setFrame(this.frames.getFrameByName('link3.png'));
                        }
                        else if (inv.sword === 1) {
                            spr.setFrame(this.frames.getFrameByName('link2.png'));
                        }
                        else {
                            spr.setFrame(this.frames.getFrameByName('link1.png'));
                        }

                        this._renderHearts(this['hearts' + n], sv.health, sv.maxHealth);
                    }
                }
            }
        }

        private _renderHearts(group: Phaser.Group, value: number, max: number) {
            var x = 0,
                y = 20,
                size = 16,
                perRow = 10;

            for(var hp = value; hp > 0; --hp) {
                done++;

                var spr = this.heartpool.alloc();
                spr.setFrame(this.frames.getFrameByName(hp < 1 ? 'heart-half.png' : 'heart-full.png'));
                spr.position.x = x;
                spr.position.y = y + (hp < 1 ? 2 : 0);
                spr.visible = true;

                if((x / size) >= (perRow - 1)) {
                    x = 0;
                    y += size;
                } else {
                    x += size;
                }

                group.add(spr);
            }

            for(var done = 0; done < max; ++done) {
                var spr = this.heartpool.alloc();

                spr.setFrame(this.frames.getFrameByName('heart-empty.png'));
                spr.position.x = x;
                spr.position.y = y;
                spr.visible = true;

                if ((x / size) >= (perRow - 1)) {
                    x = 0;
                    y += size;
                } else {
                    x += size;
                }

                group.add(spr);
            }
        }

        private _setupSelect() {
            this.selectGroup = this.add.group();

            this.selectSprite = this.add.sprite(0, 0, 'sprite_select', 'select.png', this.selectGroup);

            this.fairySprite = this.add.sprite(27, 72, 'sprite_select', null, this.selectGroup);
            this.fairySprite.animations.add('flap', ['fairy1.png', 'fairy2.png'], 6, true).play();

            this.linkSprite1 = this.add.sprite(52, 68, 'sprite_select', null, this.selectGroup);
            this.linkSprite1.visible = false;

            this.linkSprite2 = this.add.sprite(52, 100, 'sprite_select', null, this.selectGroup);
            this.linkSprite2.visible = false;

            this.linkSprite3 = this.add.sprite(52, 128, 'sprite_select', null, this.selectGroup);
            this.linkSprite3.visible = false;

            this.heartsGroup1 = this.add.group(this.selectGroup);
            this.heartsGroup1.position.set(142, 63);

            this.heartsGroup2 = this.add.group(this.selectGroup);
            this.heartsGroup2.position.set(142, 93);

            this.heartsGroup3 = this.add.group(this.selectGroup);
            this.heartsGroup3.position.set(142, 142);

            var textGroup = this.add.group(this.selectGroup);

            textGroup.add(this.fontpool.alloc(false, 40, 25, 'PLAYER SELECT', 16));
            textGroup.add(this.fontpool.alloc(false, 50, 178, 'COPY  PLAYER', 16));
            textGroup.add(this.fontpool.alloc(false, 50, 193, 'ERASE PLAYER', 16));

            this.slotText1 = textGroup.add(this.fontpool.alloc(false, 72, 72, '1.', 16));
            this.slotText2 = textGroup.add(this.fontpool.alloc(false, 72, 102, '2.', 16));
            this.slotText3 = textGroup.add(this.fontpool.alloc(false, 72, 132, '3.', 16));
        }

        private _setupRegister() {
            this.registerGroup = this.add.group();

            this.pointerSprite = this.add.sprite(30, 88, 'sprite_select', 'pointer.png', this.registerGroup);

            var textGroup = this.add.group(this.registerGroup),
                lines = [
                    'ABCDEFGHIJ  abcdefghij  01234',
                    'KLMNOPQRST  klmnopqrst  56789',
                    'UVWXYZDPC   uvwxyzDPC   EQPP ',
                    '     <> =+       <> =+  <> =+'
                ];

            textGroup.add(this.fontpool.alloc(false, 40, 40, 'REGISTER  YOUR  NAME', 16));

            this.pname = textGroup.add(this.fontpool.alloc(false, 30, 96, '', 16));

            //create all the characters
            this.charactersGroup = this.add.group(textGroup);
            this.characters = [];

            var sx = 32,
                sy = 125,
                cx = sx,
                cy = sy;

            for(var y = 0; y < lines.length; ++y) {
                this.characters[y] = [];

                var line = lines[y].split('');
                for(var x = 0; x < line.length; ++x) {
                    var txt = this.charactersGroup.add(this.fontpool.alloc(false, cx, cy));

                    this.characters[y][x] = txt;

                    if (line[x] === '=') {
                        txt.text = 'END';
                        txt.name = 'end';
                    } else if (line[x] === '+') {
                        txt.text = ' ';
                        txt.name = 'end';
                    } else if (line[x] === '<') {
                        txt.text = '<';
                        txt.name = 'left';
                    } else if (line[x] === '>') {
                        txt.text = '>';
                        txt.name = 'right';
                    } else {
                        txt.text = line[x];
                    }

                    cx += this.delta.x;
                }

                cy += this.delta.y;
                cx = sx;
            }

            this.line = this.add.graphics(24, 132, this.registerGroup);
            this.line.lineStyle(2, 0xffffff, 1);
            this.line.moveTo(0, 0);
            this.line.lineTo(624, 0);
            this.line.scale.set(1 / Data.Constants.GAME_SCALE, 1 / Data.Constants.GAME_SCALE);

            this.registerSprite = this.add.sprite(0, 0, 'sprite_select', 'register.png', this.registerGroup);

            this.registerGroup.visible = false;
        }

        private _onInputDown(key: number, value: number, event: any) {
            switch(key) {
                case Phaser.Keyboard.DOWN:
                case Phaser.Keyboard.S:
                case Phaser.Gamepad.XBOX360_DPAD_DOWN:
                    this.move(Phaser.DOWN)
                    break;

                case Phaser.Keyboard.UP:
                case Phaser.Keyboard.W:
                case Phaser.Gamepad.XBOX360_DPAD_UP:
                    this.move(Phaser.UP)
                    break;

                case Phaser.Keyboard.LEFT:
                case Phaser.Keyboard.A:
                case Phaser.Gamepad.XBOX360_DPAD_LEFT:
                    this.move(Phaser.LEFT)
                    break;

                case Phaser.Keyboard.RIGHT:
                case Phaser.Keyboard.D:
                case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
                    this.move(Phaser.RIGHT)
                    break;

                case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
                    this.move(value > 0 ? Phaser.RIGHT : Phaser.LEFT);
                    break;

                case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
                    this.move(value > 0 ? Phaser.DOWN : Phaser.UP);
                    break;

                case Phaser.Keyboard.ENTER:
                case Phaser.Keyboard.SPACEBAR:
                case Phaser.Gamepad.XBOX360_A:
                case Phaser.Gamepad.XBOX360_B:
                case Phaser.Gamepad.XBOX360_START:
                    this.select();
                    break;
            }
        }

        private _onInputUp(key: number, value: number, event: any) {
        }

    }
}
