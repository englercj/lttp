import GameState from './GameState';

export default class Boot extends GameState {
    preload(): void {
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

    create(): void {
        super.create();

        // don't specifically need multitouch, so turn it off.
        this.input.maxPointers = 1;

        this.game.state.start('state_preloader');
    }
}
