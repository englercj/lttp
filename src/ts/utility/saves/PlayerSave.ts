/// <reference path="Save.ts" />

module Lttp.Utility {
    export interface PlayerSaveData {
        player: Entities.Player;
        map: Levels.Level;
        position: Phaser.Point;
    }

    export class PlayerSave extends Save {

        constructor(public slot: number, public name: string) {
            super('link_' + slot);

            this.data.name = name;
            this.data.slot = slot;
        }

        save(data: PlayerSaveData) {
            this.data.player = data.player;
            this.data.map = data.map;
            this.data.position = data.position;

            super.save();
        }

    }
}
