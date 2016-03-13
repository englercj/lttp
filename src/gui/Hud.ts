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
            magic:      new MagicMeter(game, this, 20, 18, 1),
            equipted:   new EquiptedItem(game, this, 38, 20, ''),
            rupees:     new InventoryCounter(game, this, 68, 15, 'rupees', 0),
            bombs:      new InventoryCounter(game, this, 98, 15, 'bombs', 0),
            arrows:     new InventoryCounter(game, this, 123, 15, 'arrows', 0),
            life:       new LifeMeter(game, this, 160, 18, 3),
        };
    }

    updateValues(link: Player) {
        this.items.magic.setValue(link.magic / link.maxMagic);

        this.items.equipted.setValue(link.equipted);
        this.items.rupees.setValue(link.inventory.rupees);
        this.items.bombs.setValue(link.inventory.bombs);
        this.items.arrows.setValue(link.inventory.arrows);

        this.items.life.max = link.maxHealth;
        this.items.life.setValue(link.health);
    }
}
