import Game from '../Game';
import Player from '../entities/Player';

import MagicMeter from './items/MagicMeter';
import EquiptedItem from './items/EquiptedItem';
import InventoryCounter from './items/InventoryCounter';
import LifeMeter from './items/LifeMeter';

export default class Hud extends Phaser.Group {
    game: Game;

    items: any;

    constructor(game: Game, parent?: any) {
        super(game, parent, 'HUD');

        this.items = {
            equipted:   new MagicMeter(game, this, 40, 36, 1),
            rupees:     new EquiptedItem(game, this, 75, 42, ''),
            bombs:      new InventoryCounter(game, this, 135, 30, 'rupees', 0),
            arrows:     new InventoryCounter(game, this, 195, 30, 'bombs', 0),
            magicMeter: new InventoryCounter(game, this, 245, 30, 'arrows', 0),
            life:       new LifeMeter(game, this, 320, 35, 3),
        };
    }

    updateValues(link: Player) {
        this.items.equipted.setValue(link.equipted);
        this.items.rupees.setValue(link.inventory.rupees);
        this.items.bombs.setValue(link.inventory.bombs);
        this.items.arrows.setValue(link.inventory.arrows);

        this.items.magicMeter.setValue(link.magic / link.maxMagic);

        this.items.life.max = link.maxHealth;
        this.items.life.setValue(link.health);
    }
}
