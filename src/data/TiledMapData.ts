export interface ITiledMapData {
    width: number;
    height: number;

    tilewidth: number;
    tileheight: number;

    version: number;

    orientation: string; // TODO: make enum

    layers: ITiledLayerData[];
    tilesets: ITiledTilesetData[];

    properties: TTable<string>;
}

export interface ITiledLayerData {
    data: number[];

    width: number;
    height: number;

    x: number;
    y: number;

    name: string;

    type: string; // TODO: make enum

    opacity: number;
    visible: boolean;

    properties: TTable<string>;
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

    properties: TTable<string>;
}
