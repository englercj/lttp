import Game from '../../Game';
import Hud from '../Hud';

export default class GuiItem extends Phaser.Group {
    game: Game;

    value: any;

    constructor(game: Game, parent: Hud, x: number, y: number, name: string, value: any = 0) {
        super(game, parent, name);

        this.value = value;

        this.position.set(x, y);
    }

    setValue(val: any) {
        this.value = val;

        return this;
    }
}
