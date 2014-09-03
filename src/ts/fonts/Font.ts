module Lttp.Fonts {
    export interface FontData {
        name: string;
        size: number;
        lineHeight: number;
        chars: { [character: string]: FontCharacterData };
    }

    export interface FontCharacterData {
        kerning: Object;
        texture: PIXI.Texture;
        xAdvance: number;
        xOffset: number;
        yOffset: number;
    }

    export class Font extends Phaser.BitmapText {

        static cachedFonts: { [key: string]: Fonts.FontData } = {};

        constructor(game: Phaser.Game, font: string, x: number = 0, y: number = 0, text: string = '', size: number = 32, public monospace: number = 0) {
            super(game, x, y, font, text, size);
        }

    }
}
