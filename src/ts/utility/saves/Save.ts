module Lttp.Utility {
    export class Save {
        constructor(public key: string, public data: any = {}) {}

        save(data?: any) {
            if (data !== undefined) {
                this.data = data;
            }

            Storage.save(this.key, this.data);
        }

        load() {
            return this.data = Storage.load(this.key);
        }

        remove() {
            Storage.remove(this.key);
        }
    }
}
