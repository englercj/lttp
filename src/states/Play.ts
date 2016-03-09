import GameState from './GameState';
import Player from '../entities/Player';

export default class Play extends GameState {

    preload() {
        super.preload();

        this.load.image('image_preloader', require('../../assets/ui/loader.png'));
        this.load.atlas(
            'sprite_rog_font',
            require('../../assets/sprites/fonts/retofganon.png'),
            require('../../assets/sprites/fonts/retofganon.json'),
            null,
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
        );
    }

    create() {
        super.create();

        this.game.player = new Player(this.game);

        // load the save data into the player
        this.game.loadedSave.copyTo(this.game.player);

        // startup the autosave interval
        this.game.startAutosave();

        // todo load active level from save file
        this.game.state.start('level_' + this.game.loadedSave.lastUsedExit.name);
    }
}
