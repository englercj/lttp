import GameState from './GameState';
import Constants from '../data/Constants';

export default class Preloader extends GameState {
    preloadBar: Phaser.Sprite;

    preload() {
        super.preload();

        //  Set-up our preloader sprite
        this.preloadBar = this.add.sprite(200, 250, 'image_preloader');
        this.load.setPreloadSprite(this.preloadBar);

        // LOAD EM UP!

        // Images
        this.load.image('image_life', require('../../assets/ui/life.png'));
        this.load.image('image_lore_bg1', require('../../assets/ui/lore_bg1.png'));
        this.load.image('image_lore_bg2', require('../../assets/ui/lore_bg2.png'));
        this.load.image('image_black', 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');

        // Misc Sprites Atlases
        this.load.atlas('sprite_intro',     require('../../assets/sprites/misc/intro.png'),            require('../../assets/sprites/misc/intro.json'),           null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('sprite_select',    require('../../assets/sprites/misc/selectscreen.png'),     require('../../assets/sprites/misc/selectscreen.json'),    null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('sprite_particles', require('../../assets/sprites/misc/particles.png'),        require('../../assets/sprites/misc/particles.json'),       null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('sprite_link',      require('../../assets/sprites/entities/link.png'),         require('../../assets/sprites/entities/link.json'),        null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('sprite_misc',      require('../../assets/sprites/entities/misc.png'),         require('../../assets/sprites/entities/misc.json'),        null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('sprite_enemies',   require('../../assets/sprites/entities/enemies.png'),      require('../../assets/sprites/entities/enemies.json'),     null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('sprite_worlditems',require('../../assets/sprites/misc/overworlditems.png'),   require('../../assets/sprites/misc/overworlditems.json'),  null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('sprite_overlays',  require('../../assets/sprites/overlays/overlays.png'),     require('../../assets/sprites/overlays/overlays.json'),    null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        // HUD Sprite Atlases
        this.load.atlas('sprite_gui',       require('../../assets/sprites/ui/gui.png'),                require('../../assets/sprites/ui/gui.json'),               null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('sprite_hud_font',  require('../../assets/sprites/fonts/hud.png'),             require('../../assets/sprites/fonts/hud.json'),            null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        // Asset packs for tilemaps
        this.load.json(Constants.ASSET_TILEMAP_PACKS_KEY, Constants.ASSET_TILEMAP_PACKS_URL);

        // Minimaps
        this.load.tilemap('map_minimap_lightworld', require('../../assets/levels/minimaps/lw_minimap.json'), null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('map_minimap_darkworld', require('../../assets/levels/minimaps/dw_minimap.json'), null, Phaser.Tilemap.TILED_JSON);

        // Music
        this.load.audio('music_title', [
            require('../../assets/audio/music/title.lite.ogg')
        ]);

        this.load.audio('music_lore', [
            require('../../assets/audio/music/opening_demo.lite.ogg')
        ]);

        this.load.audio('music_select', [
            require('../../assets/audio/music/select_screen.lite.ogg')
        ]);

        // Sound Effects
        this.load.audio('effect_text_done', [
            require('../../assets/audio/effects/LTTP_Text_Done.lite.ogg')
        ]);

        this.load.audio('effect_text_letter', [
            require('../../assets/audio/effects/LTTP_Text_Letter.lite.ogg')
        ]);

        this.load.audio('effect_grass_cut', [
            require('../../assets/audio/effects/LTTP_Grass_Cut.lite.ogg')
        ]);

        this.load.audio('effect_lift', [
            require('../../assets/audio/effects/LTTP_Link_Pickup.lite.ogg')
        ]);

        this.load.audio('effect_throw', [
            require('../../assets/audio/effects/LTTP_Link_Throw.lite.ogg')
        ]);

        this.load.audio('effect_smash', [
            require('../../assets/audio/effects/LTTP_Shatter.lite.ogg')
        ])
        this.load.audio('effect_sword1', [
            require('../../assets/audio/effects/LTTP_Sword1.lite.ogg')
        ]);

        this.load.audio('effect_sword2', [
            require('../../assets/audio/effects/LTTP_Sword1.lite.ogg')
        ]);

        this.load.audio('effect_menu_select', [
            require('../../assets/audio/effects/LTTP_Menu_Select.lite.ogg')
        ]);

        this.load.audio('effect_menu_select_cursor', [
            require('../../assets/audio/effects/LTTP_Menu_Cursor.lite.ogg')
        ]);

        this.load.audio('effect_menu_select_erase', [
            require('../../assets/audio/effects/LTTP_Menu_Erase.lite.ogg')
        ]);

        this.load.audio('effect_error', [
            require('../../assets/audio/effects/LTTP_Error.lite.ogg')
        ]);

        this.load.audio('effect_lowhp', [
            require('../../assets/audio/effects/LTTP_LowHealth.lite.ogg')
        ]);

        this.load.audio('effect_pause_close', [
            require('../../assets/audio/effects/LTTP_Pause_Close.lite.ogg')
        ]);

        this.load.audio('effect_fall', [
            require('../../assets/audio/effects/LTTP_Link_Jump.lite.ogg')
        ]);

        // Item effects
        this.load.audio('effect_chest', [
            require('../../assets/audio/effects/LTTP_Chest.lite.ogg')
        ]);

        this.load.audio('effect_chest_appear', [
            require('../../assets/audio/effects/LTTP_Chest_Appears.lite.ogg')
        ]);

        this.load.audio('effect_item', [
            require('../../assets/audio/effects/LTTP_Item.lite.ogg')
        ]);

        this.load.audio('effect_item_fanfaire', [
            require('../../assets/audio/effects/LTTP_ItemFanfare_Stereo.lite.ogg')
        ]);

        this.load.audio('effect_rupee1', [
            require('../../assets/audio/effects/LTTP_Rupee1.lite.ogg')
        ]);

        this.load.audio('effect_rupee2', [
            require('../../assets/audio/effects/LTTP_Rupee2.lite.ogg')
        ]);
    }

    create() {
        super.create();

        var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startIntro, this);
    }

    startIntro() {
        this.game.state.start('state_intro');
    }
}
