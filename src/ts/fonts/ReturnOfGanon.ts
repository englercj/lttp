/// <reference path="Font.ts" />

module Lttp.Fonts {
    export class ReturnOfGanon extends Fonts.Font {
        constructor(game: Phaser.Game, x: number = 0, y: number = 0, text: string = '', monospace: number = 0, size: number = 32) {
            super(game, this.prepareFontData(game, monospace), x, y, text, size, monospace);
        }

        prepareFontData(game: Phaser.Game, monospace: number = 0): string {
            var key = 'ReturnOfGanon' + (monospace ? 'Mono' + monospace.toString() : '');

            if (Fonts.Font.cachedFonts[key]) return key;

            var fontData = {
                name: key,
                size: 32,
                lineHeight: 32,
                chars: {}
            };

            var frames = game.cache.getFrameData('sprite_rog_font'),
                letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:;\',-!.?<>() ',
                spaceFrameRect = new Phaser.Rectangle(0, 0, 0, 0),
                spaceFrame = {
                    getRect: function () { return spaceFrameRect; }
                },
                letter, code, val, frame;

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
                letter = letters.charAt(i);
                code = letter.charCodeAt(0);
                val = map[letter] || letter;
                frame = frames.getFrameByName((val.name || val) + '.png');

                if(code === 32) {
                    frame = spaceFrame;
                }

                if(!frame) continue;

                fontData.chars[code] = {
                    kerning: {},
                    texture: new PIXI.Texture(PIXI.BaseTextureCache['sprite_rog_font'], frame.getRect()),
                    xAdvance: monospace || val.xAdvance || frame.width,
                    xOffset: val.xOffset || 0,
                    yOffset: val.yOffset || 0
                };
            }

            PIXI.BitmapText.fonts[key] = Fonts.Font.cachedFonts[key] = <Lttp.Fonts.FontData>fontData;

            return fontData.name;
        }
    }
}
