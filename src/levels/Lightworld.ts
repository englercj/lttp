import Level from './Level';

export default class Lightworld extends Level {
    levelKey: string = 'lightworld';

    preload() {
        super.preload();

        // Music
        this.load.audio('music_lightworld', [
            require('../../assets/audio/music/overworld.lite.ogg'),
        ]);

        this.load.audio('music_village', [
            require('../../assets/audio/music/kakariko_village.lite.ogg'),
        ]);
    }
}
