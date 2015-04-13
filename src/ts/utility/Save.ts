module Lttp.Utility {
    export class Save {

        // player data
        inventory: Data.PlayerInventory = new Data.PlayerInventory();
        equipted: Data.ItemDescriptor = null;

        health: number = 3;
        maxHealth: number = 3;

        magic: number = 0;
        maxMagic: number = 10;

        // other save data
        mapData: any = {};

        lastUsedExit: any = {
            name: 'linkshouse',
            properties: {
                loc: [125, 140]
            }
        };

        saveFileExists: boolean = false;

        private key: string;

        constructor(public slot: number, public name?: string) {
            this.key = 'player:' + slot;
        }

        save(player?: Entities.Player, map: string = 'linkshouse'): Save {
            // load the player data into this save object
            this.loadFrom(player, map);

            this.saveFileExists = true;

            Storage.save(this.key, this);

            return this;
        }

        load(): Save {
            var data = Storage.load(this.key);

            if (data) {
                this.loadFrom(data);
                this.saveFileExists = true;
            }

            return this;
        }

        remove() {
            Storage.remove(this.key);

            this.saveFileExists = false;
        }

        updateZoneData(layer: Phaser.Plugin.Tiled.Objectlayer) {
            var mapData = this.mapData[layer.map.name] || { zones: {} },
                zoneData = mapData.zones[layer.name] || { objects: [] };

            zoneData.objects.length = 0;

            for (var i = 0, il = layer.objects.length; i < il; ++i) {
                zoneData.objects.push({
                    properties: {
                        loot: layer.objects[i].properties.loot
                    }
                });
            }

            mapData.zones[layer.name] = zoneData;
            this.mapData[layer.map.name] = mapData;

            this.save();
        }

        copyTo(player: Entities.Player) {
            player.inventory = this.inventory;
            player.equipted = this.equipted;

            player.health = this.health;
            player.maxHealth = this.maxHealth;

            player.magic = this.magic;
            player.maxMagic = this.maxMagic;
        }

        private loadFrom(data: (Entities.Player|Save), map?: string) {
            if (!data) {
                return;
            }

            this.name = data.name;

            this.inventory = data.inventory;
            this.equipted = data.equipted;

            this.health = data.health;
            this.maxHealth = data.maxHealth;

            this.magic = data.magic;
            this.maxMagic = data.maxMagic;

            if (data instanceof Save) {
                this.mapData = data.mapData;

                this.lastUsedExit = data.lastUsedExit;
            }
        }

    }
}
