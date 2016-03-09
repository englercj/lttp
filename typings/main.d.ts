/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/lz-string/typings/lz-string.d.ts" />
/// <reference path="../node_modules/phaser-tiled/typescript/phaser-tiled.d.ts" />

declare module p2 {
    export interface BodyEx {
        parent: Phaser.Physics.P2.Body;
    }

    export interface SpringEx {
        parent: Phaser.Physics.P2.Spring;
    }
}
