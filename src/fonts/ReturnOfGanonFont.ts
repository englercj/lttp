import { Font } from './Font';
import { IDictionary } from '../utility/IDictionary';

export class ReturnOfGanonFont extends Font
{
    // You may notice that the "size" param default is 16, not 32 like when we create the font in "prepareFontData"
    // this is because we actually want the font to be half-size when used.
    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0, text: string = '', monospace: number = 0, size: number = 16)
    {
        super(scene, prepareFontData(scene, monospace), x, y, text, monospace, size);
    }
}

function prepareFontData(scene: Phaser.Scene, monospace: number = 0): string
{
    const key = 'sprite_rog_font';
    const fontName = 'ReturnOfGanon' + (monospace ? 'Mono' + monospace.toString() : '');

    if (Font.cachedFonts[fontName])
        return fontName;

    const fontData: BitmapFontData = {
        font: fontName,
        size: 32,
        lineHeight: 32,
        retroFont: false,
        chars: {},
    };

    const letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:;\',-!.?<>() ';

    interface ICharData
    {
        name: string;
        xOffset?: number;
        yOffset?: number;
        xAdvance?: number;
    }

    // special characters use names in the file names
    const map: IDictionary<string | ICharData> = {
        // TODO: Colon, semicolon, pipe, mudora symbols, heart symbols
        ':': 'colon',
        ';': 'semicolon',

        ',': 'comma',
        '-': 'dash',
        '!': 'exclamation',
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
            name: map[c] as string,
        };
    });

    ','.split('').forEach((c: string) => {
        map[c] = {
            yOffset: 18,
            name: map[c] as string,
        };
    });

    // quote is offset upwards
    map['\''] = {
        yOffset: -16,
        name: 'comma',
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

    const spaceFrame = new Phaser.Textures.Frame(scene.textures.get(key), 'rot_space_frame', 0, 0, 0, 0, 0);

    // add characters
    for (let i = 0; i < letters.length; ++i)
    {
        const letter = letters.charAt(i);
        const code = letter.charCodeAt(0);
        const val = map[letter] || letter;
        const frameKey = typeof val === 'string' ? val : val.name;
        const frame = code === 32
            ? spaceFrame
            : scene.textures.getFrame(key, frameKey + '.png');

        if (!frame)
            continue;

        fontData.chars[code] = {
            x: frame.x,
            y: frame.y,
            width: frame.width,
            height: frame.height,
            centerX: Math.floor(frame.width / 2),
            centerY: Math.floor(frame.height / 2),
            xOffset: typeof val !== 'string' ? val.xOffset : 0,
            yOffset: typeof val !== 'string' ? val.yOffset : 0,
            xAdvance: monospace || (typeof val !== 'string' ? val.xAdvance : 0) || frame.width,
            data: {},
            kerning: {},
        };
    }

    scene.cache.bitmapFont.add(fontName, {
        data: fontData,
        texture: key,
    });

    Font.cachedFonts[fontName] = true;

    return fontName;
}
