/// <reference path="Save.ts" />

module Lttp.Utility {
    export interface PlayerSaveData {
        player: Entities.Player;
        map: Levels.Level;
        position: Phaser.Point;
    }

    export class PlayerSave extends Utility.Save {

        constructor(public slot: number, public name?: string) {
            super('link_' + slot);

            this.data.name = name;
            this.data.slot = slot;
        }

        save(data?: PlayerSaveData) {
            this.data.player = data ? data.player : null;
            this.data.map = data ? data.map : null;
            this.data.position = data ? data.position : null;

            super.save();
        }

    }
}
