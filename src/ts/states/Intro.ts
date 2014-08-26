var loreText = [
    // Image #1
    [
        'Long ago, in the beautiful',
        'kingdom of Hyrule surrounded',
        'by mountains and forests...'
    ].join('\n'),
    //pause
    [
        'legends told of an omnipotent',
        'and omniscient Golden Power',
        'that resided in a hidden land.'
    ].join('\n'),
    // pause, Image #2
    [
        'Many people aggressively',
        'sought to enter the hidden',
        'Golden Land...'
    ].join('\n'),
    //pause
    [
        'But no one ever returned.',
        'One day evil power began to',
        'flow from the Golden Land...'
    ].join('\n'),
    //pause
    [
        'So the King commanded seven',
        'wise men to seal the gate to',
        'the Land of the Golden Power.'
    ].join('\n'),
    // pause, Image #3
    [
        'That seal should have remained',
        'for all time...',
        ''
    ].join('\n'),
    // pause, Image #4
    [
        '... ...But, when these events',
        'were obscured by the mists of',
        'time and became legend...'
    ].join('\n')
];

module Lttp.States {
    export class Intro extends Phaser.State {

        introMusic: Phaser.Sound;
        swordSound: Phaser.Sound;
        dingSound: Phaser.Sound;

        keyEnter: Phaser.Key;
        keySpace: Phaser.Key;

        gamepad: Phaser.SinglePad;

        introGroup: Phaser.Group;
        loreGroup: Phaser.Group;

        // intro group sprites
        intro: Phaser.Sprite;
        background: Phaser.Sprite;
        title: Phaser.Sprite;
        sword: Phaser.Sprite;
        zpart: Phaser.Sprite;
        shine: Phaser.Sprite;
        sparkle: Phaser.Sprite;

        // lore group sprites
        loreBg1: Phaser.TileSprite;
        loreBg2: Phaser.TileSprite;
        loreImg1: Phaser.Sprite;
        loreImg2: Phaser.Sprite;
        loreImg3: Phaser.Sprite;
        loreImg4: Phaser.Sprite;
        loreHighlight: Phaser.Graphics;
        loreDialog: Gui.Dialog;

        flashes: Effects.ScreenFlash[] = [];

        count: number = 0;

        timer: Phaser.Timer;

