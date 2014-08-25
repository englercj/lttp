module Lttp.Gui.Items {
    export class LifeMeter extends Gui.Items.Item {
        max: number;

        dash1: Phaser.Sprite;
        dash2: Phaser.Sprite;
        life: Phaser.Sprite;

        hearts: Phaser.Sprite[];

        frames: Phaser.FrameData;

        constructor(game: Phaser.Game, parent: Lttp.Gui.Hud, x: number, y: number, value: number = 0) {
            super(game, parent, x, y, 'life', value);

            this.dash1 = game.add.sprite(35, 0, 'sprite_gui', 'hud/life-dash.png', this);
            this.dash2 = game.add.sprite(100, 0, 'sprite_gui', 'hud/life-dash.png', this);
            this.life = game.add.sprite(65, -7, 'image_life', null, this);

            this.frames = game.cache.getFrameData('sprite_gui');

            this.hearts = [];

            this.setValue(value);
        }

        setValue(val: any) {
            super.setValue(val);

            for(var i = 0, il = this.hearts.length; i < il; ++i) {
                this.hearts[i].visible = false;
            }

            var x = 0,
                y = 20,
                size = 16,
                perRow = 10,
                done = 0;

            for(var hp = val; hp > 0; --hp) {
                var off = 0,
                    spr,
                    frame;

                if (hp < 1) { //partial
                    frame = this.frames.getFrameByName('hud/heart-half.png');
                    off = 2;
                } else {
                    frame = this.frames.getFrameByName('hud/heart-full.png');
                }

                this.enableHeartSprite(done, frame, x, y + off);

                if((x / size) >= (perRow - 1)) {
                    x = 0;
                    y += size;
                } else {
                    x += size;
                }

                done++;
            }

            for(done; done < this.max; ++done) {
                this.enableHeartSprite(done, this.frames.getFrameByName('hud/heart-empty.png'), x, y);

                if((x / size) >= (perRow - 1)) {
                    x = 0;
                    y += size;
                } else {
                    x += size;
                }
            }

            return this;
        }

        enableHeartSprite(idx, frame, x, y) {
            var spr = this.hearts[idx] || (this.hearts[idx] = this.game.add.sprite(0, 0, 'sprite_gui', null, this));

            spr.setFrame(frame);
            spr.position.set(x, y);
            spr.visible = true;

            return spr;
        }
    }
}
