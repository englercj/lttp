import lzstring = require('lz-string');

export default {
    save(key: string, value: any) {
        localStorage.setItem(key, lzstring.compressToUTF16(JSON.stringify(value)));
    },

    load(key: string) {
        const val: string = localStorage.getItem(key);

        try {
            return JSON.parse(lzstring.decompressFromUTF16(val));
        }
        catch (e) {
            return val;
        }
    },

    remove(key: string) {
        localStorage.removeItem(key);
    },
};
