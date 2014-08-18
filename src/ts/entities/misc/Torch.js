define([
    'vendor/gf',
    'game/data/constants',
    'game/entities/Entity'
], function(gf, C, Entity) {
    var Torch = function() {
        Entity.call(this, lttp.game.cache.getTextures('sprite_misc'), 0.2);

        this.addAnimation('torch', [
            this.spritesheet['torch/torch0.png'].frames[0]
        ]);

        this.addAnimation('torch_lit', [
            this.spritesheet['torch/torch1.png'].frames[0],
            this.spritesheet['torch/torch2.png'].frames[0],
            this.spritesheet['torch/torch3.png'].frames[0]
        ], 0.09, true);

        this.addAnimation('wall_torch', [
            this.spritesheet['torch/wall_torch1.png'].frames[0],
            this.spritesheet['torch/wall_torch2.png'].frames[0],
            this.spritesheet['torch/wall_torch3.png'].frames[0]
        ], 0.09, true);

        this.light = 0.25;
    };

    gf.inherit(Torch, Entity, {
        lite: function() {
            if(this.type !== 'torch') return;

            this.goto(0, 'torch_lit').play();
            setTimeout(this.extinguish.bind(this), 5000);

            //light up dat world
            lttp.play.world.findLayer('darkness').alpha -= this.light;
        },
        extinguish: function() {
            if(this.type !== 'torch') return;

            this.gotoAndStop('torch');

            //darken dat world
            lttp.play.world.findLayer('darkness').alpha += this.light;
        }
    });

    return Torch;
});