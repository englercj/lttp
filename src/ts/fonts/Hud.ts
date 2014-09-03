module Lttp.Fonts {
    export class Hud extends Fonts.Font {

        constructor(game: Phaser.Game, x: number, y: number, text: string = '', size: number = 16, monospace: number = 0) {
            super(game, this.prepareFontData(game, monospace), x, y, text, size, monospace);
        }

        prepareFontData(game: Phaser.Game, monospace: number = 0): string {
            var key = 'HudFont' + (monospace ? 'Mono' + monospace.toString() : '');

            if (Fonts.Font.cachedFonts[key]) return key;

            var fontData = {
                name: key,
                size: 16,
                lineHeight: 16,
                chars: {}
            };

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
                    xAdvance: monospace || frame.width,
                    xOffset: 0,
                    yOffset: 0
                };
            }

            PIXI.BitmapText.fonts[key] = Fonts.Font.cachedFonts[key] = <Lttp.Fonts.FontData>fontData;

            return fontData.name;
        }
    }
}
