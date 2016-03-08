import Game from '../Game';

export interface IFontData {
    name: string;
    size: number;
    lineHeight: number;
    chars: { [character: string]: IFontCharacterData };
}

export interface IFontCharacterData {
    kerning: Object;
    texture: PIXI.Texture;
    xAdvance: number;
    xOffset: number;
    yOffset: number;
}

export default class Font extends Phaser.BitmapText {
    static cachedFonts: { [key: string]: IFontData } = {};

    game: Game;

    monospace: number;

    constructor(game: Game, font: string, x: number = 0, y: number = 0, text: string = '', monospace: number = 0, size: number = 32) {
        super(game, x, y, font, text, size);
        this.monospace = monospace;
    }
}
