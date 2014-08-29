module Lttp.Data {
    export class Constants {

        // entity types
        public static ENTITY_PLAYER:        string = 'player';
        public static ENTITY_ENEMY:         string = 'enemy';
        public static ENTITY_FRIENDLY:      string = 'friendly';
        public static ENTITY_NEUTRAL:       string = 'neutral';
        public static ENTITY_TILE:          string = 'tile';
        public static ENTITY_COLLECTABLE:   string = 'collectable';

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

    }
}
