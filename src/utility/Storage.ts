import lzstring = require('lz-string');

export default class Storage {
    static save(key: string, value: any) {
        localStorage.setItem(key, lzstring.compressToUTF16(JSON.stringify(value)));
    }

    static load(key: string) {
        const val: string = localStorage.getItem(key);

        try {
            return JSON.parse(lzstring.decompressFromUTF16(val));
        }
        catch (e) {
            return val;
        }
    }

    static remove(key: string) {
        localStorage.removeItem(key);
    }
}
