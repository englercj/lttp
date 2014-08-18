define([
    'vendor/gf',
    'game/data/constants',
    'game/gui/huditems'
], function(gf, C, items) {
    var Hud = function() {
        gf.Container.call(this);

        this.scale.x = this.scale.y = C.SCALE / 2;
        this.items = {};

        //Add magic meter
        this.addChild(this.items.magicMeter = new items.MagicMeter([40, 36], 1));

        //Add equipted item
        this.addChild(this.items.equipted = new items.EquiptedItem([75, 42], ''));

        //Add inventory counters
        this.addChild(this.items.rupees = new items.InventoryCounter([135, 30], 'rupees', 0));
        this.addChild(this.items.bombs = new items.InventoryCounter([195, 30], 'bombs', 0));
        this.addChild(this.items.arrows = new items.InventoryCounter([245, 30], 'arrows', 0));

        //Add life hearts
        this.addChild(this.items.life = new items.LifeMeter([320, 35], 3));
    };

    gf.inherit(Hud, gf.Container, {
        updateValues: function(link) {
            this.items.equipted.set(link.equipted);
            this.items.rupees.set(link.inventory.rupees);
            this.items.bombs.set(link.inventory.bombs);
            this.items.arrows.set(link.inventory.arrows);

            this.items.magicMeter.set(link.magic / link.maxMagic);

            this.items.life.max = link.maxHealth;
            this.items.life.set(link.health);
        }
    });

    return Hud;
});