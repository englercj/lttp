module Lttp {
    export type IPoint = (Phaser.Point|Phaser.Physics.P2.InversePointProxy);

    export class Game extends Phaser.Game {

        player: Entities.Player = null;

        loadedSave: Utility.Save = null;

        effects: Effects.Effects = null;

        static timer: Phaser.Timer = null;

        private _autosaveInterval: number;

        constructor() {
            super(
                Data.Constants.GAME_WIDTH,
                Data.Constants.GAME_HEIGHT,
                Phaser.AUTO,// renderer
                'game',     // DOM parent ID
                null,       // default state obj
                false,      // transparent
                false,      // antialias
                { p2: true }// physics config
            );

            this.addStates(States, 'state', ['State', 'MainMenuActiveMenu']);
            this.addStates(Levels, 'level', ['Level']);

            this.state.start('state_boot');
        }

        addStates(mod: any, type: string, blacklist: Array<string>) {
            for(var name in mod) {
                if (blacklist.indexOf(name) !== -1) continue;

                this.state.add(type + '_' + name.toLowerCase(), mod[name], false);
            }
        }

        boot() {
            super.boot();

            // This sets the limits for Phaser's auto scaling
            this.scale.minWidth = Data.Constants.GAME_WIDTH;
            this.scale.minHeight = Data.Constants.GAME_HEIGHT;

            // this.scale.maxWidth = Data.Constants.GAME_WIDTH * Data.Constants.GAME_SCALE;
            // this.scale.maxHeight = Data.Constants.GAME_HEIGHT * Data.Constants.GAME_SCALE;

            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            // Then we tell Phaser that we want it to scale between those values, the largest the browser can fit
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setScreenSize();

            // capture keyboard keys
            this.input.keyboard.addKeyCapture([
                Phaser.Keyboard.SPACEBAR,
                Phaser.Keyboard.ENTER,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT
            ]);

            // start polling for gamepad input
            this.input.gamepad.start();

            this.add.plugin(new Phaser.Plugin.Debug(this));
            this.add.plugin(new Phaser.Plugin.Tiled(this));

            this.effects = <Effects.Effects>this.add.plugin(new Effects.Effects(this));

            this.sound.mute = true;
        }

        gamePaused(event: Object) {
            super.gamePaused(event);

            this.sound.pauseAll();
        }

        gameResumed(event: Object) {
            super.gameResumed(event);

            this.sound.resumeAll();
        }

        startAutosave() {
            clearInterval(this._autosaveInterval);

            this._autosaveInterval = setInterval(this.save.bind(this), Data.Constants.GAME_SAVE_INTERVAL);
        }

        save(exit?: Phaser.Plugin.Tiled.TiledObject, previousLayer?: Phaser.Plugin.Tiled.Objectlayer) {
            if (exit) {
                this.loadedSave.updateExit(exit);
            }

            if (previousLayer) {
                this.loadedSave.updateZoneData(previousLayer);
            }

            this.loadedSave.save(this.player);
        }

    }
}
