module Lttp.Utility {
    export class Pool<T> {

        private _pool: T[] = [];

        constructor(public game: Phaser.Game, private _ctor: any, public group: Phaser.Group = null) {
        }

        // main methods
        alloc(forceNew: boolean = false): T {
            var obj;

            if (!forceNew) {
                obj = this._pool.pop();
            }

            if (!obj) {
                obj = new this._ctor(this.game);

                if (this.group) {
                    this.group.add(obj);
                }
            }

            return obj;
        }

        free(obj: T): Pool<T> {
            this._pool.push(obj);

            return this;
        }

        // less common helpers
        preallocate(num: number): Pool<T> {
            for(var i = 0; i < num; ++i) {
                this.free(this.alloc(true));
            }

            return this;
        }

        clear(): Pool<T> {
            this._pool.length = 0;
            return this;
        }

        remove(obj: T): T {
            var idx = this._pool.indexOf(obj);

            if (idx !== -1) {
                this._pool.splice(idx, 1);
            }

            return obj;
        }

    }
}
