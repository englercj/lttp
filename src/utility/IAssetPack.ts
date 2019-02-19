export interface IAssetData
{
    type: string;
    subtype: string;
    key: string;
    name: string;
    url: string;
    originalUrl: string;
}

export interface IAssetMeta
{
    generated: string;
    version: string;
    app: string;
    url: string;
}

export interface IAssetPackIndex
{
    [key: string]: IAssetData[];
}

export type IAssetPack = IAssetPackIndex & { meta: IAssetMeta; };
