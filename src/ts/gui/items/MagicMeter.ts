/// <reference path="Item.ts" />

module Lttp.Gui.Items {
    export class MagicMeter extends Gui.Items.Item {
        background: Phaser.Sprite;
        valueSprite: Phaser.Sprite;

        maxHeight: number;

        constructor(game: Phaser.Game, parent: Lttp.Gui.Hud, x: number, y: number, value: number = 0) {
            super(game, parent, x, y, 'magic', value);

            this.background = game.add.sprite(0, 0, 'sprite_gui', 'hud/magic_meter.png', this);
            this.valueSprite = game.add.sprite(6, 0, 'sprite_gui', 'hud/magic_meter_value.png', this);

            this.maxHeight = this.valueSprite.height;

            this.setValue(value);
        }

        setValue(val: any) {
            super.setValue(val);

            this.valueSprite.height = this.maxHeight * val;
            this.valueSprite.position.y = (this.maxHeight - this.valueSprite.height) + (8 * this.valueSprite.scale.y);

            return this;
        }
    }
}
