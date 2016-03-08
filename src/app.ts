import Game from './Game';

window.onload = () => {
    window['game'] = new Game();
};

// export type IPoint = (Phaser.Point|Phaser.Physics.P2.InversePointProxy);
