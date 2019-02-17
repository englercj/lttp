import { BaseLttpScene } from './BaseLttpScene';
import { LevelScene } from './LevelScene';
import { Player } from '../entities/Player';
import { Save } from '../utility/Save';

export class GameScene extends BaseLttpScene
{
    static KEY = 'GameScene';

    constructor()
    {
        super({ key: GameScene.KEY });
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
        // TODO: Add a "menus" scene for inventory and such so we can pause game/level to show that.
    }
}
