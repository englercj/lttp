import * as lzstring from 'lz-string';

export function save(key: string, value: any): void
{
    localStorage.setItem(key, lzstring.compressToUTF16(JSON.stringify(value)));
}

export function load(key: string): any
{
    const val: string = localStorage.getItem(key);

    try
    {
        return JSON.parse(lzstring.decompressFromUTF16(val));
    }
    catch (e)
    {
        return val;
    }
}

export function remove(key: string): void
{
    localStorage.removeItem(key);
}
