import { GAME_WIDTH, GAME_HEIGHT, DEBUG } from './data/Constants';
import { BootScene } from './scenes/BootScene';
import { IntroScene } from './scenes/IntroScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { LevelScene } from './scenes/LevelScene';

export class Game extends Phaser.Game
{
    constructor()
    {
        super({
            title: 'TLoZ: LttP',
            url: 'https://github.com/englercj/lttp',
            version: '1.0.0',
            type: Phaser.WEBGL,
            scene: BootScene,
            scale: {
                mode: Phaser.Scale.FIT,
                parent: 'game',
                autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                min: {
                    width: GAME_WIDTH,
                    height: GAME_HEIGHT,
                },
            },
            input: {
                keyboard: true,
                gamepad: true,
            },
            render: {
                pixelArt: true,
                antialias: false,
            },
            physics: {
                default: 'matter',
                matter: {
                    gravity: { x: 0, y: 0 },
                    debug: DEBUG,
                },
            },
            // plugins: [Debug, Tiled, Effects],
        });
    }

    boot()
    {
        super.boot();

        this.sound.mute = true;

        this.scene.add(IntroScene.KEY, IntroScene, false);
        this.scene.add(MainMenuScene.KEY, MainMenuScene, false);
        this.scene.add(GameScene.KEY, GameScene, false);
        this.scene.add(LevelScene.KEY, LevelScene, false);
    }
}
