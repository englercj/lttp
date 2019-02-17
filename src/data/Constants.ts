export const DEBUG: boolean = false;

export enum EEntityType
{
    Player,
    Enemy,
    Friendly,
    Neutral,
}

export enum EDirection
{
    None,
    Up,
    Down,
    Left,
    Right,
}

export const WORLD_ITEMS =
{
    HEART:   'heart',
    MAGIC:   'magic',
    ARROWS:  'arrows',
    BOMBS:   'bombs',
    RUPEES:  'rupees',
};

export const MAP_OBJECTS =
{
    CHEST:   'chest',
    SIGN:    'sign',
    ROCK:    'rock',
    GRASS:   'grass',
    POT:     'pot',
    MINE:    'mine',
};

export const LEVELS =
{
    CAVE034:    'level_cave034',
    DARKWORLD:  'level_darkworld',
    LIGHTWORLD: 'level_lightworld',
    LINKSHOUSE: 'level_linkshouse',
};

export const COLORS =
{
    WHITE:  [255,   255,    255,    1],
    BLACK:  [  0,     0,      0,    1],
    RED:    [255,     0,      0,    1],
    GREEN:  [  0,   255,      0,    1],
    BLUE:   [  0,     0,    255,    1],
};

// deminsions of the screen
export const GAME_WIDTH:                    number = 256;
export const GAME_HEIGHT:                   number = 224;
export const GAME_TEXT_SCALE:               number = 1.5;
// export const GAME_SAVE_INTERVAL:            number = 10000;

// cone within hit detector to check for interactions
export const PLAYER_ATTACK_CONE:            number = 0.5;
export const PLAYER_USE_CONE:               number = 0.4;

// radius of hit detector
export const PLAYER_ATTACK_SENSOR_RADIUS:   number = 18;

// distance to throw an item
export const PLAYER_THROW_DISTANCE_X:       number = 75;
export const PLAYER_THROW_DISTANCE_Y:       number = 50;

// how long to run into something before an action takes place (blocked/jump down)
export const PLAYER_BLOCKED_WAIT_TIME:      number = 500;

// time it takes to execute a jump animation (in seconds)
export const PLAYER_JUMP_TIME:              number = 0.5;
export const PLAYER_JUMP_DISTANCE:          number = 50;

// time it takes for the inventory menu to drop down (in seconds)
export const PLAYER_INVENTORY_DROP_TIME:    number = 0.5;

// volume for sounds
export const AUDIO_EFFECT_VOLUME:           number = 0.80;
export const AUDIO_MUSIC_VOLUME:            number = 0.20;

// tilemap pack location
export const ASSET_TILEMAP_PACKS_URL:       string = 'assets/tilemap-assets.json';
export const ASSET_TILEMAP_PACKS_KEY:       string = 'pack_tilemap_asssets';

// input data
export const INPUT_GAMEPAD_AXIS_THRESHOLD:  number = 0.25;

// some effect constants
export const EFFECT_INTRO_FLASH_ALPHA:      number = 0.6;
export const EFFECT_INTRO_FLASH_LENGTH:     number = 15;

export const EFFECT_ZONE_TRANSITION_TIME:   number = 250;
export const EFFECT_ZONE_TRANSITION_SPACE:  number = 20;

export const EFFECT_MAP_TRANSITION_TIME:    number = 500;

export const EFFECT_OVERLAY_SCROLL_TIME:    number = 100;
export const EFFECT_OVERLAY_SCROLL_FACTOR:  number = 0.5;

// direction vectors
export const VECTOR_ZERO: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, -1);
export const VECTOR_UP: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, -1);
export const VECTOR_DOWN: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 1);
export const VECTOR_LEFT: Phaser.Math.Vector2 = new Phaser.Math.Vector2(-1, 0);
export const VECTOR_RIGHT: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);

export const DIRECTION_STRING_MAP: string[] =
[
    'none',
    'left',
    'right',
    'up',
    'down',
];

export const DIRECTION_VECTOR_MAP: Phaser.Math.Vector2[] =
[
    VECTOR_ZERO,
    VECTOR_LEFT,
    VECTOR_RIGHT,
    VECTOR_UP,
    VECTOR_DOWN,
];
