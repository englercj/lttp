define([
    'vendor/gf',
    'game/data/constants',
    'game/entities/Entity'
], function(gf, C, Entity) {
    var Particle = function() {
        this.sensor = true;

        Entity.call(this, lttp.game.cache.getTextures('sprite_particles'), 0.1);

        this.anchor.x = 0;
        this.anchor.y = 1;

        this.on('complete', this.expire.bind(this));
    };

    gf.inherit(Particle, Entity, {
        run: function(item, phys) {
            var cfg = this.cfg = item.particle;

            this.visible = true;
            this.hitArea = cfg.hitArea || new Rectangle(0, 8, 8, 8);

            if(!this.animations[item.name]) {
                var frames = [];

                for(var i = 0; i < cfg.num; ++i) {
                    frames.push(this.spritesheet[cfg.path + (i+1) + cfg.ext].frames[0]);
                }

                this.addAnimation(item.name, frames, cfg.speed, cfg.loop);
            }

            //set type
            this.name = item.name;
            this.type = cfg.type;

            //play animation for this item
            this.goto(0, item.name).play();
            this.enablePhysics(phys);

            //set position
            var link = lttp.play.link,
                p = link.position,
                space = cfg.spacing;

            switch(lttp.play.link.lastDir) {
                case 'up':
                    this.setPosition(
                        p.x + (link.width / 2) - (this.width / 2),
                        p.y - space - link.height
                    );
                    break;
                case 'down':
                    this.setPosition(
                        p.x + (link.width / 2) - (this.width / 2),
                        p.y + space + this.height
                    );
                    break;
                case 'left':
                    this.setPosition(
                        p.x - space - this.width,
                        p.y - 3
                    );
                    break;
                case 'right':
                    this.setPosition(
                        p.x + space + link.width,
                        p.y - 3
                    );
                    break;
            }

            //if there is a velocity set it
            if(cfg.velocity) {
                this.velocity = cfg.velocity.clone();
                this.setVelocity(this.velocity);

                if(cfg.velocityTimer) {
                    var cb;
                    if(cfg.velocityReverse) {
                        cb = this.reverse;
                    } else {
                        cb = this.expire;
                    }

                    this.velto = setTimeout(cb.bind(this), cfg.velocityTimer)
                }
            }
        },
        expire: function() {
            clearTimeout(this.velto);
            this.stop();
            this.visible = false;
            this.disablePhysics();
        },
        reverse: function() {
            clearTimeout(this.velto);
            this.velocity.x = -this.velocity.x;
            this.velocity.y = -this.velocity.y;

            this.setVelocity(this.velocity);
        },
        _collide: function(obj, vec, colShape, myShape) {
            //fire particle
            if(this.type === 'fire') {
                if(obj.lite) {
                    obj.lite();
                }
            }

            //firerod hitting wall
            if(this.name === 'firerod') {
                if(obj.type === C.ENTITY.TILE) {
                    this.expire();
                }
            }
            //boomerang hitting stuff
            else if(this.name === 'boomerang') {
                switch(obj.type) {
                    //reverse the velocity back to the player
                    case C.ENTITY.TILE:
                        this.reverse();
                        break;

                    //expire (player caught it)
                    case C.ENTITY.PLAYER:
                        this.expire();
                        break;
                }
            }
        }
    });

    return Particle;
});