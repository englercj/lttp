module Lttp.States {
    export class State extends Phaser.State {

        addTilemap(key: string, group?: Phaser.Group) {
            var levelData: TiledMapData = <TiledMapData>(this.cache.getTilemapData('tilemap_' + key).data),
                level: Phaser.Tilemap = this.add.tilemap('tilemap_' + key, levelData.tilewidth, levelData.tileheight, levelData.width, levelData.height),
                layer: Phaser.TilemapLayer = null,
                tilesetData = null,
                layerData = null,
                i = 0, il = 0;

            // add each fo the tileset images
            for (i = 0, il = levelData.tilesets.length; i < il; ++i) {
                tilesetData = levelData.tilesets[i];

                level.addTilesetImage(tilesetData.name, tilesetData.name, tilesetData.tilewidth, tilesetData.tileheight, tilesetData.margin, tilesetData.spacing, tilesetData.firstgid);
            }

            // create each of the level's layers
            for (i = 0, il = levelData.layers.length; i < il; ++i) {
                layerData = levelData.layers[i];

                layer = level.createLayer(layerData.name, null, null, group);
                layer.visible = layerData.visible;
                layer.alpha = layerData.opacity;
                layer.position.set(layerData.x, layerData.y);
                layer.resizeWorld();
            }

            return level;
        }

    }

    class TiledMapData {
        width: number;
        height: number;

        tilewidth: number;
        tileheight: number;

        version: number;

        orientation: string; //TODO: make enum

        layers: TiledLayerData[];
        tilesets: TiledTilesetData[];

        properties: { [key: string]: string }
    }

    class TiledLayerData {
        data: number[];

        width: number;
        height: number;

        x: number;
        y: number;

        name: string;

        type: string; //TODO: make enum

        opacity: number;
        visible: boolean;

        properties: { [key: string]: string }
    }

    class TiledTilesetData {
        firstgid: number;

        name: string;

        image: string;
        imagewidth: number;
        imageheight: number;

        margin: number;
        spacing: number;

        tilewidth: number;
        tileheight: number;

        properties: { [key: string]: string }
    }
}
