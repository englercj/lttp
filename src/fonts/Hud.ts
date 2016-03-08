import { default as Font, IFontData } from './Font';

export default class Hud extends Font {
    constructor(game: Phaser.Game, x: number, y: number, text: string = '', monospace: number = 0, size: number = 16) {
        super(game, prepareFontData(game, monospace), x, y, text, monospace, size);
    }
}

function prepareFontData(game: Phaser.Game, monospace: number = 0): string {
    var key = 'HudFont' + (monospace ? 'Mono' + monospace.toString() : '');

    if (Font.cachedFonts[key]) return key;

    var fontData: IFontData = {
        name: key,
        size: 16,
        lineHeight: 16,
        chars: {}
    };

    var frames = game.cache.getFrameData('sprite_hud_font');
    const letters = '0123456789';
    let letter: string;
    let code: number;
    let frame: Phaser.Frame;

    for(var i = 0; i < letters.length; ++i) {
        letter = letters.charAt(i);
        code = letter.charCodeAt(0);
        frame = frames.getFrameByName(letter + '.png');

        if (!frame) continue;

        fontData.chars[code] = {
            kerning: {},
            texture: new PIXI.Texture(PIXI.utils.BaseTextureCache['sprite_hud_font'], frame.getRect()),
            xAdvance: monospace || frame.width,
            xOffset: 0,
            yOffset: 0
        };
    }

    PIXI.extras.BitmapText.fonts[key] = Font.cachedFonts[key] = fontData;

    return fontData.name;
}
