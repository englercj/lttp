var fontData = {
    name: 'HudFont',
    size: 16,
    lineHeight: 16,
    chars: null
};

module Lttp.Fonts {
    export class Hud extends Phaser.BitmapText {
        constructor(game: Phaser.Game, x: number, y: number, text: string = '', size: number = 16) {
            super(game, x, y, this.prepareFontData(game), text, size);
        }

        prepareFontData(game: Phaser.Game) {
            if (fontData.chars) return fontData.name;

            fontData.chars = {};

            var frames = game.cache.getFrameData('sprite_hud_font'),
                letters = '0123456789',
                letter, code, frame;

            for(var i = 0; i < letters.length; ++i) {
                letter = letters.charAt(i);
                code = letter.charCodeAt(0);
                frame = frames.getFrameByName(letter + '.png');

                if (!frame) continue;

                fontData.chars[code] = {
                    kerning: {},
                    texture: new PIXI.Texture(PIXI.BaseTextureCache['sprite_hud_font'], frame.getRect()),
                    xAdvance: frame.width,
                    xOffset: 0,
                    yOffset: 0
                };
            }

            PIXI.BitmapText.fonts[fontData.name] = fontData;

            return fontData.name;
        }
    }
}
