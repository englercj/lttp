import Level from './Level';

export default class LinksHouse extends Level {
    levelKey: string = 'linkshouse';

    preload() {
        super.preload();

        this.load.audio('music_village', [
            'assets/audio/music/kakariko_village.lite.ogg'
        ]);
    }
}
