import { BaseLttpScene } from './BaseLttpScene';
import { MainMenuScene } from './MainMenuScene';
import { Dialog } from '../gui/Dialog';
import {
    AUDIO_MUSIC_VOLUME,
    AUDIO_EFFECT_VOLUME,
    GAME_WIDTH,
    GAME_HEIGHT,
    EFFECT_INTRO_FLASH_LENGTH,
    COLORS,
    EFFECT_INTRO_FLASH_ALPHA,
} from '../data/Constants';
import { TiledMap } from '../tiledmap/TiledMap';
import { ScreenFlash } from '../effects/ScreenFlash';
import { IDictionary } from '../utility/IDictionary';

const LORE_TEXT = [
    // Image #1
    [
        'Long ago, in the beautiful',
        'kingdom of Hyrule surrounded',
        'by mountains and forests...',
    ].join('\n'),
    // pause
    [
        'legends told of an omnipotent',
        'and omniscient Golden Power',
        'that resided in a hidden land.',
    ].join('\n'),
    // pause, Image #2
    [
        'Many people aggressively',
        'sought to enter the hidden',
        'Golden Land...',
    ].join('\n'),
    // pause
    [
        'But no one ever returned.',
        'One day evil power began to',
        'flow from the Golden Land...',
    ].join('\n'),
    // pause
    [
        'So the King commanded seven',
        'wise men to seal the gate to',
        'the Land of the Golden Power.',
    ].join('\n'),
    // pause, Image #3
    [
        'That seal should have remained',
        'for all time...',
        ' ',
    ].join('\n'),
    // pause, Image #4
    [
        '... ...But, when these events',
        'were obscured by the mists of',
        'time and became legend...',
    ].join('\n'),
];

export class IntroScene extends BaseLttpScene
{
    static KEY = 'IntroScene';

    introMusic: Phaser.Sound.BaseSound = null;
    loreMusic: Phaser.Sound.BaseSound = null;
    dingSound: Phaser.Sound.BaseSound = null;

    // intro group sprites
    introGroup: Phaser.GameObjects.Container = null;
    intro: Phaser.GameObjects.Sprite = null;
    background: Phaser.GameObjects.Sprite = null;
    title: Phaser.GameObjects.Sprite = null;
    sword: Phaser.GameObjects.Sprite = null;
    zpart: Phaser.GameObjects.Sprite = null;
    shine: Phaser.GameObjects.Sprite = null;
    sparkle: Phaser.GameObjects.Sprite = null;

    // lore group sprites
    loreGroup: Phaser.GameObjects.Container = null;
    loreBg1: Phaser.GameObjects.TileSprite = null;
    loreBg2: Phaser.GameObjects.TileSprite = null;
    loreImg1: Phaser.GameObjects.Sprite = null;
    loreImg2: Phaser.GameObjects.Sprite = null;
    loreImg3: Phaser.GameObjects.Sprite = null;
    loreImg4: Phaser.GameObjects.Sprite = null;
    loreHighlight: Phaser.GameObjects.Graphics = null;
    loreDialog: Dialog = null;

    // minimap sprites
    minimap: TiledMap = null;

    sparkling: boolean = false;
    count: number = 0;
    keys: IDictionary<Phaser.Input.Keyboard.Key> = null;
    flashEffect: ScreenFlash = null;

    constructor()
    {
        super(IntroScene.KEY);
    }

    preload()
    {
        super.preload();

        this.load.image('lw_minimap_tiles', require('../../assets/levels/minimaps/lw_minimap_tileset.png'));
        this.load.tilemapTiledJSON('lw_minimap', require('../../assets/levels/minimaps/lw_minimap.json'));
    }

