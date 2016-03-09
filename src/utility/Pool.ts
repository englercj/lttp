import Game from '../Game';

interface IConstructable<T> {
    new(...args: any[]): T;
    prototype: T;
}

export default class Pool<T> {
    game: Game;
    group: Phaser.Group;

    private _ctor: IConstructable<T>;
    private _pool: T[] = [];

    constructor(game: Game, ctor: IConstructable<T>, group: Phaser.Group = null) {
        this.game = game;
        this.group = group;

        this._ctor = ctor;
    }

    // main methods
    alloc(forceNew: boolean = false, ...args: any[]): T {
        let obj: T;

        if (!forceNew) {
            obj = this._pool.pop();
        }

        if (!obj) {
            args.unshift(this.game);
            obj = this._construct(args);

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

    private _construct(args: any[]): T {
        switch (args.length) {
            case 0:
                return new this._ctor();
            case 1:
                return new this._ctor(args[0]);
            case 2:
                return new this._ctor(args[0], args[1]);
            case 3:
                return new this._ctor(args[0], args[1], args[2]);
            case 4:
                return new this._ctor(args[0], args[1], args[2], args[3]);
            case 5:
                return new this._ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return new this._ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            default:
                const ctor = this._ctor;
                function PoolObjectCtor(): void {
                    return ctor.apply(this, args);
                }
                PoolObjectCtor.prototype = ctor.prototype;

                return new PoolObjectCtor();
        }
    }
}
