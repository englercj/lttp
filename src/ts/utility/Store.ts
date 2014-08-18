module Lttp.Utility {
    export class Storage {

        public static save(key: string, value: any) {
            localStorage.setItem(key, JSON.stringify(value));
        }

        public static load(key: string) {
            var val = localStorage.getItem(key);

            try {
                return JSON.parse(val);
            } catch(e) {
                return val;
            }
        }

        public static remove(key: string) {
            localStorage.removeItem(key);
        }
    }
}
