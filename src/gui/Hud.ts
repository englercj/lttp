import { Player } from '../entities/Player';

import { MagicMeter } from './items/MagicMeter';
import { EquiptedItem } from './items/EquiptedItem';
import { InventoryCounter } from './items/InventoryCounter';
import { LifeMeter } from './items/LifeMeter';
import { hasOwnKey } from '../utility/hasKey';

export interface IHudItems
{
    magic:      MagicMeter;
    equipted:   EquiptedItem;
    rupees:     InventoryCounter;
    bombs:      InventoryCounter;
    arrows:     InventoryCounter;
    life:       LifeMeter;
}

export class Hud extends Phaser.GameObjects.Container
{
    items: IHudItems;

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y);

        this.items = {
            magic:      new MagicMeter(scene, 20, 18, 1),
            equipted:   new EquiptedItem(scene, 38, 20, ''),
            rupees:     new InventoryCounter(scene, 68, 15, 'rupees', 0),
            bombs:      new InventoryCounter(scene, 98, 15, 'bombs', 0),
            arrows:     new InventoryCounter(scene, 123, 15, 'arrows', 0),
            life:       new LifeMeter(scene, 160, 18, 3),
        };

        for (const k in this.items)
        {
            if (hasOwnKey(this.items, k))
            {
                this.add(this.items[k]);
            }
        }
    }

    updateValues(link: Player)
    {
        this.items.magic.setValue(link.magic / link.maxMagic);

        this.items.equipted.setValue(link.equipted.name);
        this.items.rupees.setValue(link.inventory.rupees);
        this.items.bombs.setValue(link.inventory.bombs);
        this.items.arrows.setValue(link.inventory.arrows);

        this.items.life.max = link.maxHealth;
        this.items.life.setValue(link.health);
    }
}
