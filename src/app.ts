// import styles
import '../less/main.less';

// import Phaser patches
import './utility/phaser-patches';

// start game
import Game from './Game';

window.onload = () => {
    const game = new Game();

    (<any>window).game = game;
};
