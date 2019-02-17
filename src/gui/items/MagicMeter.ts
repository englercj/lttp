import { Game } from '../../Game';
import { GuiItem } from './GuiItem';
import { Hud } from '../Hud';

export class MagicMeter extends GuiItem<number>
{
    background: Phaser.GameObjects.Sprite;
    valueSprite: Phaser.GameObjects.Sprite;

    maxHeight: number;

    constructor(scene: Phaser.Scene, x: number, y: number, value: number = 0)
    {
        super(scene, x, y, 'magic', value);

        this.background = scene.add.sprite(0, 0, 'sprite_gui', 'hud/magic_meter.png');
        this.valueSprite = scene.add.sprite(3, 0, 'sprite_gui', 'hud/magic_meter_value.png');

        this.add([
            this.background,
            this.valueSprite,
        ]);

        this.maxHeight = this.valueSprite.height;

        this.setValue(value);
    }

    setValue(val: number): this
    {
        super.setValue(val);

        this.valueSprite.height = this.maxHeight * val;
        this.valueSprite.y = (this.maxHeight - this.valueSprite.height) + (4 * this.valueSprite.scaleY);

        return this;
    }
}
