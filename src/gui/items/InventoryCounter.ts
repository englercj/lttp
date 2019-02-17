import { HudFont } from '../../fonts/HudFont';
import { GuiItem } from './GuiItem';

export class InventoryCounter extends GuiItem<number>
{
    icon: Phaser.GameObjects.Sprite;

    font: HudFont;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, value: number = 0)
    {
        super(scene, x, y, name, value);

        this.icon = scene.add.sprite(0, 0, 'sprite_gui', `hud/indicator-${this.name}.png`);
        this.add(this.icon);

        if (name === 'rupees')
            this.icon.x += 8;
        else if (name === 'bombs')
            this.icon.x += 4;

        this.font = new HudFont(scene, 0, 10, '', 16, 8);
        this.add(this.font);

        this.setValue(value);
    }

    setValue(val: number): this
    {
        super.setValue(val);

        const len = this.name === 'rupees' ? 3 : 2;
        let valStr = val.toString();

        while (valStr.length < len)
        {
            valStr = `0${valStr}`;
        }

        this.font.text = valStr;

        return this;
    }
}
