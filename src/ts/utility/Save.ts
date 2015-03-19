module Lttp.Utility {
    export class Save {

        // player data
        inventory: Data.PlayerInventory;
        equipted: Data.ItemDescriptor;

        health: number;
        maxHealth: number;

        magic: number;
        maxMagic: number;

        position: number[] = [0, 0];

        // other save data
        map: string = '';

        hasData: boolean = false;

        private key: string;

        constructor(public slot: number, public name?: string) {
            this.key = 'player:' + slot;
        }

        save(player?: Entities.Player, map?: string, position?: Phaser.Point): Save {
            // load the player data into this save object
            this.loadFrom(player, map, position);

            Storage.save(this.key, this);

            return this;
        }

        load(): Save {
            var data = Storage.load(this.key);

            if (data) {
                this.loadFrom(data);
            }

            return this;
        }

        remove() {
            Storage.remove(this.key);

            this.hasData = false;
        }

        copyTo(player: Entities.Player) {
            player.inventory = this.inventory || new Data.PlayerInventory();
            player.equipted = this.equipted || null;

            player.health = this.health || 3;
            player.maxHealth = this.maxHealth || 3;

            player.magic = this.magic || 0;
            player.maxMagic = this.maxMagic || 10;

            player.position.x = this.position[0] || 0;
            player.position.y = this.position[1] || 0;

            player.saveData = this;
        }

        private loadFrom(data, map?: string, position?: Phaser.Point) {
            if (!data) {
                return;
            }

            this.name = data.name || '';

            this.inventory = data.inventory || new Data.PlayerInventory();
            this.equipted = data.equipted || null;

            this.health = data.health || 3;
            this.maxHealth = data.maxHealth || 3;

            this.magic = data.magic || 0;
            this.maxMagic = data.maxMagic || 10;

            this.map = map || data.map || 'linkshouse';

            position = position || data.position || [120, 209];

            if (Array.isArray(position)) {
                this.position[0] = position[0] || 120;
                this.position[1] = position[1] || 209;
            }
            else {
                this.position[0] = position.x || 120;
                this.position[1] = position.y || 209;
            }

            this.hasData = true;
        }

    }
}
