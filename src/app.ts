// import styles
import '../less/main.less';

// start game
import Game from './Game';

window.onload = () => {
    const game = new Game();

    (<any>window).game = game;
};
