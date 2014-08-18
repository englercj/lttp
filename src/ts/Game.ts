module Lttp {
    export class Game extends Phaser.Game {

        constructor() {
            super(768, 672, Phaser.AUTO, 'game');

            this.state.add('Boot', States.Boot, false);
            this.state.add('Preloader', States.Preloader, false);
            this.state.add('Intro', States.Intro, false);
            this.state.add('MainMenu', States.MainMenu, false);
            this.state.add('Lightworld', Levels.Lightworld, false);

            this.state.start('Boot');
        }

    }
}
