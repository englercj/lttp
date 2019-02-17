import * as Storage from './Storage';
import { Player } from '../entities/Player';
import { PlayerInventory } from '../data/PlayerInventory';
import { IItemDescriptor } from '../data/ItemDescriptors';
import { IRectangle, IObjectlayer, TObject } from 'gl-tiled';
import { IDictionary } from './IDictionary';

export interface IZoneData
{
    objects: { properties: { loot: string } }[];
}

export interface IMapData
{
    zones: IDictionary<IZoneData>;
}

export class Save
{
    private static VERSION = 1;

    // player data
    inventory = new PlayerInventory();
    equipted: IItemDescriptor = null;

    health = 3;
    maxHealth = 3;

    magic = 0;
    maxMagic = 10;

    // other save data
    mapData: IDictionary<IMapData> = {};

    lastUsedExit: IRectangle = null;

    saveFileExists = false;

    // save slot info
    private _cacheKey: string;

    constructor(public readonly slot: number, public name: string = "")
    {
        this._cacheKey = this._key(slot);
    }

    save(player?: Player): this
    {
        // load the player data into this save object
        this._readFrom(player);

        this.saveFileExists = true;

        Storage.save(this._cacheKey, this);

        return this;
    }

    load(): this
    {
        const data = Storage.load(this._cacheKey);

        if (data)
        {
            this._readFrom(data);
            this.saveFileExists = true;
        }

        return this;
    }

    remove(): this
    {
        Storage.remove(this._cacheKey);

        this.saveFileExists = false;

        return this;
    }

    updateZoneData(map: string, layer: IObjectlayer)
    {
        const mapData = this.mapData[map] || { zones: {} };
        const zoneData = mapData.zones[layer.name] || { objects: [] };

        zoneData.objects.length = 0;

        // TODO: Using the object index means if the map changes (adding a missing object, for example)
        // then the indexes change and saved data is invalid. Instead there should be a keying system.
        // Potentially hashing some data about the object to generate a unique key?

        for (let i = 0; i < layer.objects.length; ++i)
        {
            zoneData.objects.push({
                properties: {
                    loot: layer.objects[i].properties.loot,
                },
            });
        }

        mapData.zones[layer.name] = zoneData;
        this.mapData[map] = mapData;
    }

    updateExit(exit: IRectangle)
    {
        this.lastUsedExit = exit;
    }

    copyTo(player: Player)
    {
        player.name = this.name;

        player.inventory = this.inventory;
        player.equipted = this.equipted;

        player.health = this.health;
        player.maxHealth = this.maxHealth;

        player.magic = this.magic;
        player.maxMagic = this.maxMagic;
    }

    private _readFrom(data: (Player|Save))
    {
        if (!data)
            return;

        this.name = data.name;

        this.inventory = data.inventory;
        this.equipted = data.equipted;

        this.health = data.health;
        this.maxHealth = data.maxHealth;

        this.magic = data.magic;
        this.maxMagic = data.maxMagic;

        if (!(data instanceof Player))
        {
            this.mapData = data.mapData;
            this.lastUsedExit = data.lastUsedExit;
        }
    }

    private _key(slot: number = this.slot, version: number = Save.VERSION)
    {
        return 'save:' + version  + ':' + slot;
    }

    // TODO: Migrations from old to new versions of saves. This way when people patch
    // it should automatically upgrade their saves and they shouldn't loase any data.
}
