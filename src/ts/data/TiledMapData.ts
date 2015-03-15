module Lttp.Data {

    export interface TiledMapData {
        width: number;
        height: number;

        tilewidth: number;
        tileheight: number;

        version: number;

        orientation: string; //TODO: make enum

        layers: TiledLayerData[];
        tilesets: TiledTilesetData[];

        properties: { [key: string]: string };
    }

    export interface TiledLayerData {
        data: number[];

        width: number;
        height: number;

        x: number;
        y: number;

        name: string;

        type: string; //TODO: make enum

        opacity: number;
        visible: boolean;

        properties: { [key: string]: string };
    }

    export interface TiledTilesetData {
        firstgid: number;

        name: string;

        image: string;
        imagewidth: number;
        imageheight: number;

        margin: number;
        spacing: number;

        tilewidth: number;
        tileheight: number;

        properties: { [key: string]: string };
    }

}