        create() {
            this.introMusic = this.add.audio('music_title', Data.Constants.AUDIO_MUSIC_VOLUME);
            this.swordSound = this.add.audio('effect_sword1', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.dingSound = this.add.audio('effect_menu_select', Data.Constants.AUDIO_EFFECT_VOLUME);

            this._createIntroGroup();
            this._createLoreGroup();

            this._bindInput();

            // this.startIntroAnimation();
            this.startLoreAnimation();

            this.timer = this.game.time.create(false);
            this.timer.start();
        }

        update() {
            if (this.keyEnter.isDown || this.keySpace.isDown ||
                this.gamepad.isDown(Phaser.Gamepad.XBOX360_A) ||
                this.gamepad.isDown(Phaser.Gamepad.XBOX360_B)
            ) {
                this.skip();
            }

            this.count++;
            if (this.loreGroup.visible && (this.count % 3) === 0) {

                this.loreBg1.tilePosition.x += 1;
                this.loreBg1.tilePosition.y -= 1;

                this.loreBg2.tilePosition.x -= 1;
                this.loreBg2.tilePosition.y -= 1;
            }
        }

        startIntroAnimation() {
            this.introGroup.visible = true;
            this.loreGroup.visible = false;

            this.intro.animations.play('intro');

            this.introMusic.play().onStop.addOnce(function () {
                // after music stops playing (there is silence padding on either side) fade to lore screen
                this.game.add.tween(this.introGroup)
                    .to({ alpha: 0 }, 500)
                    .start()
                    .onComplete.addOnce(function () {
                        this.startLoreAnimation();
                    }, this);
            }, this);

            // When the intro completes
            this.intro.events.onAnimationComplete.add(function () {
                this.timer.add(500, this.showSparkle, this);

                //Fade in the title
                this.game.add.tween(this.title)
                    .to({ alpha: 1 }, 2500)
                    .start()
                    .onComplete.add(function () {
                        this.zpart.visible = true;

                        //play sword sounds
                        this.swordSound.play();
                        this.dingSound.play();

                        //drop the sword animation
                        this.game.add.tween(this.sword)
                            .to({ y: 38 }, 200)
                            .start()
                            .onComplete.add(function () {
                                // blink the screen
                                this.blink(3, function () {
                                    //Fade out the intro
                                    this.game.add.tween(this.intro)
                                        .to({ alpha: 0 }, 500)
                                        .start()
                                        .onComplete.add(function () {
                                            // show the sword shine
                                            this.shine.visible = true;
                                            this.game.add.tween(this.shine)
                                                .to({ y: 150 }, 250)
                                                .start()
                                                .onComplete.add(function () { this.shine.visible = false; });

                                            // hide the intro
                                            this.intro.visible = false;
                                        }, this);
                                });
                            }, this);
                    }, this);
            }, this);
        }

        startLoreAnimation() {
            this.introGroup.visible = false;
            this.loreGroup.visible = true;

            this.game.add.tween(this.loreGroup)
                .to({ alpha: 1 }, 500)
                .start()
                .onComplete.addOnce(function () {
                    this._showLoreSequence(0, function () {
                        //TODO: Show map zoom sequence
                    });
                }, this);
        }

        private _showLoreSequence(seq, cb) {
            switch(seq) {
                case 0:
                    if (this.loreImg1.alpha !== 1) {
                        this.game.add.tween(this.loreImg1)
                            .to({ alpha: 1 }, 500)
                            .start()
                            .onComplete.add(function () {
                                this._showLoreSequence(seq, cb);
                            }, this);

                        return;
                    }
                    break;

                case 2:
                    if (this._switchLoreImages(this.loreImg1, this.loreImg2, seq, cb)) {
                        return;
                    }
                    break;

                case 5:
                    if (this._switchLoreImages(this.loreImg2, this.loreImg3, seq, cb)) {
                        return;
                    }
                    break;

                case 6:
                    if (this._switchLoreImages(this.loreImg3, this.loreImg4, seq, cb)) {
                        return;
                    }
                    break;

                case 7:
                    if(cb) cb.call(this);
                    return;
            }

            if (seq === 0) {
                this.loreDialog.show(loreText[seq], null, false, false).onTypingComplete.addOnce(function () {
                    this.timer.add(3000, this._showLoreSequence, this, ++seq, cb);
                }, this);
            } else {
                this.loreDialog.append(loreText[seq], false).onTypingComplete.addOnce(function () {
                    this.timer.add(3000, this._showLoreSequence, this, ++seq, cb);
                }, this);
            }
        }

        private _switchLoreImages(fromImg, toImg, seq, cb) {
            if (toImg.alpha !== 1) {
                this.game.add.tween(fromImg)
                    .to({ alpha: 0 }, 500)
                    .start()
                    .onComplete.add(function () {
                        this.game.add.tween(toImg)
                            .to({ alpha: 1 }, 500)
                            .start()
                            .onComplete.add(function () {
                                this._showLoreSequence(seq, cb);
                            }, this);
                    }, this);

                return true;
            }

            return false;
        }

        skip() {
            //TODO: Cleanup, cancel tweens, hide sprites, etc

            this.game.state.start('MainMenu', true, false);
        }

        showSparkle(p?: number) {
            p = (p || 0) % 4;

            var sp = this.sparkle;

            sp.visible = true;

            switch(p) {
                case 0: //Z sparkle
                    sp.x = 55;
                    sp.y = 93;
                    break;

                case 1: //A sparkle
                    sp.x = 197;
                    sp.y = 128;
                    break;

                case 2: //D sparkle
                    sp.x = 154;
                    sp.y = 88;
                    break;

                case 3: //E sparkle
                    sp.x = 113;
                    sp.y = 128;
                    break;
            }

            sp.play('sparkle').onComplete.addOnce(function() {
                sp.visible = false;

                this.timer.add(180, this.showSparkle, this, ++p);
            }, this);
        }

        blink(num: number, cb?: Function) {
            if(num === 0) {
                return cb && cb.call(this);
            }

            num--;

            var len = 45,
                alpha = 0.9;

            this.flashes[0].flash(alpha, len).onComplete.addOnce(function () {
                this.flashes[1].flash(alpha, len).onComplete.addOnce(function () {
                    this.flashes[2].flash(alpha, len).onComplete.addOnce(function () {
                        this.blink(num, cb);
                    }, this);
                }, this);
            }, this);
        }

        private _createIntroGroup() {
            this.introGroup = this.add.group();
            this.introGroup.visible = false;

            this.background = this.add.sprite(0, 0, 'sprite_intro', 'background.png', this.introGroup);

            this.intro = this.add.sprite(0, 0, 'sprite_intro', null, this.introGroup);
            var frames = [];

            for(var i = 3; i < 278; ++i) {
                var s = i.toString();
                while(s.length < 5) { s = '0' + s; }

                frames.push('Zelda - A Link to the Past_' + s + '.png');
            }
            this.intro.animations.add('intro', frames, 30, false, false);

            this.title = this.add.sprite(0, 0, 'sprite_intro', 'logo.png', this.introGroup);
            this.title.alpha = 0;

            this.sparkle = this.add.sprite(0, 0, 'sprite_particles', null, this.introGroup);
            this.sparkle.visible = false;
            this.sparkle.anchor.set(0.5, 0.5);
            this.sparkle.animations.add('sparkle', [
                'sparkle/0.png',
                'sparkle/1.png',
                'sparkle/2.png',
                'sparkle/3.png',
                'sparkle/4.png',
                'sparkle/5.png'
            ], 17, false, false);

            this.sword = this.add.sprite(56, -130, 'sprite_intro', 'sword.png', this.introGroup);

            this.shine = this.add.sprite(68, 85, 'sprite_particles', 'swordshine/shine.png', this.introGroup);
            this.shine.visible = false;

            this.zpart = this.add.sprite(53, 86, 'sprite_intro', 'zpart.png', this.introGroup);
            this.zpart.visible = false;

            this.flashes[0] = this.introGroup.add(this.game.add.existing(new Effects.ScreenFlash(this.game, 'red')));
            this.flashes[1] = this.introGroup.add(this.game.add.existing(new Effects.ScreenFlash(this.game, 'green')));
            this.flashes[2] = this.introGroup.add(this.game.add.existing(new Effects.ScreenFlash(this.game, 'blue')));
        }

        private _createLoreGroup() {
            this.loreGroup = this.add.group();
            this.loreGroup.visible = false;
            this.loreGroup.alpha = 0;

            this.loreBg1 = this.add.tileSprite(0, 0, Data.Constants.GAME_WIDTH, Data.Constants.GAME_HEIGHT, 'image_lore_bg1', null, this.loreGroup);
            this.loreBg2 = this.add.tileSprite(0, 0, Data.Constants.GAME_WIDTH, Data.Constants.GAME_HEIGHT, 'image_lore_bg2', null, this.loreGroup);

            this.loreHighlight = this.add.graphics(0, 0, this.loreGroup);
            this.loreHighlight.beginFill(0xFFFF00, 0.12);

            //top
            this.loreHighlight.drawRect(24, 32, 200, 40);

            //right
            this.loreHighlight.drawRect(214, 72, 10, 48);

            //bottom
            this.loreHighlight.drawRect(24, 120, 200, 72);

            //left
            this.loreHighlight.drawRect(24, 72, 26, 48);

            this.loreHighlight.endFill();

            this.loreImg1 = this.add.sprite(42, 66, 'sprite_intro', 'lore_img1.png', this.loreGroup);
            this.loreImg1.alpha = 0;

            this.loreImg2 = this.add.sprite(42, 66, 'sprite_intro', 'lore_img2.png', this.loreGroup);
            this.loreImg2.alpha = 0;

            this.loreImg3 = this.add.sprite(42, 66, 'sprite_intro', 'lore_img3.png', this.loreGroup);
            this.loreImg3.alpha = 0;

            this.loreImg4 = this.add.sprite(42, 66, 'sprite_intro', 'lore_img4.png', this.loreGroup);
            this.loreImg4.alpha = 0;

            this.loreDialog = new Gui.Dialog(game, this.loreGroup, false);
            this.loreDialog.position.set(34, 124);
        }

        private _bindInput() {
            this.keyEnter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);
            this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

            this.game.input.gamepad.start();
            this.gamepad = this.game.input.gamepad.pad1;
        }

    }
}

