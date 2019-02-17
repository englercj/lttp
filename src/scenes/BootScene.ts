import { BaseLttpScene } from './BaseLttpScene';
import { IntroScene } from './IntroScene';
import { ASSET_TILEMAP_PACKS_KEY, ASSET_TILEMAP_PACKS_URL } from '../data/Constants';
import { itemDescriptors } from '../data/ItemDescriptors';

export class BootScene extends BaseLttpScene
{
    static KEY = 'BootScene';

    constructor()
    {
        super({ key: BootScene.KEY });
    }

    preload()
    {
        super.preload();

        // Images
        this.load.image('image_lore_bg1', require('../../assets/ui/lore_bg1.png'));
        this.load.image('image_lore_bg2', require('../../assets/ui/lore_bg2.png'));

        // Misc Sprites Atlases
        this.load.atlas('sprite_intro',     require('../../assets/sprites/misc/intro.png'),            require('../../assets/sprites/misc/intro.json'));
        this.load.atlas('sprite_select',    require('../../assets/sprites/misc/selectscreen.png'),     require('../../assets/sprites/misc/selectscreen.json'));
        this.load.atlas('sprite_particles', require('../../assets/sprites/misc/particles.png'),        require('../../assets/sprites/misc/particles.json'));
        this.load.atlas('sprite_link',      require('../../assets/sprites/entities/link.png'),         require('../../assets/sprites/entities/link.json'));
        this.load.atlas('sprite_misc',      require('../../assets/sprites/entities/misc.png'),         require('../../assets/sprites/entities/misc.json'));
        this.load.atlas('sprite_enemies',   require('../../assets/sprites/entities/enemies.png'),      require('../../assets/sprites/entities/enemies.json'));
        this.load.atlas('sprite_worlditems', require('../../assets/sprites/misc/overworlditems.png'),  require('../../assets/sprites/misc/overworlditems.json'));
        this.load.atlas('sprite_overlays',  require('../../assets/sprites/overlays/overlays.png'),     require('../../assets/sprites/overlays/overlays.json'));

        // HUD Sprite Atlases
        this.load.atlas('sprite_gui',       require('../../assets/sprites/ui/gui.png'),                require('../../assets/sprites/ui/gui.json'));
        this.load.atlas('sprite_hud_font',  require('../../assets/sprites/fonts/hud.png'),             require('../../assets/sprites/fonts/hud.json'));
        this.load.atlas('sprite_rog_font',  require('../../assets/sprites/fonts/retofganon.png'),      require('../../assets/sprites/fonts/retofganon.json'));

        // Asset packs for tilemaps
        this.load.json(ASSET_TILEMAP_PACKS_KEY, ASSET_TILEMAP_PACKS_URL);

        // Minimaps
        this.load.json('map_minimap_lightworld', require('../../assets/levels/minimaps/lw_minimap.json'));
        this.load.json('map_minimap_darkworld', require('../../assets/levels/minimaps/dw_minimap.json'));

        // Music
        this.load.audio('music_title', [
            require('../../assets/audio/music/title.lite.ogg'),
        ]);

        this.load.audio('music_lore', [
            require('../../assets/audio/music/opening_demo.lite.ogg'),
        ]);

        this.load.audio('music_select', [
            require('../../assets/audio/music/select_screen.lite.ogg'),
        ]);

        // Sound Effects
        this.load.audio('effect_text_done', [
            require('../../assets/audio/effects/LTTP_Text_Done.lite.ogg'),
        ]);

        this.load.audio('effect_text_letter', [
            require('../../assets/audio/effects/LTTP_Text_Letter.lite.ogg'),
        ]);

        this.load.audio('effect_grass_cut', [
            require('../../assets/audio/effects/LTTP_Grass_Cut.lite.ogg'),
        ]);

        this.load.audio('effect_lift', [
            require('../../assets/audio/effects/LTTP_Link_Pickup.lite.ogg'),
        ]);

        this.load.audio('effect_throw', [
            require('../../assets/audio/effects/LTTP_Link_Throw.lite.ogg'),
        ]);

        this.load.audio('effect_smash', [
            require('../../assets/audio/effects/LTTP_Shatter.lite.ogg'),
        ]);

        this.load.audio('effect_sword1', [
            require('../../assets/audio/effects/LTTP_Sword1.lite.ogg'),
        ]);

        this.load.audio('effect_sword2', [
            require('../../assets/audio/effects/LTTP_Sword1.lite.ogg'),
        ]);

        this.load.audio('effect_menu_select', [
            require('../../assets/audio/effects/LTTP_Menu_Select.lite.ogg'),
        ]);

        this.load.audio('effect_menu_select_cursor', [
            require('../../assets/audio/effects/LTTP_Menu_Cursor.lite.ogg'),
        ]);

        this.load.audio('effect_menu_select_erase', [
            require('../../assets/audio/effects/LTTP_Menu_Erase.lite.ogg'),
        ]);

        this.load.audio('effect_error', [
            require('../../assets/audio/effects/LTTP_Error.lite.ogg'),
        ]);

        this.load.audio('effect_lowhp', [
            require('../../assets/audio/effects/LTTP_LowHealth.lite.ogg'),
        ]);

        this.load.audio('effect_pause_close', [
            require('../../assets/audio/effects/LTTP_Pause_Close.lite.ogg'),
        ]);

        this.load.audio('effect_fall', [
            require('../../assets/audio/effects/LTTP_Link_Jump.lite.ogg'),
        ]);

        // Item effects
        this.load.audio('effect_chest', [
            require('../../assets/audio/effects/LTTP_Chest.lite.ogg'),
        ]);

        this.load.audio('effect_chest_appear', [
            require('../../assets/audio/effects/LTTP_Chest_Appears.lite.ogg'),
        ]);

        this.load.audio('effect_item', [
            require('../../assets/audio/effects/LTTP_Item.lite.ogg'),
        ]);

        this.load.audio('effect_item_fanfaire', [
            require('../../assets/audio/effects/LTTP_ItemFanfare_Stereo.lite.ogg'),
        ]);

        this.load.audio('effect_rupee1', [
            require('../../assets/audio/effects/LTTP_Rupee1.lite.ogg'),
        ]);

        this.load.audio('effect_rupee2', [
            require('../../assets/audio/effects/LTTP_Rupee2.lite.ogg'),
        ]);
    }

