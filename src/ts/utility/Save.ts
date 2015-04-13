module Lttp.Utility {
    export class Save {

        // player data
        inventory: Data.PlayerInventory = new Data.PlayerInventory();
        equipted: Data.ItemDescriptor = null;

        health: number = 3;
        maxHealth: number = 3;

        magic: number = 0;
        maxMagic: number = 10;

        position: number[] = [125, 140];

        // other save data
        mapName: string = 'linkshouse';
        mapData: any = {};

        saveFileExists: boolean = false;

        private key: string;

        constructor(public slot: number, public name?: string) {
            this.key = 'player:' + slot;
        }

        save(player?: Entities.Player, map: string = 'linkshouse', position?: Phaser.Point): Save {
            // load the player data into this save object
            this.loadFrom(player, map, position);

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

            player.position.x = this.position[0];
            player.position.y = this.position[1];
        }

        private loadFrom(data: (Entities.Player|Save), map?: string, position?: (Phaser.Point|number[])) {
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

            this.mapName = map || (<Save>data).mapName;

            position = position || data.position;

            if (Array.isArray(position)) {
                this.position[0] = (<number[]>position)[0];
                this.position[1] = (<number[]>position)[1];
            }
            else {
                this.position[0] = (<Phaser.Point>position).x;
                this.position[1] = (<Phaser.Point>position).y;
            }
        }

    }
}
