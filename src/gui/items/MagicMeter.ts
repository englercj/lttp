import Game from '../../Game';
import GuiItem from './GuiItem';
import Hud from '../Hud';

export default class MagicMeter extends GuiItem {
    background: Phaser.Sprite;
    valueSprite: Phaser.Sprite;

    maxHeight: number;

    constructor(game: Game, parent: Hud, x: number, y: number, value: number = 0) {
        super(game, parent, x, y, 'magic', value);

        this.background = game.add.sprite(0, 0, 'sprite_gui', 'hud/magic_meter.png', this);
        this.valueSprite = game.add.sprite(3, 0, 'sprite_gui', 'hud/magic_meter_value.png', this);

        this.maxHeight = this.valueSprite.height;

        this.setValue(value);
    }

    setValue(val: any) {
        super.setValue(val);

        this.valueSprite.height = this.maxHeight * val;
        this.valueSprite.position.y = (this.maxHeight - this.valueSprite.height) + (4 * this.valueSprite.scale.y);

        return this;
    }
}
