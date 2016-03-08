export default class Storage {
    static save(key: string, value: any) {
        localStorage.setItem(key, LZString.compressToUTF16(JSON.stringify(value)));
    }

    static load(key: string) {
        var val = localStorage.getItem(key);

        try {
            return JSON.parse(LZString.decompressFromUTF16(val));
        }
        catch(e) {
            return val;
        }
    }

    static remove(key: string) {
        localStorage.removeItem(key);
    }
}