    create()
    {
        this._createAnimations();

        this.scene.start(IntroScene.KEY);
    }

    private _createAnimations()
    {
        // Flowers
        // this._createAnim('flower_1', 6, -1, [
        //     'flower/flower_1_3.png',
        //     'flower/flower_1_1.png',
        //     'flower/flower_1_2.png',
        // ]);

        // this._createAnim('flower_2', 6, -1, [
        //     'flower/flower_2_3.png',
        //     'flower/flower_2_1.png',
        //     'flower/flower_2_2.png',
        // ]);

        // Rupees
        let a = [1, 5, 20];

        for (let i = 0; i < a.length; ++i)
        {
            const n = a[i];
            this._createAnim('rupees_' + n, 6, -1, [
                'inventory/rupees_' + n + '_1.png',
                'inventory/rupees_' + n + '_2.png',
                'inventory/rupees_' + n + '_3.png',
            ]);
        }

        // Particles
        for (const key in itemDescriptors)
        {
            if (!itemDescriptors.hasOwnProperty(key))
                continue;

            const desc = itemDescriptors[key];

            if (!desc.particle)
                continue;

            const p = desc.particle;
            this._createIndexedAnim([p.path + '%d'], p.num, p.framerate, p.repeat);
        }

        // Link - Idle
        this._createAnim('idle_shield_left', null, -1, ['walk_shield_left/walk_shield_left_1.png']);
        this._createAnim('idle_shield_right', null, -1, ['walk_shield_right/walk_shield_right_1.png']);
        this._createAnim('idle_shield_down', null, -1, ['walk_shield_down/walk_shield_down_1.png']);
        this._createAnim('idle_shield_up', null, -1, ['walk_shield_up/walk_shield_up_1.png']);

        this._createAnim('idle_left', null, -1, ['walk_left/walk_left_1.png']);
        this._createAnim('idle_right', null, -1, ['walk_right/walk_right_1.png']);
        this._createAnim('idle_down', null, -1, ['walk_down/walk_down_1.png']);
        this._createAnim('idle_up', null, -1, ['walk_up/walk_up_1.png']);

        this._createAnim('lift_idle_left', null, -1, ['lift_walk_left/lift_walk_left_1.png']);
        this._createAnim('lift_idle_right', null, -1, ['lift_walk_right/lift_walk_right_1.png']);
        this._createAnim('lift_idle_down', null, -1, ['lift_walk_down/lift_walk_down_1.png']);
        this._createAnim('lift_idle_up', null, -1, ['lift_walk_up/lift_walk_up_1.png']);

        // Link - Attack
        this._createDirectionalPrefixedAnim('attack', 9, 36);
        this._createDirectionalPrefixedAnim('attack_bow', 3, 24);
        this._createDirectionalPrefixedAnim('attack_spin', 12, 24);
        this._createDirectionalPrefixedAnim('attack_tap', 3, 24);

        // Link - Moving
        this._createDirectionalPrefixedAnim('walk', 8, 24, -1);
        this._createIndexedAnim(['fall_in_hole/fall_in_hole'], 4, 3);
        this._createDirectionalPrefixedAnim('lift', 4, 12);
        this._createAnim('lift_walk_left', 12, -1, [
            'lift_walk_left/lift_walk_left_1.png',
            'lift_walk_left/lift_walk_left_2.png',
            'lift_walk_left/lift_walk_left_3.png',
            'lift_walk_left/lift_walk_left_2.png',
        ]);
        this._createAnim('lift_walk_right', 12, -1, [
            'lift_walk_right/lift_walk_right_1.png',
            'lift_walk_right/lift_walk_right_2.png',
            'lift_walk_right/lift_walk_right_3.png',
            'lift_walk_right/lift_walk_right_2.png',
        ]);

        this._createDirectionalPrefixedAnim('push', 5, 6, -1);
        this._createDirectionalPrefixedAnim('walk_shield', 8, 24, -1);

        this._createIndexedAnim(['lift_walk_left', 'lift_walk_right'], 3, 0.2, -1);
        this._createIndexedAnim(['lift_walk_down/lift_walk_down', 'lift_walk_up/lift_walk_up'], 6, 15, -1);
        this._createIndexedAnim(['walk_attack_left/walk_attack_left', 'walk_attack_right/walk_attack_right'], 3, 24, -1);
        this._createIndexedAnim(['walk_attack_down/walk_attack_down', 'walk_attack_up/walk_attack_up'], 6, 24, -1);
    }

