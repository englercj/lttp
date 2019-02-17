import { Font } from './Font';

export class HudFont extends Font
{
    constructor(scene: Phaser.Scene, x: number, y: number, text: string = '', monospace: number = 0, size: number = 16)
    {
        super(scene, prepareFontData(scene, monospace), x, y, text, monospace, size);
    }
}

function prepareFontData(scene: Phaser.Scene, monospace: number = 0): string
{
    const key = 'sprite_hud_font';
    const fontName = 'HudFont' + (monospace ? 'Mono' + monospace.toString() : '');

    if (Font.cachedFonts[fontName])
        return fontName;

    const fontData: BitmapFontData = {
        font: fontName,
        size: 16,
        lineHeight: 16,
        retroFont: false,
        chars: {},
    };

    const letters = '0123456789';

    for (let i = 0; i < letters.length; ++i)
    {
        let letter = letters.charAt(i);
        let code = letter.charCodeAt(0);
        let frame = scene.textures.getFrame(key, letter + '.png');

        if (!frame)
            continue;

        fontData.chars[code] = {
            x: frame.x,
            y: frame.y,
            width: frame.width,
            height: frame.height,
            centerX: Math.floor(frame.width / 2),
            centerY: Math.floor(frame.height / 2),
            xOffset: 0,
            yOffset: 0,
            xAdvance: monospace || frame.width,
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
