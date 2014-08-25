module Lttp.Gui.Items {
    export class InventoryCounter extends Gui.Items.Item {
        icon: Phaser.Sprite;

        font: Fonts.Hud;

        constructor(game: Phaser.Game, parent: Lttp.Gui.Hud, x: number, y: number, name: string, value: number = 0) {
            super(game, parent, x, y, name, value);

            this.icon = game.add.sprite(0, 0, 'sprite_gui', 'hud/indicator-' + this.name + '.png', this);

            if(name === 'rupees') {
                this.icon.position.x += 13;
            }
            else if(name === 'bombs') {
                this.icon.position.x += 5;
            }

            this.font = new Fonts.Hud();
            this.font.position.y = 30;
            this.add(this.font);

            this.setValue(value);
        }

        setValue(val: any) {
            var l = this.name === 'rupees' ? 3 : 2;
            val = val.toString();

            while(val.length < l) {
                val = '0' + val;
            }

            super.setValue(val);

            this.font.text = val;

            return this;
        }
    }
}
