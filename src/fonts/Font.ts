import Game from '../Game';

export interface IBitmapFontJson {
    font: {
        info: {
            _face: string;
            _size: number;
        };

        common: {
            _lineHeight: number;
        };

        chars: {
            char: IBitmapFontCharacterJson[]
        }
    };

}

export interface IBitmapFontCharacterJson {
    _id: number;
    _x: number;
    _y: number;
    _width: number;
    _height: number;
    _xoffset: number;
    _yoffset: number;
    _xadvance: number;
}

export default class Font extends Phaser.BitmapText {
    static cachedFonts: { [key: string]: boolean } = {};

    game: Game;

    monospace: number;

    constructor(game: Game, font: string, x: number = 0, y: number = 0, text: string = '', monospace: number = 0, size: number = 32) {
        super(game, x, y, font, text, size);
        this.monospace = monospace;
    }
}
