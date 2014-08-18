define([
    'vendor/gf',
    'game/data/constants',
    'game/entities/Entity'
], function(gf, C, Entity) {
    var WorldItem = function() {
        this.sensor = true;
        this.loot = true;

        var audioSettings = { volume: C.EFFECT_VOLUME };
        this.sounds = {
            item: lttp.play.audio.add('effect_item', audioSettings),
            rupees1: lttp.play.audio.add('effect_rupee1', audioSettings),
            rupees2: lttp.play.audio.add('effect_rupee2', audioSettings)
        };

        this.textureKeys = {
            heart: 'hearts/heart.png',
            bombs: 'inventory/bombs_%d.png',
            arrows: 'inventory/arrows_%d.png',
            magic: 'magic/magic_%d.png',
            rupees: 'rupees_%d'
        };

        var itemSprite = lttp.game.cache.getTextures('sprite_worlditems');

        Entity.call(this, [itemSprite['hearts/heart.png']]);

        var self = this;
        [1,5,20].forEach(function(v) {
            self.addAnimation('rupees_' + v, [
                itemSprite['inventory/rupees_' + v + '_1.png'],
                itemSprite['inventory/rupees_' + v + '_2.png'],
                itemSprite['inventory/rupees_' + v + '_3.png']
            ], 0.1, true);
        });
    };

    gf.inherit(WorldItem, Entity, {
        setup: function(item, psys, forceLoot) {
            var loot = forceLoot || item.properties.loot,
                type = loot.split('_')[0],
                value = parseInt(loot.split('_')[1], 10) || 1,
                tx = this.textureKeys[type] || 'items/' + loot + '.png';

            if(value)
                tx = tx.replace('%d', value);

            this.type = type;
            this.value = value;

            if(type === 'rupees') {
                this.goto(0, tx).play(tx);
            } else {
                this.stop();
                this.setTexture(lttp.game.cache.getTextures('sprite_worlditems')[tx]);
            }

            this.anchor.x = 0;
            this.anchor.y = 1;

            this.position.x = item.position.x;// + (item.width / 2);
            this.position.y = item.position.y;// - (item.height / 2);

            //smallness
            this.hitArea = new gf.Rectangle(4, 4, 8, 8);

            this.visible = true;

            if(psys)
                this.enablePhysics(psys);
        },
        pickup: function() {
            this.visible = false;
            this.disablePhysics();

            if(this.type === 'rupees') {
                this.sounds.rupees1.play();
                var self = this;
                setTimeout(function() {
                    self.sounds.rupees2.play();
                }, 100)
            } else {
                this.sounds.item.play();
            }
        }
    });

    return WorldItem;
});