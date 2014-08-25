module Lttp.Gui {
    export class Hud extends Phaser.Group {
        items: any;

        constructor(game: Phaser.Game, parent?: any) {
            super(game, parent, 'HUD');

            // this.scale.set(Data.Constants.GAME_SCALE / 2);

            this.items = {
                equipted:   new Gui.Items.MagicMeter(game, this, 40, 36, 1),
                rupees:     new Gui.Items.EquiptedItem(game, this, 75, 42, ''),
                bombs:      new Gui.Items.InventoryCounter(game, this, 135, 30, 'rupees', 0),
                arrows:     new Gui.Items.InventoryCounter(game, this, 195, 30, 'bombs', 0),
                magicMeter: new Gui.Items.InventoryCounter(game, this, 245, 30, 'arrows', 0),
                life:       new Gui.Items.LifeMeter(game, this, 320, 35, 3)
            };
        }

        updateValues(link) {
            this.items.equipted.setValue(link.equipted);
            this.items.rupees.setValue(link.inventory.rupees);
            this.items.bombs.setValue(link.inventory.bombs);
            this.items.arrows.setValue(link.inventory.arrows);

            this.items.magicMeter.setValue(link.magic / link.maxMagic);

            this.items.life.max = link.maxHealth;
            this.items.life.setValue(link.health);
        }
    }
}
