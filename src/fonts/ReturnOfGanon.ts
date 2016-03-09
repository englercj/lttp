import Game from '../Game';
import { default as Font, IBitmapFontJson } from './Font';

export default class ReturnOfGanon extends Font {
    // You may notice that the "size" param default is 16, not 32 like when we create the font in "prepareFontData"
    // this is because we actually want the font to be half-size when used.
    constructor(game: Game, x: number = 0, y: number = 0, text: string = '', monospace: number = 0, size: number = 16) {
        super(game, prepareFontData(game, monospace), x, y, text, monospace, size);
    }
}

function prepareFontData(game: Game, monospace: number = 0): string {
    const key = 'sprite_rog_font';
    const fontName = 'ReturnOfGanon' + (monospace ? 'Mono' + monospace.toString() : '');

    if (Font.cachedFonts[fontName]) { return fontName; }

    const fontData: IBitmapFontJson = {
        font: {
            info: {
                _face: fontName,
                _size: 32,
            },
            common: {
                _lineHeight: 32,
            },
            chars: {
                char: [],
            },
        },
    };

    const frames = game.cache.getFrameData(key);
    const letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:;\',-!.?<>() ';
    const spaceFrame = new Phaser.Frame(0, 0, 0, 0, 0, 'spacer');

    // special characters use names in the file names
    let map: any = {
        // TODO: Colon, semicolon, pipe, mudora symbols, heart symbols
        ':': 'colon',
        ';': 'semicolon',

        "'": 'comma',
        ',': 'comma',
        '-': 'dash',
        '!': 'exclamation',
        '.': 'period',
        '?': 'question',
        '<': 'arrow-left',
        '>': 'arrow-right',
        '(': 'open-parenthesis',
        ')': 'close-parenthesis',
    };

    // lowercase alpha characters are named "_x" where "x" is the character
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach((c: string) => {
        map[c] = '_' + c;
    });

    // these characters are offset a bit
    'acegjmnopqrsuvwxyz<>'.split('').forEach((c: string) => {
        map[c] = {
            yOffset: 6,
            name: map[c],
        };
    });

    ','.split('').forEach((c: string) => {
        map[c] = {
            yOffset: 18,
            name: map[c],
        };
    });

    // quote is offset upwards
    map["'"] = {
        yOffset: -16,
        name: map["'"],
    };

    // period has a small offset as well
    map['.'] = {
        yOffset: 18,
        name: 'period',
    };

    // space should advance the cursor
    map[' '] = {
        xAdvance: 7,
        name: ' ',
    };

    // add characters
    for (let i = 0; i < letters.length; ++i) {
        let letter = letters.charAt(i);
        let code = letter.charCodeAt(0);
        let val = map[letter] || letter;
        let frame = frames.getFrameByName((val.name || val) + '.png');

        if (code === 32) {
            frame = spaceFrame;
        }

        if (!frame) { continue; }

        let rect = frame.getRect();

        fontData.font.chars.char.push({
            _id: code,
            _x: rect.x,
            _y: rect.y,
            _width: rect.width,
            _height: rect.height,
            _xoffset: val.xOffset || 0,
            _yoffset: val.yOffset || 0,
            _xadvance: monospace || val.xAdvance || frame.width,
        });
    }

    const baseTexture = game.cache.getBaseTexture(key);

    game.cache.addBitmapFont(fontName, null, baseTexture.source, fontData, 'json', 0, 0);

    return fontName;
}
