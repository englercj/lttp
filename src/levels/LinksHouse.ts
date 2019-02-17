import { Level } from './Level';

export class LinksHouse extends Level
{
    levelKey: string = 'linkshouse';

    preload()
    {
        super.preload();

        this.load.audio('music_village', [
            require('../../assets/audio/music/kakariko_village.lite.ogg'),
        ]);
    }
}
