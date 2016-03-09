import Game from '../Game';
import { default as Font, IBitmapFontJson } from './Font';

export default class Hud extends Font {
    constructor(game: Game, x: number, y: number, text: string = '', monospace: number = 0, size: number = 16) {
        super(game, prepareFontData(game, monospace), x, y, text, monospace, size);
    }
}

function prepareFontData(game: Game, monospace: number = 0): string {
    const key = 'sprite_hud_font';
    const fontName = 'HudFont' + (monospace ? 'Mono' + monospace.toString() : '');

    if (Font.cachedFonts[fontName]) { return fontName; }

    const fontData: IBitmapFontJson = {
        font: {
            info: {
                _face: fontName,
                _size: 16,
            },
            common: {
                _lineHeight: 16,
            },
            chars: {
                char: [],
            },
        },
    };

    const frames = game.cache.getFrameData(key);
    const letters = '0123456789';

    for (let i = 0; i < letters.length; ++i) {
        let letter = letters.charAt(i);
        let code = letter.charCodeAt(0);
        let frame = frames.getFrameByName(letter + '.png');

        if (!frame) { continue; }

        let rect = frame.getRect();

        fontData.font.chars.char.push({
            _id: code,
            _x: rect.x,
            _y: rect.y,
            _width: rect.width,
            _height: rect.height,
            _xoffset: 0,
            _yoffset: 0,
            _xadvance: monospace || frame.width,
        });
    }

    const baseTexture = game.cache.getBaseTexture(key);

    game.cache.addBitmapFont(fontName, null, baseTexture.source, fontData, 'json', 0, 0);

    Font.cachedFonts[fontName] = true;

    return fontName;
}
