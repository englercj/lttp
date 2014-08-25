module Lttp.Gui.Items {
    export class EquiptedItem extends Gui.Items.Item {
        frameSprite: Phaser.Sprite;
        itemSprite: Phaser.Sprite;

        frames: Phaser.FrameData;

        constructor(game: Phaser.Game, parent: Lttp.Gui.Hud, x: number, y: number, value: number = 0) {
            super(game, parent, x, y, 'equipted', value);

            this.frames = game.cache.getFrameData('sprite_gui');

            this.frameSprite = game.add.sprite(0, 0, 'sprite_gui', 'hud/item-frame.png', this);
            this.itemSprite = game.add.sprite(6, 0, 'sprite_gui', 'items/lantern.png', this);

            this.itemSprite.visible = false;
            this.itemSprite.scale.set(2);

            this.setValue(value);
        }

        setValue(val: any) {
            super.setValue(val);

            var tx = this.frames.getFrameByName('items/' + val + '.png');

            if (!tx) {
                this.itemSprite.visible = false;
            } else {
                this.itemSprite.visible = true;
                this.itemSprite.setFrame(tx);
            }

            return this;
        }
    }
}
