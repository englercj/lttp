define([
    'vendor/gf'
], function(gf) {
    var font = {
        name: 'ReturnOfGanon',
        size: 32,
        lineHeight: 32,
        chars: {}
    },
    letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:;\',-!.?<>() ',
    i, code, letter, val, map, sprite, tex;
    

    function createFont() {
        sprite = lttp.game.cache.getTextures('sprite_rog_font');

        map = {
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

        'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(c) {
            map[c] = '_' + c;
        });

        'gjpqy,<>'.split('').forEach(function(c) {
            map[c] = {
                yOffset: 6,
                name: map[c]
            };
        });

        'acemnorsuvwxz'.split('').forEach(function(c) {
            map[c] = {
                yOffset: 6,
                name: map[c]
            };
        });

        map["'"] = {
            yOffset: -16,
            name: map["'"]
        };

        map[' '] = {
            xAdvance: 7,
            name: ' '
        };

        map['.'] = {
            yOffset: 18,
            name: 'period'
        };

        //add characters
        for(i = 0; i < letters.length; ++i) {
            letter = letters.charAt(i);
            code = letter.charCodeAt(0);
            val = map[letter] || letter;
            tex = sprite[(val.name || val) + '.png'];

            if(code === 32) {
                tex = lttp.game.cache.getTexture('__default');
            }

            if(!tex) continue;

            font.chars[code] = {
                kerning: {},
                texture: tex,
                xAdvance: val.xAdvance || tex.frame.width,
                xOffset: val.xOffset || 0,
                yOffset: val.yOffset || 0
            };
        }

        gf.PIXI.BitmapText.fonts[font.name] = font;
    }

    var ReturnOfGanon = function(text, style) {
        if(!sprite)
            createFont();

        gf.BitmapText.call(this, text || '', font, style);
    };

    gf.inherit(ReturnOfGanon, gf.BitmapText);

    return ReturnOfGanon;
});