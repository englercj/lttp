define([
    'vendor/gf'
], function(gf) {
    var font = {
        name: 'HudFont',
        size: 16,
        lineHeight: 16,
        chars: {}
    },
    letters = '0123456789',
    i, code, letter, sprite, tex;

    function createFont() {
        sprite = lttp.game.cache.getTextures('sprite_hud_font');

        //add characters
        for(i = 0; i < letters.length; ++i) {
            letter = letters.charAt(i);
            code = letter.charCodeAt(0);
            tex = sprite[letter + '.png'];

            if(!tex) continue;

            font.chars[code] = {
                kerning: {},
                texture: tex,
                xAdvance: tex.frame.width,
                xOffset: 0,
                yOffset: 0
            };
        }

        gf.PIXI.BitmapText.fonts[font.name] = font;
    }

    var Hud = function(text) {
        if(!sprite)
            createFont();

        gf.BitmapText.call(this, text || '', font);
    };

    gf.inherit(Hud, gf.BitmapText);

    return Hud;
});