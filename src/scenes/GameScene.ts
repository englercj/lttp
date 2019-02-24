import { LevelScene } from './LevelScene';
import { Player } from '../entities/Player';
import { Save } from '../utility/Save';
import { UIScene } from './UIScene';

export class GameScene extends Phaser.Scene
{
    static KEY = 'GameScene';

    constructor()
    {
        super(GameScene.KEY);
    }

    create(loadedSave: Save)
    {
        if (!this.registry.get('player'))
        {
            this.registry.set('player', new Player(this));
        }

        const player = this.registry.get('player');

        this.add.existing(player);

        // load the save data into the player
        loadedSave.copyTo(player);
        this.registry.set('loadedSave', loadedSave);

        this.scene.launch(LevelScene.KEY, { key: loadedSave.lastUsedExit.name });
        this.scene.launch(UIScene.KEY, { player });
    }
}
