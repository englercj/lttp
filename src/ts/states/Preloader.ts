module Lttp.States {
    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {
            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'image_preloader');
            this.load.setPreloadSprite(this.preloadBar);

            // LOAD EM UP!

            // Images
            this.load.image('image_life', 'assets/ui/life.png');
            this.load.image('image_lore_bg1', 'assets/ui/lore_bg1.png');
            this.load.image('image_lore_bg2', 'assets/ui/lore_bg2.png');

            // Misc Sprites Atlases
            this.load.atlas('sprite_intro',     'assets/sprites/misc/intro.png',            'assets/sprites/misc/intro.json',           null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            this.load.atlas('sprite_select',    'assets/sprites/misc/selectscreen.png',     'assets/sprites/misc/selectscreen.json',    null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            this.load.atlas('sprite_particles', 'assets/sprites/misc/particles.png',        'assets/sprites/misc/particles.json',       null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            this.load.atlas('sprite_link',      'assets/sprites/entities/link.png',         'assets/sprites/entities/link.json',        null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            this.load.atlas('sprite_misc',      'assets/sprites/entities/misc.png',         'assets/sprites/entities/misc.json',        null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            this.load.atlas('sprite_enemies',   'assets/sprites/entities/enemies.png',      'assets/sprites/entities/enemies.json',     null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            this.load.atlas('sprite_smash',     'assets/sprites/misc/smash.png',            'assets/sprites/misc/smash.json',           null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            this.load.atlas('sprite_worlditems', 'assets/sprites/misc/overworlditems.png',  'assets/sprites/misc/overworlditems.json',  null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

            // HUD Sprite Atlases
            this.load.atlas('sprite_gui',       'assets/sprites/ui/gui.png',                'assets/sprites/ui/gui.json',               null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            this.load.atlas('sprite_hud_font',  'assets/sprites/fonts/hud.png',             'assets/sprites/fonts/hud.json',            null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

            // Music
            this.load.audio('music_title', [
                'assets/audio/music/title.lite.ogg'
            ]);

            this.load.audio('music_select', [
                'assets/audio/music/select_screen.lite.ogg'
            ]);

            // Sound Effects
            this.load.audio('effect_grass_cut', [
                'assets/audio/effects/LTTP_Grass_Cut.lite.ogg'
            ]);

            this.load.audio('effect_lift', [
                'assets/audio/effects/LTTP_Link_Pickup.lite.ogg'
            ]);

            this.load.audio('effect_throw', [
                'assets/audio/effects/LTTP_Link_Throw.lite.ogg'
            ]);

            this.load.audio('effect_smash', [
                'assets/audio/effects/LTTP_Shatter.lite.ogg'
            ]);

            this.load.audio('effect_sword1', [
                'assets/audio/effects/LTTP_Sword1.lite.ogg'
            ]);

            this.load.audio('effect_sword2', [
                'assets/audio/effects/LTTP_Sword1.lite.ogg'
            ]);

            this.load.audio('effect_menu_select', [
                'assets/audio/effects/LTTP_Menu_Select.lite.ogg'
            ]);

            this.load.audio('effect_menu_select_cursor', [
                'assets/audio/effects/LTTP_Menu_Cursor.lite.ogg'
            ]);

            this.load.audio('effect_menu_select_erase', [
                'assets/audio/effects/LTTP_Menu_Erase.lite.ogg'
            ]);

            this.load.audio('effect_error', [
                'assets/audio/effects/LTTP_Error.lite.ogg'
            ]);

            this.load.audio('effect_lowhp', [
                'assets/audio/effects/LTTP_LowHealth.lite.ogg'
            ]);

            this.load.audio('effect_pause_close', [
                'assets/audio/effects/LTTP_Pause_Close.lite.ogg'
            ]);

            this.load.audio('effect_fall', [
                'assets/audio/effects/LTTP_Link_Jump.lite.ogg'
            ]);

            // Item effects
            this.load.audio('effect_chest', [
                'assets/audio/effects/LTTP_Chest.lite.ogg'
            ]);

            this.load.audio('effect_chest_appear', [
                'assets/audio/effects/LTTP_Chest_Appears.lite.ogg'
            ]);

            this.load.audio('effect_item', [
                'assets/audio/effects/LTTP_Item.lite.ogg'
            ]);

            this.load.audio('effect_item_fanfaire', [
                'assets/audio/effects/LTTP_ItemFanfare_Stereo.lite.ogg'
            ]);

            this.load.audio('effect_rupee1', [
                'assets/audio/effects/LTTP_Rupee1.lite.ogg'
            ]);

            this.load.audio('effect_rupee2', [
                'assets/audio/effects/LTTP_Rupee2.lite.ogg'
            ]);
        }

        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startIntro, this);
        }

        startIntro() {
            this.game.state.start('Intro', true, false);
        }

    }
}
