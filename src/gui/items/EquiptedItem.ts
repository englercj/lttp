import { GuiItem } from './GuiItem';

export class EquiptedItem extends GuiItem<string>
{
    frameSprite: Phaser.GameObjects.Sprite;
    itemSprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number, value: string = '')
    {
        super(scene, x, y, 'equipted', value);

        this.frameSprite = scene.add.sprite(0, 0, 'sprite_gui', 'hud/item-frame.png');
        this.itemSprite = scene.add.sprite(6, 0, 'sprite_gui', 'items/lantern.png');

        this.add(this.frameSprite);
        this.add(this.itemSprite);

        this.itemSprite.visible = false;
        // this.itemSprite.scale.set(2);

        this.setValue(value);
    }

    setValue(val: string): this
    {
        super.setValue(val);

        if (!val)
        {
            this.itemSprite.visible = false;
        }
        else
        {
            this.itemSprite.visible = true;
            this.itemSprite.setFrame(`items/${val}.png`);
        }

        return this;
    }
}
