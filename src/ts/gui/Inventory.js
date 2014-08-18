define([
    'vendor/gf',
    'game/data/constants',
    'game/fonts/ReturnOfGanon',
    'game/data/items'
], function(gf, C, ReturnOfGanonFont, items) {
    var Inventory = function() {
        gf.Container.call(this);

        var audioSettings = { volume: C.MUSIC_VOLUME };
        this.sounds = {
            open: lttp.play.audio.add('effect_pause_close'), //yup, named weird but this is the sound it makes when opening the inventory
        };

        this.grid = [];
        this._setup();

        this.scale.x = this.scale.y = C.SCALE;
        this.position.y = -C.HEIGHT * C.SCALE;
        this.visible = false;
        this.move = {};

        this.empty = true;
    };

    gf.inherit(Inventory, gf.Container, {
        updateValues: function(link) {
            var wasEmpty = this.empty,
                guiSprite = lttp.game.cache.getTextures('sprite_gui');

            for(var i = 0; i < this.children.length; ++i) {
                var spr = this.children[i],
                    item = spr.item,
                    name = item ? item.name : null,
                    val, ico;

                if(!name) continue;

                val = link.inventory[name];

                //set texture, set visible
                if(val || (val === 0 && (name === 'armor' || name === 'crystal'))) {
                    //some items have partners that come with them
                    if(name === 'flippers') {
                        this.txtSwim.visible = true;
                    }
                    else if(name === 'boot') {
                        this.txtRun.visible = true;
                    }

                    //run icon function if there is one
                    if(item.icon.call) {
                        ico = item.icon(link);
                    } else {
                        ico = item.icon.replace('%d', val);
                    }

                    //enable item and set texture
                    spr.visible = true;
                    spr.setTexture(guiSprite[ico]);

                    if(item.grid)
                        this.empty = false;
                } else {
                    spr.visible = false;
                }
            }

            this.txtLiftNum.visible = true;
            this.txtLiftNum.setTexture(
                guiSprite[
                    this.txtLiftNum.item.icon.replace('%d', link.inventory.gloves + 1)
                ]
            );

            //first item added
            if(wasEmpty && !this.empty) {
                //setup to scan right to the first item and select it
                this.selected.x = -1;
                this.selected.y = 0;
                this.onMove('right', { down: true });
                this.onMove('right', { down: false });

                //make sure it is equipted
                link.equipted = this.grid[this.selected.x][this.selected.y].item.name;
                lttp.play.hud.updateValues(link);
            }

            this._moveSelector();
        },
        show: function(cb) {
            if(this.moving) return;

            this.moving = true;
            this.visible = true;
            this.sounds.open.play();

            var self = this;
            TweenLite.to(this.parent.position, C.INVENTORY_DROP_TIME, {
                y: C.HEIGHT * C.SCALE,
                ease: Linear.easeNone,
                onComplete: function() {
                    self.moving = false;
                    if(cb) cb();
                }
            });
        },
        hide: function(cb) {
            if(this.moving) return;

            this.moving = true;

            var self = this;
            TweenLite.to(this.parent.position, C.INVENTORY_DROP_TIME, {
                y: 0,
                ease: Linear.easeNone,
                onComplete: function() {
                    self.visible = false;
                    self.moving = false;
                    if(cb) cb();
                }
            });
        },
        _selectItem: function(name) {
            var x, y;

            for(x = 0; x < this.grid.length; ++x) {
                for(y = 0; y < this.grid[x].length; ++y) {
                    if(this.grid[x][y].item.name === name) {
                        this.selected.x = x;
                        this.selected.y = y;
                        break;
                    }
                }
            }

            this._moveSelector();
        },
        _setup: function() {
            var guiSprite = lttp.game.cache.getTextures('sprite_gui');

            //add background
            this.addChild(new gf.Sprite(guiSprite['inventory.png']));

            //add item sprites
            for(var i = 0; i < items.length; ++i) {
                var item = items[i],
                    spr;

                if(item._icon)
                    spr = new gf.Sprite(guiSprite[item._icon]);
                else
                    spr = new gf.Sprite(guiSprite[item.icon.replace('%d', 1)]);

                spr.item = item;
                spr.position.x = item.position[0];
                spr.position.y = item.position[1];

                if(item.grid)
                    this._addToGrid(spr, item.grid);

                if(item.name === 'txtSwim' || item.name === 'txtRun' || item.name === 'txtLiftNum')
                    this[item.name] = spr;

                this.addChild(spr);
            }

            this.selected = new gf.Vector(0, 0);
            this.selector = new gf.Sprite(guiSprite['selector.png']);
            this.selector.visible = false;
            this.addChild(this.selector);

            this.activeItem = new gf.Sprite(guiSprite['items/lantern.png']);
            this.activeItem.position.x = 200;
            this.activeItem.position.y = 25;
            this.activeItem.visible = false;
            this.addChild(this.activeItem);

            this.activeText = new ReturnOfGanonFont();
            this.activeText.position.x = 175;
            this.activeText.position.y = 55;
            this.activeText.scale.x = this.activeText.scale.y = 0.3;
            this.activeText.visible = false;
            this.addChild(this.activeText);
        },
        _addToGrid: function(spr, pos) {
            if(!this.grid[pos[0]]) {
                this.grid[pos[0]] = [];
            }

            //only one in that slot
            if(!this.grid[pos[0]][pos[1]]) {
                this.grid[pos[0]][pos[1]] = spr;
            }
            //multiple in that slot
            else {
                var s1 = this.grid[pos[0]][pos[1]];
                if(s1 instanceof Array) {
                    this.grid[pos[0]][pos[1]].push(spr);
                } else {
                    this.grid[pos[0]][pos[1]] = [s1, spr];
                }
            }
        },
        _moveSelector: function() {
            var s = this.grid[this.selected.x][this.selected.y];

            if(s.length) {
                for(var i = s.length - 1; i > -1; --i) {
                    if(s[i].visible) {
                        s = s[i];
                        break;
                    }
                }
            }

            this.selector.position.x = s.position.x - 5;
            this.selector.position.y = s.position.y - 5;

            this.activeItem.setTexture(s.texture);

            this.activeText.text = s.item.name;

            if(s.visible) {
                this.selector.visible = true;
                this.activeItem.visible = true;
                this.activeText.visible = true;
            }
        },
        onMove: function(dir, e) {
            if(this.empty) return;

            if(e.originalEvent)
                e.originalEvent.preventDefault();

            // .down is keypressed down
            if(e.down) {
                if(this.move[dir]) return; //skip repeats (holding a key down)

                this.move[dir] = true;
            } else {
                this.move[dir] = false;
                return;
            }

            var next;

            if(dir === 'up') {
                //scan down to find the next item
                next = this._findNext(0, -1);
            } else if(dir === 'down') {
                next = this._findNext(0, 1);
            } else if(dir === 'left') {
                next = this._findNext(-1, 0);
            } else if(dir === 'right') {
                next = this._findNext(1, 0);
            }

            if(next) {
                this.selected.x = next.x;
                this.selected.y = next.y;

                this._moveSelector();
            }
        },
        _findNext: function(x, y) {
            var pos = this.selected.clone(),
                found = false,
                maxX = this.grid.length - 1,
                maxY = this.grid[0].length - 1,
                val;

            while(!found) {
                pos.x += x;
                pos.y += y;

                this._wrapGrid(pos, maxX, maxY);

                val = this.grid[pos.x][pos.y];
                if(val.length) {
                    for(var i = val.length - 1; i > -1; --i) {
                        found = found || val[i].visible;
                    }
                } else {
                    found = found || val.visible;
                }
            }

            return pos;
        },
        _wrapGrid: function(pos, maxX, maxY) {
            //wrap X
            if(pos.x < 0) {
                pos.y--;
                pos.x = maxX;
                //left of first slot, goto last
                if(pos.y < 0)
                    pos.y = maxY;
            } else if(pos.x > maxX) {
                pos.y++;
                pos.x = 0;
                //right of last slot, goto first
                if(pos.y > maxY)
                    pos.y = 0;
            }

            //wrap Y
            if(pos.y < 0) {
                pos.x--;
                pos.y = maxY;
                //up off first slot, goto last
                if(pos.x < 0)
                    pos.x = maxX;
            } else if(pos.y > maxY) {
                pos.x++;
                pos.y = 0;
                //down off last slot, goto first
                if(pos.x > maxX)
                    pos.x = 0;
            }
        },
        onGpMove: function(e) {
            var dir;

            if(e.code === gf.GamepadSticks.AXIS.LEFT_ANALOGUE_HOR) {
                if(e.value > 0) {
                    if(this.move.right)
                        return;

                    dir = 'right';
                } else {
                    if(this.move.left)
                        return;

                    dir = 'left';
                }
            }
            else {
                if(e.value > 0) {
                    if(this.move.down)
                        return;

                    dir = 'down';
                } else {
                    if(this.move.up)
                        return;

                    dir = 'up';
                }
            }

            if(dir)
                this.onMove(dir, { down: true });
        }
    });

    return Inventory;
});