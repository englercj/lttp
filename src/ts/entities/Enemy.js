define([
    'vendor/gf',
    'game/data/types',
    'game/entities/Entity'
], function(gf, types, Entity) {
    var Enemy = function(spritesheet) {
        Entity.call(this, spritesheet);

        //enemy type
        this.type = types.ENTITY.ENEMY;
        this.attacking = true;
    };

    gf.inherit(Enemy, Entity, {

    });

    return Enemy;
});
