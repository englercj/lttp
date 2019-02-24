import { IProperty } from "gl-tiled";
import { IDictionary } from "../utility/IDictionary";

export type TPropertyValue = string | number | boolean;

export function getTiledProperty(key: string, properties: IProperty[]): IProperty | null
{
    for (let i = 0; i < properties.length; ++i)
    {
        const prop = properties[i];

        if (prop.name === key)
        {
            return prop;
        }
    }

    return null;
}

export function getTiledPropertyValue(key: string, properties: IProperty[]): TPropertyValue | null
{
    const prop = getTiledProperty(key, properties);

    return prop && prop.value;
}

export function getTiledPropertyMap(properties: IProperty[]): IDictionary<TPropertyValue>
{
    const ret: IDictionary<TPropertyValue> = {};

    for (let i = 0; i < properties.length; ++i)
    {
        const prop = properties[i];

        ret[prop.name] = prop.value;
    }

    return ret;
}