    private _createAnim(key: string, frameRate: number, repeat: number, frameNames: string[])
    {
        this.anims.create({
            key,
            frames: frameNames.map(v => ({ key, frame: v })),
            frameRate,
            repeat,
        });
    }

    private _createDirectionalPrefixedAnim(type: string, num: number, frameRate: number = 60, repeat: number = 0)
    {
        this._createDirectionalAnim(`${type}_%s/${type}_%s`, num, frameRate, repeat);
    }

    private _createDirectionalAnim(type: string, num: number, frameRate: number = 60, repeat: number = 0)
    {
        if (type.indexOf('%s') === -1)
        {
            type += '_%s';
        }

        this._createIndexedAnim([
            type.replace(/%s/g, 'left'),
            type.replace(/%s/g, 'right'),
            type.replace(/%s/g, 'down'),
            type.replace(/%s/g, 'up'),
        ], num, frameRate, repeat);
    }

    private _createIndexedAnim(types: string[], num: number, frameRate: number = 60, repeat: number = 0)
    {
        for (let t = 0; t < types.length; ++t)
        {
            const frames: string[] = [];
            let type = types[t];
            const name = type.replace(/.+\/|\.png|_%./g, '');

            if (type.indexOf('%d') === -1)
            {
                type += '_%d';
            }

            for (let f = 1; f <= num; ++f)
            {
                frames.push(type.replace(/%d/g, f.toString()) + '.png');
            }

            this._createAnim(name, frameRate, repeat, frames);
        }
    }
}
