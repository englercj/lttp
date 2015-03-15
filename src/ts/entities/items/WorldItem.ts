module Lttp.Entities.Items {
    export class WorldItem extends Entities.Entity {
        itemSound: Phaser.Sound;
        rupeesSound1: Phaser.Sound;
        rupeesSound2: Phaser.Sound;

        frameKeys: { [key: string]: string };

        itemType: string;

        value: number;

        constructor(game: Game) {
            super(game, 'sprite_worlditems');

            this.frames = game.cache.getFrameData('sprite_worlditems');

            this.body.data.shapes[0].sensor = true;

            this.itemSound = game.add.sound('effect_item', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.rupeesSound1 = game.add.sound('effect_rupee1', Data.Constants.AUDIO_EFFECT_VOLUME);
            this.rupeesSound2 = game.add.sound('effect_rupee2', Data.Constants.AUDIO_EFFECT_VOLUME);

            this.frameKeys = {
                heart: 'hearts/heart.png',
                bombs: 'inventory/bombs_%d.png',
                arrows: 'inventory/arrows_%d.png',
                magic: 'magic/magic_%d.png',
                rupees: 'rupees_%d'
            };

            this.itemType = null;
            this.value = 0;

            for(var i = 0, a = [1,5,20], n; n = a[i]; ++i) {
                this.animations.add('rupees_' + n, [
                    'inventory/rupees_' + n + '_1.png',
                    'inventory/rupees_' + n + '_2.png',
                    'inventory/rupees_' + n + '_3.png'
                ], 6, true);
            }

            this.anchor.set(0, 1);

        }

        boot(item: any, forceLoot: string = '') {
            var loot = forceLoot || item.properties.loot,
                type = loot.split('_')[0],
                value = parseInt(loot.split('_')[1], 10) || 1,
                frame = this.frameKeys[type] || 'items/' + loot + '.png';

            if (value) {
                frame = frame.replace('%d', value.toString());
            }

            this.itemType = type;
            this.value = value;

            if(type === 'rupees') {
                this.animations.play(frame);
            } else {
                this.animations.stop();
                this.setFrame(this.frames.getFrameByName(frame));
            }

            this.position.x = item.position.x;// + (item.width / 2);
            this.position.y = item.position.y;// - (item.height / 2);

            this.visible = true;

            //smallness
            // this.hitArea = new gf.Rectangle(4, 4, 8, 8);

            // if(psys)
            //     this.enablePhysics(psys);
        }

        pickup() {
            this.visible = false;
            // this.disablePhysics();

            if (this.itemType === 'rupees') {
                this.rupeesSound1.play();

                Game.timer.add(100, function () {
                    this.rupeesSound2.play();
                }, this);
            } else {
                this.itemSound.play();
            }
        }

        dropLoot() {
            if (!this.properties.loot) return;

            var obj = (<Lttp.Game>this.game).player.itemPool.alloc();

            obj.boot(this);
            (<Lttp.Game>this.game).player.parent.addChild(obj);

            // TODO: remove loot from level for next time
            // this._markEmpty(this);
        }

    }
}
