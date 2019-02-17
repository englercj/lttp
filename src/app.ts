// import styles
import '../assets/index.css';

// Import the phaser engine
import 'phaser';

// start game
import { Game } from './Game';

window.onload = function ()
{
    const game = new Game();

    (window as any).game = game;
};
