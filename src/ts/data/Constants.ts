module Lttp.Data {
    export enum ENTITY_TYPE {
        // player/npc entities
        PLAYER,
        ENEMY,
        FRIENDLY,
        NEUTRAL,

        // misc interactable entities
        COLLECTABLE,
        CHEST,
        SIGN,
        ROCK,
        GRASS,
        POT
    }

    export class Constants {
        // deminsions of the screen
        public static GAME_WIDTH:           number = 256;
        public static GAME_HEIGHT:          number = 224;
        public static GAME_SCALE:           number = 3;
        public static GAME_TEXT_SCALE:      number = 1.5;

        //cone within hit detector to check for interactions
        public static PLAYER_ATTACK_CONE:   number = 0.5;
        public static PLAYER_USE_CONE:      number = 0.4;

        //radius of hit detector
        public static PLAYER_ATTACK_SENSOR_RADIUS:  number = 18;

        //distance to throw an item
        public static PLAYER_THROW_DISTANCE_X:      number = 75;
        public static PLAYER_THROW_DISTANCE_Y:      number = 50;

        //how long to run into something before an action takes place (blocked/jump down)
        public static PLAYER_BLOCKED_WAIT_TIME:     number = 500;

        //time it takes to execute a jump animation (in seconds)
        public static PLAYER_JUMP_TIME:             number = 0.5;
        public static PLAYER_JUMP_DISTANCE:         number = 50;

        //time it takes for the inventory menu to drop down (in seconds)
        public static PLAYER_INVENTORY_DROP_TIME:   number = 0.5;

        //volume for sounds
        public static AUDIO_EFFECT_VOLUME:  number = 0.80;
        public static AUDIO_MUSIC_VOLUME:   number = 0.20;

        //tilemap pack location
        public static ASSET_TILEMAP_PACKS_URL: string = 'assets/tilemap-assets.json';
        public static ASSET_TILEMAP_PACKS_KEY: string = 'pack_tilemap_asssets';

        //input data
        public static INPUT_GAMEPAD_AXIS_THRESHOLD: number = 0.25;

        // direction vectors
        public static VECTOR_ZERO: Phaser.Point = new Phaser.Point(0, -1);
        public static VECTOR_UP: Phaser.Point = new Phaser.Point(0, -1);
        public static VECTOR_DOWN: Phaser.Point = new Phaser.Point(0, 1);
        public static VECTOR_LEFT: Phaser.Point = new Phaser.Point(-1, 0);
        public static VECTOR_RIGHT: Phaser.Point = new Phaser.Point(1, 0);

        public static DIRECTION_STRING_MAP: string[] = [
            'none',
            'left',
            'right',
            'up',
            'down'
        ];

        public static DIRECTION_VECTOR_MAP: Phaser.Point[] = [
            Constants.VECTOR_ZERO,
            Constants.VECTOR_LEFT,
            Constants.VECTOR_RIGHT,
            Constants.VECTOR_UP,
            Constants.VECTOR_DOWN
        ];

    }
}
