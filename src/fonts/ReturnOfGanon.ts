import * as Phaser from 'phaser';
import { default as Font, IFontData } from './Font';

export default class ReturnOfGanon extends Font {
    // You may notice that the "size" param default is 16, not 32 like when we create the font in "prepareFontData"
    // this is because we actually want the font to be half-size when used.
    constructor(game: Phaser.Game, x: number = 0, y: number = 0, text: string = '', monospace: number = 0, size: number = 16) {
        super(game, prepareFontData(game, monospace), x, y, text, monospace, size);
    }
}

function prepareFontData(game: Phaser.Game, monospace: number = 0): string {
    var key = 'ReturnOfGanon' + (monospace ? 'Mono' + monospace.toString() : '');

    if (Font.cachedFonts[key]) return key;

    var fontData: IFontData = {
        name: key,
        size: 32,
        lineHeight: 32,
        chars: {}
    };

    var frames = game.cache.getFrameData('sprite_rog_font');
    const letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:;\',-!.?<>() ';
    const spaceFrame = new Phaser.Frame(0, 0, 0, 0, 0, 'spacer');

    // special characters use names in the file names
    var map: any = {
        //TODO: Colon, semicolon, pipe, mudora symbols, heart symbols
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
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(c) {
        map[c] = '_' + c;
    });

    // these characters are offset a bit
    'acegjmnopqrsuvwxyz<>'.split('').forEach(function(c) {
        map[c] = {
            yOffset: 6,
            name: map[c]
        };
    });

    ','.split('').forEach(function (c) {
        map[c] = {
            yOffset: 18,
            name: map[c]
        };
    });

    // quote is offset upwards
    map["'"] = {
        yOffset: -16,
        name: map["'"]
    };

    // period has a small offset as well
    map['.'] = {
        yOffset: 18,
        name: 'period'
    };

    // space should advance the cursor
    map[' '] = {
        xAdvance: 7,
        name: ' '
    };

    //add characters
    for(var i = 0; i < letters.length; ++i) {
        let letter = letters.charAt(i);
        let code = letter.charCodeAt(0);
        let val = map[letter] || letter;
        let frame = frames.getFrameByName((val.name || val) + '.png');

        if (code === 32) {
            frame = spaceFrame;
        }

        if (!frame) continue;

        fontData.chars[code] = {
            kerning: {},
            texture: new PIXI.Texture(PIXI.utils.BaseTextureCache['sprite_rog_font'], frame.getRect()),
            xAdvance: monospace || val.xAdvance || frame.width,
            xOffset: val.xOffset || 0,
            yOffset: val.yOffset || 0
        };
    }

    PIXI.extras.BitmapText.fonts[key] = Font.cachedFonts[key] = fontData;

    return fontData.name;
}
