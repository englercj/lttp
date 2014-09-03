module Lttp.Utility {
    export class Pool<T> {

        private _pool: T[] = [];

        constructor(public game: Phaser.Game, private _ctor: any, public group: Phaser.Group = null) {
        }

        // main methods
        alloc(forceNew: boolean = false, ...args: any[]): T {
            var obj;

            if (!forceNew) {
                obj = this._pool.pop();
            }

            if (!obj) {
                args.unshift(this.game);
                obj = this._construct(this._ctor, args);

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

        private _construct(ctor, args) {
            function PoolObjectCtor(): void {
                return ctor.apply(this, args);
            }
            PoolObjectCtor.prototype = ctor.prototype;
            PoolObjectCtor.name = ctor.name;

            return new PoolObjectCtor();
        }

    }
}
