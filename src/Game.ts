import Player from './entities/Player';
import Save from './utility/Save';
import Effects from './effects/Effects';
import Constants from './data/Constants';

// states
import BootState from './states/Boot';
import IntroState from './states/Intro';
import MainMenuState from './states/MainMenu';
import PlayState from './states/Play';
import PreloaderState from './states/Preloader';

// levels, todo: remove the need for a class per level
// use a single class for Level and unload them as we go along.
import Cave034 from './levels/Cave034';
import Darkworld from './levels/Darkworld';
import Lightworld from './levels/Lightworld';
import LinksHouse from './levels/LinksHouse';

export default class Game extends Phaser.Game {

    player: Player = null;

    loadedSave: Save = null;

    effects: Effects = null;

    static timer: Phaser.Timer = null;

    private _autosaveInterval: number;

    constructor() {
        super(
            Constants.GAME_WIDTH,
            Constants.GAME_HEIGHT,
            Phaser.AUTO,// renderer
            'game',     // DOM parent ID
            null,       // default state obj
            false,      // transparent
            false,      // antialias
            { p2: true }// physics config
        );

        this.state.add(Constants.STATES.BOOT, BootState, false);
        this.state.add(Constants.STATES.PRELOADER, PreloaderState, false);
        this.state.add(Constants.STATES.INTRO, IntroState, false);
        this.state.add(Constants.STATES.MAIN_MENU, MainMenuState, false);
        this.state.add(Constants.STATES.PLAY, PlayState, false);

        this.state.add(Constants.LEVELS.CAVE034, Cave034, false);
        this.state.add(Constants.LEVELS.DARKWORLD, Darkworld, false);
        this.state.add(Constants.LEVELS.LIGHTWORLD, Lightworld, false);
        this.state.add(Constants.LEVELS.LINKSHOUSE, LinksHouse, false);

        this.state.start('state_boot');
    }

    boot() {
        super.boot();

        // This sets the limits for Phaser's auto scaling
        this.scale.minWidth = Constants.GAME_WIDTH;
        this.scale.minHeight = Constants.GAME_HEIGHT;

        // this.scale.maxWidth = Constants.GAME_WIDTH * Data.Constants.GAME_SCALE;
        // this.scale.maxHeight = Constants.GAME_HEIGHT * Data.Constants.GAME_SCALE;

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

        // this.add.plugin(new Phaser.Plugin.Debug(this));
        this.add.plugin(new Phaser.Plugin.Tiled(this, this.stage));

        this.effects = <Effects>this.add.plugin(new Effects(this));

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

        this._autosaveInterval = setInterval(this.save.bind(this), Constants.GAME_SAVE_INTERVAL);
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
