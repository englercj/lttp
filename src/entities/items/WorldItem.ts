import { Entity } from '../Entity';
import { AUDIO_EFFECT_VOLUME } from '../../data/Constants';
import { IDictionary } from '../../utility/IDictionary';

export class WorldItem extends Entity
{
    itemSound: Phaser.Sound.BaseSound;
    rupeesSound1: Phaser.Sound.BaseSound;
    rupeesSound2: Phaser.Sound.BaseSound;

    frameKeys: IDictionary<string>;

    itemType: string;

    value: number;

    constructor(scene: Phaser.Scene)
    {
        super(scene, 'sprite_worlditems');

        this.setSensor(true);

        this.itemSound = this.scene.sound.add('effect_item', { volume: AUDIO_EFFECT_VOLUME });
        this.rupeesSound1 = this.scene.sound.add('effect_rupee1', { volume: AUDIO_EFFECT_VOLUME });
        this.rupeesSound2 = this.scene.sound.add('effect_rupee2', { volume: AUDIO_EFFECT_VOLUME });

        this.frameKeys = {
            heart: 'hearts/heart.png',
            bombs: 'inventory/bombs_%d.png',
            arrows: 'inventory/arrows_%d.png',
            magic: 'magic/magic_%d.png',
            rupees: 'rupees_%d',
        };

        this.itemType = null;
        this.value = 0;
        this.originY = 1;

        this.scene.matter.add.sprite
    }

    boot(item: any, forceLoot: string = '')
    {
        const loot = forceLoot || item.properties.loot;
        const type = loot.split('_')[0];
        const value = parseInt(loot.split('_')[1], 10) || 1;

        let frame = this.frameKeys[type] || 'items/' + loot + '.png';

        if (value)
        {
            frame = frame.replace('%d', value.toString());
        }

        this.itemType = type;
        this.value = value;

        if (type === 'rupees')
        {
            this.anims.play(frame);
        }
        else
        {
            this.anims.stop();
            this.setFrame(frame);
        }

        this.x = item.position.x; // + (item.width / 2);
        this.y = item.position.y; // - (item.height / 2);

        this.visible = true;
    }

    pickup()
    {
        this.visible = false;

        if (this.itemType === 'rupees')
        {
            this.rupeesSound1.play();
            this.scene.time.delayedCall(100, this.rupeesSound2.play, [], this.rupeesSound2);
        }
        else
        {
            this.itemSound.play();
        }
    }

    destroy()
    {
        super.destroy();

        this.itemSound.destroy();
        this.rupeesSound1.destroy();
        this.rupeesSound2.destroy();
    }
}
