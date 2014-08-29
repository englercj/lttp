module Lttp.Levels {
    export class Level extends Phaser.State {
        levelKey: string = '';

        private packData: any;

        preload() {
            // should be loaded by the preloader state
            this.packData = this.cache.getJSON(Data.Constants.ASSET_TILEMAP_PACKS_KEY);
        }

        create() {
            super.create();

            var levelData: TiledMapData = <TiledMapData>this.cache.getTilemapData('tilemap_' + this.levelKey),
                level: Phaser.Tilemap = this.add.tilemap('tilemap_' + this.levelKey, levelData.tilewidth, levelData.tileheight, levelData.width, levelData.height),
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

                layer = level.createLayer(layerData.name, layerData.width, layerData.height);
                layer.visible = layerData.visible;
                layer.alpha = layerData.opacity;
                layer.position.set(layerData.x, layerData.y);
            }
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
