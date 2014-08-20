module Lttp.States {
    export class Intro extends Phaser.State {

        introMusic: Phaser.Sound;
        swordSound: Phaser.Sound;
        dingSound: Phaser.Sound;

        keyEnter: Phaser.Key;
        keySpace: Phaser.Key;

        gamepad: Phaser.SinglePad;

        intro: Phaser.Sprite;
        background: Phaser.Sprite;
        title: Phaser.Sprite;
        sword: Phaser.Sprite;
        zpart: Phaser.Sprite;
        shine: Phaser.Sprite;
        sparkle: Phaser.Sprite;

        flashes: Effects.ScreenFlash[];

        create() {
            this.introMusic = this.add.audio('music_title', Data.Constants.AUDIO_MUSIC_VOLUME);
            this.swordSound = this.add.audio('effect_sword1', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.dingSound = this.add.audio('effect_menu_select', Data.Constants.AUDIO_EFFECT_VOLUME);

            this.intro = this.add.sprite(0, 0, 'sprite_intro');

            this.background = this.add.sprite(0, 0, 'sprite_intro', 'background.png');

            this.title = this.add.sprite(49, 60, 'sprite_intro', 'logo.png');
            this.title.alpha = 0;

            this.sword = this.add.sprite(56, -130, 'sprite_intro', 'sword.png');

            this.zpart = this.add.sprite(53, 86, 'sprite_intro', 'zpart.png');
            this.zpart.visible = false;

            this.shine = this.add.sprite(68, 85, 'sprite_particles', 'swordshine/shine.png');
            this.shine.visible = false;

            this.sparkle = this.add.sprite(0, 0, 'sprite_particles');
            this.sparkle.visible = false;
            this.sparkle.anchor.set(0.5, 0.5);
            this.sparkle.animations.add('sparkle', [
                'sparkle/0.png',
                'sparkle/1.png',
                'sparkle/2.png',
                'sparkle/3.png',
                'sparkle/4.png',
                'sparkle/5.png'
            ], 0.25, false, false);

            this.flashes[0] = new Effects.ScreenFlash(this.game, 'red');
            this.flashes[1] = new Effects.ScreenFlash(this.game, 'green');
            this.flashes[2] = new Effects.ScreenFlash(this.game, 'blue');

            this.keyEnter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);
            this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

            this.game.input.gamepad.start();
            this.gamepad = this.game.input.gamepad.pad1;

            this._setupIntroSprite();
            this.startAnimation();
        }

        update() {
            if (this.keyEnter.isDown || this.keySpace.isDown ||
                this.gamepad.isDown(Phaser.Gamepad.XBOX360_A) ||
                this.gamepad.isDown(Phaser.Gamepad.XBOX360_B)
            ) {
                this.complete();
            }
        }

        startAnimation() {
            this.intro.animations.play('intro');

            var self = this;

            setTimeout(function() {
                self.introMusic.play();
            }, 3100);

            // When the intro completes
            this.intro.events.onAnimationComplete.add(function () {
                setTimeout(function() {
                    self.showSparkle();
                }, 500);

                //Fade in the title
                self.game.add.tween(self.title)
                    .to({ alpha: 1 }, 2500, Phaser.Easing.Linear.None)
                    .start()
                    .onComplete.add(function () {
                        self.zpart.visible = true;

                        //play sword sounds
                        self.swordSound.play().onMarkerComplete.add(function () {
                            self.dingSound.play();
                        });

                        //drop the sword animation
                        self.game.add.tween(self.sword)
                            .to({ y: 38 }, 200, Phaser.Easing.Linear.None)
                            .start()
                            .onComplete.add(function () {
                                // blink the screen
                                self.blink(8, function () {
                                    //Fade out the intro
                                    self.game.add.tween(self.intro)
                                        .to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None)
                                        .start()
                                        .onComplete.add(function () {
                                            // show the sword shine
                                            self.shine.visible = true;
                                            self.game.add.tween(self.shine)
                                                .to({ y: 150 }, 250, Phaser.Easing.Linear.None)
                                                .start()
                                                .onComplete.add(function () { self.shine.visible = false; });

                                            // hide the intro
                                            self.intro.visible = false;
                                        });
                                });
                            });
                    });
            });
        }

        complete() {
            //TODO: Cleanup, cancel tweens, hide sprites, etc

            this.game.state.start('MainMenu', true, false);
        }

        showSparkle(p?: number) {
            p = (p || 0) % 4;

            var sp = this.sparkle,
                self = this;

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

            sp.play('sparkle').onComplete.add(function() {
                sp.visible = false;

                setTimeout(function() {
                    self.showSparkle(++p);
                }, 500);
            });
        }

        blink(num: number, cb: Function) {
            if(num === 0)
                return cb();

            num--;

            var self = this,
                len = 20,
                alpha = 0.9;

            this.flashes[0].flash(alpha, len).onComplete.add(function () {
                this.flashes[1].flash(alpha, len).onComplete.add(function () {
                    this.flashes[2].flash(alpha, len).onComplete.add(function () {
                        this.blink(num, cb);
                    }, this);
                }, this);
            }, this);
        }

        _setupIntroSprite() {
            var frames = [];

            for(var i = 3; i < 278; ++i) {
                var s = i.toString();
                while(s.length < 5) { s = '0' + s; }

                frames.push('Zelda - A Link to the Past_' + s + '.png');
            }

            this.intro.animations.add('intro', frames, 0.5, false, false);
        }

    }
}

