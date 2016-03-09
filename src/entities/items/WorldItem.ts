import Game from '../../Game';
import Entity from '../Entity';
import Constants from '../../data/Constants';

export default class WorldItem extends Entity {
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

        this.itemSound = game.add.sound('effect_item', Constants.AUDIO_EFFECT_VOLUME);
        this.rupeesSound1 = game.add.sound('effect_rupee1', Constants.AUDIO_EFFECT_VOLUME);
        this.rupeesSound2 = game.add.sound('effect_rupee2', Constants.AUDIO_EFFECT_VOLUME);

        this.frameKeys = {
            heart: 'hearts/heart.png',
            bombs: 'inventory/bombs_%d.png',
            arrows: 'inventory/arrows_%d.png',
            magic: 'magic/magic_%d.png',
            rupees: 'rupees_%d',
        };

        this.itemType = null;
        this.value = 0;

        let a = [1, 5, 20];

        for (let i = 0; i < a.length; ++i) {
            let n = a[i];
            this.animations.add('rupees_' + n, [
                'inventory/rupees_' + n + '_1.png',
                'inventory/rupees_' + n + '_2.png',
                'inventory/rupees_' + n + '_3.png',
            ], 6, true);
        }

        this.anchor.set(0, 1);

    }

    boot(item: any, forceLoot: string = '') {
        const loot = forceLoot || item.properties.loot;
        const type = loot.split('_')[0];
        const value = parseInt(loot.split('_')[1], 10) || 1;

        let frame = this.frameKeys[type] || 'items/' + loot + '.png';

        if (value) {
            frame = frame.replace('%d', value.toString());
        }

        this.itemType = type;
        this.value = value;

        if (type === 'rupees') {
            this.animations.play(frame);
        }
        else {
            this.animations.stop();
            this.setFrame(this.frames.getFrameByName(frame));
        }

        this.position.x = item.position.x; // + (item.width / 2);
        this.position.y = item.position.y; // - (item.height / 2);

        this.visible = true;

        // smallness
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
        }
        else {
            this.itemSound.play();
        }
    }
}