    create()
    {
        this.introMusic = this.sound.add('music_title', { volume: AUDIO_MUSIC_VOLUME });
        this.loreMusic = this.sound.add('music_lore', { volume: AUDIO_MUSIC_VOLUME });
        this.dingSound = this.sound.add('effect_menu_select', { volume: AUDIO_EFFECT_VOLUME });

        this.keys = this.input.keyboard.addKeys({
            skip0: Phaser.Input.Keyboard.KeyCodes.ENTER,
            skip1: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.flashEffect = new ScreenFlash(this.cameras.main);

        const tilesetTx = this.textures.get('lw_minimap_tiles').getSourceImage();
        const assets = { 'lw_minimap_tileset.png': tilesetTx as HTMLImageElement };

        this.minimap = new TiledMap(this, 0, 0,
            this.cache.json.get('lw_minimap'),
            [{
                type: 'image',
                subtype: 'tileset',
                key: 'lw_minimap_tiles',
                name: 'lw_minimap_tileset.png',
                url: require('../../assets/levels/minimaps/lw_minimap_tileset.png'),
                originalUrl: 'lw_minimap_tileset.png',
            }]);

        this.minimap.name = 'minimap';
        this.minimap.visible = false;
        this.minimap.alpha = 0;
        this.add.existing(this.minimap);

        this._createIntroGroup();
        this._createLoreGroup();

        this.startIntroAnimation();
    }

    update(time: number, delta: number)
    {
        this.flashEffect.update(time, delta);

        const pad = this.input.gamepad.getPad(0);

        if (this.keys.skip0.isDown || this.keys.skip1.isDown)
        {
            this.skip();
        }

        if (pad && (pad.A || pad.B))
        {
            this.skip();
        }

        this.count++;
        if (this.loreGroup.visible && (this.count % 4) === 0)
        {
            this.loreBg1.tilePositionX += 1;
            this.loreBg1.tilePositionY -= 1;

            this.loreBg2.tilePositionX -= 1;
            this.loreBg2.tilePositionY -= 1;
        }
    }

    private startIntroAnimation()
    {
        this.introGroup.visible = true;
        this.introGroup.alpha = 1;

        this.loreGroup.visible = false;

        this.minimap.visible = false;

        this.title.alpha = 0;
        this.sparkle.visible = false;
        this.shine.visible = false;
        this.zpart.visible = false;

        this.sword.y = -130;
        this.shine.y = 85;

        this.cameras.main.x = this.cameras.main.y = 0;

        this.introMusic.play();
        this.introMusic.once('stop', () =>
        {
            // after music stops playing (there is silence padding on either side) fade to lore screen
            this.tweens.add({
                targets: this.introGroup,
                duration: 500,
                alpha: 0,
                onComplete: () =>
                {
                    this.sparkling = false;
                    this.startLoreAnimation();
                },
            });
        });

        this.intro.alpha = 1;
        this.intro.play('intro').once('animationcomplete', () =>
        {
            this.sparkling = true;
            this.time.delayedCall(500, this.showSparkle, [0], this);

            this.tweens.timeline({
                tweens: [
                    // Fade in the title
                    {
                        targets: this.title,
                        duration: 2500,
                        alpha: 1,
                        onComplete: () =>
                        {
                            this.zpart.visible = true;
                            this.dingSound.play();
                        },
                    },
                    // drop the sword animation
                    {
                        targets: this.sword,
                        duration: 200,
                        y: 38,
                        onComplete: () =>
                        {
                            this.blink(3, () => this.finishIntroAnimation());
                        }
                    },
                ]
            });
        });
    }

    private finishIntroAnimation()
    {
        this.tweens.timeline({
            tweens: [
                // Fade out the intro
                {
                    targets: this.intro,
                    duration: 500,
                    alpha: 0,
                    onComplete: () =>
                    {
                        this.shine.visible = true;
                    },
                },
                // show the sword shine
                {
                    targets: this.shine,
                    duration: 250,
                    y: 150,
                    onComplete: () =>
                    {
                        this.shine.visible = false;
                    },
                },
            ],
        });
    }

    private startLoreAnimation()
    {
        this.introGroup.visible = false;
        this.loreGroup.visible = true;
        this.minimap.visible = false;

        this.cameras.main.setPosition(0, 0);

        this.loreDialog.font.text = '';

        this.loreImg1.alpha = 0;
        this.loreImg2.alpha = 0;
        this.loreImg3.alpha = 0;
        this.loreImg4.alpha = 0;

        this.loreMusic.play();

        this.tweens.add({
            targets: this.loreGroup,
            duration: 500,
            alpha: 1,
            onComplete: () =>
            {
                this._showLoreSequence(0, () =>
                {
                    this.tweens.add({
                        targets: this.loreGroup,
                        duration: 500,
                        alpha: 0,
                        onComplete: () => this.startMinimapFlythrough(),
                    });
                });
            },
        });
    }

    private startMinimapFlythrough()
    {
        this.introGroup.visible = false;
        this.loreGroup.visible = false;

        const diff = 128;
        const maxScale = 65;

        this.minimap.visible = true;
        this.minimap.alpha = 1;
        this.minimap.scaleX = 1;
        this.minimap.setPosition(0, 0);

        this.cameras.main.setPosition(diff, diff);

        this.tweens.timeline({
            targets: this.minimap,
            tweens: [
                {
                    duration: 500,
                    alpha: 1,
                },
                {
                    duration: 5000,
                    ease: 'Expo.easeIn',
                    x: -252 * maxScale,
                    y: -234 * maxScale,
                    scaleX: maxScale,
                    scaleY: maxScale,
                },
                {
                    duration: 1000,
                    offset: '-=1000',
                    alpha: 0,
                }
            ],
            onComplete: () =>
            {
                this.time.delayedCall(1000, this.startIntroAnimation, [], this);
            }
        });
    }

    private skip()
    {
        this.scene.start(MainMenuScene.KEY);
    }

    private showSparkle(p: number)
    {
        p %= 4;

        if (!this.sparkling)
            return;

        const sp = this.sparkle;

        sp.visible = true;

        switch (p)
        {
            case 0: // Z sparkle
                sp.x = 55;
                sp.y = 93;
                break;

            case 1: // A sparkle
                sp.x = 197;
                sp.y = 128;
                break;

            case 2: // D sparkle
                sp.x = 154;
                sp.y = 88;
                break;

            case 3: // E sparkle
                sp.x = 113;
                sp.y = 128;
                break;
        }

        sp.play('sparkle').once('complete', () =>
        {
            sp.visible = false;
            this.time.delayedCall(180, this.showSparkle, [++p], this);
        });
    }

    private blink(num: number, cb?: Function)
    {
        if (num === 0)
            return cb && cb.call(this);

        num--;

        // should instead start at alpha: EFFECT_INTRO_FLASH_ALPHA
        this.flashEffect.start(EFFECT_INTRO_FLASH_LENGTH, COLORS.RED, EFFECT_INTRO_FLASH_ALPHA, false, () =>
        {
            this.flashEffect.start(EFFECT_INTRO_FLASH_LENGTH, COLORS.GREEN, EFFECT_INTRO_FLASH_ALPHA, false, () =>
            {
                this.flashEffect.start(EFFECT_INTRO_FLASH_LENGTH, COLORS.BLUE, EFFECT_INTRO_FLASH_ALPHA, false, () =>
                {
                    this.blink(num, cb);
                });
            });
        });
    }

    private _showLoreSequence(seq: number, cb: () => void)
    {
        switch (seq)
        {
            case 0:
                if (this.loreImg1.alpha !== 1)
                {
                    this.tweens.add({
                        targets: this.loreImg1,
                        duration: 500,
                        alpha: 1,
                        onComplete: () =>
                        {
                            this._showLoreSequence(seq, cb);
                        },
                    });
                    return;
                }
                break;

            case 2:
                if (this._switchLoreImages(this.loreImg1, this.loreImg2, seq, cb))
                    return;
                break;

            case 5:
                if (this._switchLoreImages(this.loreImg2, this.loreImg3, seq, cb))
                    return;
                break;

            case 6:
                if (this._switchLoreImages(this.loreImg3, this.loreImg4, seq, cb))
                    return;
                break;

            case 7:
                if (cb)
                    cb.call(this);
                return;
        }

        if (seq === 0)
        {
            this.loreDialog.show(LORE_TEXT[seq], undefined, false, false)
                .once(Dialog.EVT_TYPING_COMPLETE, () =>
                {
                    this.time.delayedCall(4000, this._showLoreSequence, [++seq, cb], this);
                });
        }
        else
        {
            this.loreDialog.append(LORE_TEXT[seq], false)
                .once(Dialog.EVT_TYPING_COMPLETE, () =>
                {
                    this.time.delayedCall(4000, this._showLoreSequence, [++seq, cb], this);
                });
        }
    }

    private _switchLoreImages(
        fromImg: Phaser.GameObjects.Sprite,
        toImg: Phaser.GameObjects.Sprite,
        seq: number,
        cb: () => void): boolean
    {
        if (toImg.alpha !== 1)
        {
            this.tweens.timeline({
                tweens: [
                    {
                        targets: fromImg,
                        duration: 500,
                        alpha: 0,
                    },
                    {
                        targets: toImg,
                        duration: 500,
                        alpha: 1,
                    }
                ],
                onComplete: () => this._showLoreSequence(seq, cb),
            });

            return true;
        }

        return false;
    }

    private _createIntroGroup(): void
    {
        this.background = this.add.sprite(0, 0, 'sprite_intro', 'background.png');
        this.background.name = 'background';

        this.intro = this.add.sprite(0, 0, 'sprite_intro');
        this.intro.name = 'intro';

        this.title = this.add.sprite(0, 0, 'sprite_intro', 'logo.png');
        this.title.name = 'title';

        this.sword = this.add.sprite(56, -130, 'sprite_intro', 'sword.png');
        this.sword.name = 'sword';

        this.shine = this.add.sprite(68, 85, 'sprite_particles', 'swordshine/shine.png');
        this.shine.name = 'shine';

        this.zpart = this.add.sprite(53, 86, 'sprite_intro', 'zpart.png');
        this.zpart.name = 'zpart';

        this.sparkle = this.add.sprite(0, 0, 'sprite_particles');
        this.sparkle.name = 'sparkle';

        this.introGroup = this.add.container(0, 0, [
            this.background,
            this.intro,
            this.title,
            this.sword,
            this.shine,
            this.zpart,
            this.sparkle,
        ]);
        this.introGroup.name = 'intro';

        this.anims.create({
            key: 'intro',
            frames: this.anims.generateFrameNames('sprite_intro', {
                prefix: 'Zelda - A Link to the Past_',
                suffix: '.png',
                start: 3,
                end: 278,
                zeroPad: 5,
            }),
            frameRate: 30,
            repeat: 0
        });

        this.anims.create({
            key: 'sparkle',
            frames: this.anims.generateFrameNames('sprite_particles', {
                prefix: 'sparkle/',
                suffix: '.png',
                start: 0,
                end: 5,
            }),
            frameRate: 17,
            repeat: 0
        });
    }

    private _createLoreGroup(): void
    {
        this.loreBg1 = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'image_lore_bg1');
        this.loreBg1.name = 'background1';

        this.loreBg2 = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'image_lore_bg2');
        this.loreBg2.name = 'background2';

        this.loreHighlight = this.add.graphics({ x: 0, y: 0 });
        this.loreHighlight.name = 'highlight';
        this.loreHighlight.alpha = 0;
        this.loreHighlight.fillStyle(0xFFFF00, 0.12);

        // top
        this.loreHighlight.fillRect(24, 32, 200, 40);

        // right
        this.loreHighlight.fillRect(214, 72, 10, 48);

        // bottom
        this.loreHighlight.fillRect(24, 120, 200, 72);

        // left
        this.loreHighlight.fillRect(24, 72, 26, 48);

        this.loreImg1 = this.add.sprite(42, 66, 'sprite_intro', 'lore_img1.png');
        this.loreImg1.name = 'image1';
        this.loreImg1.alpha = 0;

        this.loreImg2 = this.add.sprite(42, 66, 'sprite_intro', 'lore_img2.png');
        this.loreImg2.name = 'image2';
        this.loreImg2.alpha = 0;

        this.loreImg3 = this.add.sprite(42, 66, 'sprite_intro', 'lore_img3.png');
        this.loreImg3.name = 'image3';
        this.loreImg3.alpha = 0;

        this.loreImg4 = this.add.sprite(42, 66, 'sprite_intro', 'lore_img4.png');
        this.loreImg4.name = 'image4';
        this.loreImg4.alpha = 0;

        this.loreDialog = new Dialog(this, 34, 124, false, true);
        this.loreDialog.name = 'dialog';

        this.loreGroup = this.add.container(0, 0, [
            this.loreBg1,
            this.loreBg2,
            this.loreHighlight,
            this.loreImg1,
            this.loreImg2,
            this.loreImg3,
            this.loreImg4,
            this.loreDialog,
        ]);
        this.loreGroup.name = 'lore';
        this.loreGroup.visible = false;
    }
}
