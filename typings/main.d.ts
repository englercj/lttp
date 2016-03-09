/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/lz-string/typings/lz-string.d.ts" />
/// <reference path="../node_modules/phaser-tiled/typescript/phaser-tiled.d.ts" />

/* tslint:disable:no-internal-module */
declare module p2 {
    export interface IBodyEx {
        parent: Phaser.Physics.P2.Body;
    }

    export interface ISpringEx {
        parent: Phaser.Physics.P2.Spring;
    }
}
/* tslint:enable:no-internal-module */

// declare phaser-debug
declare module 'phaser-debug' {
    export = class Debug extends Phaser.Plugin {
        constructor(game: Phaser.Game, parent: PIXI.DisplayObject);
    }
}

// stub require so TS will shut up
declare var require: (file: string) => any;

// global types
declare type TCallback<R> = () => R;
declare type TPoint = (PIXI.Point|Phaser.Point|Phaser.Physics.P2.InversePointProxy);

declare type TTable<V> = { [index: string]: V };
declare type TArrayTable<V> = { [index: number]: V };

declare type TColorRGBA = number[];
