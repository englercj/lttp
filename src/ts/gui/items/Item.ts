module Lttp.Gui.Items {
    export class Item extends Phaser.Group {
        value: any;

        constructor(game: Phaser.Game, parent: Gui.Hud, x: number, y: number, name: string, value: any = 0) {
            super(game, parent, name);

            this.value = value;

            this.position.set(x, y);
        }

        setValue(val: any) {
            this.value = val;

            return this;
        }
    }
}
