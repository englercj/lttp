import { Level } from './Level';

export class Darkworld extends Level
{
    levelKey: string = 'darkworld';

    preload()
    {
        super.preload();

        // Music
        this.load.audio('music_darkworld', [
            require('../../assets/audio/music/dark_world.lite.ogg'),
        ]);
    }
}
