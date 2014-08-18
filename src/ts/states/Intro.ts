module Lttp.States {
    export class Intro extends Phaser.State {

        sounds: Object;
        background: Phaser.Sprite;
        logo: Phaser.Sprite;

        create() {
            // var audioSettings = { volume: C.EFFECT_VOLUME };
            // this.sounds = {
            //     intro: this.audio.add('music_title', { volume: C.MUSIC_VOLUME }),
            //     sword: this.audio.add('effect_sword1', audioSettings),
            //     ding: this.audio.add('effect_menu_select', audioSettings)
            // };

            // var txIntro = game.cache.getTextures('sprite_intro'),
            //     txParticles = game.cache.getTextures('sprite_particles');

            // this.sprites = {
            //     intro: new gf.Sprite(),

            //     background: new gf.Sprite(txIntro['background.png']), //.frames[0]),
            //     title: new gf.Sprite(txIntro['logo.png']), //.frames[0]),
            //     sword: new gf.Sprite(txIntro['sword.png']), //.frames[0]),
            //     zpart: new gf.Sprite(txIntro['zpart.png']), //.frames[0]),
            //     shine: new gf.Sprite(txParticles['swordshine/shine.png']),
            //     sparkle: new gf.Sprite([
            //         txParticles['sparkle/0.png'],
            //         txParticles['sparkle/1.png'],
            //         txParticles['sparkle/2.png'],
            //         txParticles['sparkle/3.png'],
            //         txParticles['sparkle/4.png'],
            //         txParticles['sparkle/5.png']
            //     ], 0.25)
            // };

            // this.camera.add.obj(this.sprites.background);
            // this.camera.add.obj(this.sprites.intro);
            // this.camera.add.obj(this.sprites.title);
            // this.camera.add.obj(this.sprites.sparkle);
            // this.camera.add.obj(this.sprites.sword);
            // this.camera.add.obj(this.sprites.shine);
            // this.camera.add.obj(this.sprites.zpart);

            // this.sprites.sparkle.visible = false;
            // this.sprites.sparkle.anchor.x = this.sprites.sparkle.anchor.y = 0.5;

            // this.sprites.shine.visible = false;

            // this._setupIntroSprite();
            // this._setupTitleSprites();

            // this.scale.x = this.scale.y = C.SCALE;
            // this.doPlay = true;

            // this.background = this.add.sprite(0, 0, 'titlepage');
            // this.background.alpha = 0;

            // this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            // this.logo.anchor.setTo(0.5, 0.5);

            // this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            // this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);

            // this.input.onDown.addOnce(this.fadeOut, this);
        }

        fadeOut() {
            // this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            // var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);

            // tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            // this.game.state.start('Play', true, false);
        }

    }
}

