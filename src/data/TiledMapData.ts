export interface ITiledMapData {
    width: number;
    height: number;

    tilewidth: number;
    tileheight: number;

    version: number;

    orientation: string; //TODO: make enum

    layers: ITiledLayerData[];
    tilesets: ITiledTilesetData[];

    properties: { [key: string]: string };
}

export interface ITiledLayerData {
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

export interface ITiledTilesetData {
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
