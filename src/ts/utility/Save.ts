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

        private _cacheKey: string;

        private static VERSION: number = 1;

        constructor(public slot: number, public name?: string) {
            this._cacheKey = this._key(slot);
        }

        save(player?: Entities.Player): Save {
            // load the player data into this save object
            this.loadFrom(player);

            this.saveFileExists = true;

            Storage.save(this._cacheKey, this);

            return this;
        }

        load(): Save {
            var data = Storage.load(this._cacheKey);

            if (data) {
                this.loadFrom(data);
                this.saveFileExists = true;
            }

            return this;
        }

        remove() {
            Storage.remove(this._cacheKey);

            this.saveFileExists = false;
        }

        updateZoneData(layer: Phaser.Plugin.Tiled.Objectlayer) {
            var mapData = this.mapData[layer.map.name] || { zones: {} },
                zoneData = mapData.zones[layer.name] || { objects: [] };

            zoneData.objects.length = 0;

            // TODO: Using the object index means if the map changes (adding a missing object, for example)
            // then the indexes change and saved data is invalid. Instead there should be a keying system.
            // Potentially hashing some data about the object to generate a unique key?

            for (var i = 0, il = layer.objects.length; i < il; ++i) {
                zoneData.objects.push({
                    properties: {
                        loot: layer.objects[i].properties.loot
                    }
                });
            }

            mapData.zones[layer.name] = zoneData;
            this.mapData[layer.map.name] = mapData;
        }

        updateExit(exit: Phaser.Plugin.Tiled.TiledObject) {
            this.lastUsedExit = exit;
        }

        copyTo(player: Entities.Player) {
            player.name = this.name;

            player.inventory = this.inventory;
            player.equipted = this.equipted;

            player.health = this.health;
            player.maxHealth = this.maxHealth;

            player.magic = this.magic;
            player.maxMagic = this.maxMagic;
        }

        private loadFrom(data: (Entities.Player|Save)) {
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

        private _key(slot: number = this.slot, version: number = Save.VERSION): string {
            return 'save:' + version  + ':' + slot;
        }

        // TODO: Migrations from old to new versions of saves. This way when people patch
        // it should automatically upgrade their saves and they shouldn't loase any data.

    }
}
