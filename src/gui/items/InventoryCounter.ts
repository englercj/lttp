import Game from '../../Game';
import HudFont from '../../fonts/Hud';
import GuiItem from './GuiItem';
import Hud from '../Hud';

export default class InventoryCounter extends GuiItem {
    icon: Phaser.Sprite;

    font: HudFont;

    constructor(game: Game, parent: Hud, x: number, y: number, name: string, value: number = 0) {
        super(game, parent, x, y, name, value);

        this.icon = game.add.sprite(0, 0, 'sprite_gui', 'hud/indicator-' + this.name + '.png', this);

        if (name === 'rupees') {
            this.icon.position.x += 8;
        }
        else if (name === 'bombs') {
            this.icon.position.x += 4;
        }

        this.font = new HudFont(game, 0, 10, '', 16, 8);
        this.add(this.font);

        this.setValue(value);
    }

    setValue(val: any) {
        const l = this.name === 'rupees' ? 3 : 2;
        val = val.toString();

        while (val.length < l) {
            val = '0' + val;
        }

        super.setValue(val);

        this.font.text = val;

        return this;
    }
}
