module Lttp {
    export class Game extends Phaser.Game {

        constructor() {
            super(Data.Constants.GAME_WIDTH, Data.Constants.GAME_HEIGHT, Phaser.AUTO, 'game');

            this.state.add('Boot', States.Boot, false);
            this.state.add('Preloader', States.Preloader, false);
            this.state.add('Intro', States.Intro, false);
            this.state.add('MainMenu', States.MainMenu, false);
            this.state.add('Lightworld', Levels.Lightworld, false);

            this.state.start('Boot');
        }

        boot() {
            super.boot();

            //  This sets a limit on the up-scale
            this.scale.maxWidth = Data.Constants.GAME_WIDTH * Data.Constants.GAME_SCALE;
            this.scale.maxHeight = Data.Constants.GAME_HEIGHT * Data.Constants.GAME_SCALE;

            //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setScreenSize(false); //TODO: phaser.d.ts says param is required, but it isn't
        }

    }
}
