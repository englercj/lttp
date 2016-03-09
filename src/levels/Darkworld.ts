import Level from './Level';

export default class Darkworld extends Level {
    levelKey: string = 'darkworld';

    preload() {
        super.preload();

        // Music
        this.load.audio('music_darkworld', [
            'assets/audio/music/dark_world.lite.ogg',
        ]);
    }
}
