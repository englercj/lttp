module Lttp.Gui {
    class InventoryItemSprite extends Phaser.Sprite {
        item: Data.ItemDescriptor;
        _frame: Phaser.Frame;
    }

    export class Inventory extends Phaser.Group {

        private openSound: Phaser.Sound;

        private empty: boolean;

        private frames: Phaser.FrameData;

        private grid: InventoryItemSprite[][][];

        private items: { [name: string]: InventoryItemSprite };

        private selected: InventoryItemSprite;
        private selector: Phaser.Sprite;

        private activeItem: Phaser.Sprite;
        private activeText: Fonts.ReturnOfGanon;

        private isSliding: boolean;

        private _temp: Phaser.Point;

        constructor(game: Phaser.Game, parent?: any) {
            super(game, parent, 'inventory');

            this.openSound = game.add.sound('effect_pause_close', Data.Constants.AUDIO_EFFECT_VOLUME);

            this.grid = [];
            this.empty = false;
            this.isSliding = false;

            this.frames = game.cache.getFrameData('sprite_gui');

            this.position.y = -Data.Constants.GAME_HEIGHT;
            this.visible = false;

            this._temp = new Phaser.Point();

            this._setup();

            (<Lttp.States.State>this.game.state.getCurrentState()).onInputDown.add(this._onInputDown, this);
            (<Lttp.States.State>this.game.state.getCurrentState()).onInputUp.add(this._onInputUp, this);
        }

        destroy(destroyChildren?: boolean) {
            super.destroy(destroyChildren);

            (<Lttp.States.State>this.game.state.getCurrentState()).onInputDown.removeAll(this);
            (<Lttp.States.State>this.game.state.getCurrentState()).onInputUp.removeAll(this);
        }

        private _onInputDown(key: number, value: number, event: any) {
            switch(key) {
                // UP
                case Phaser.Keyboard.UP:
                case Phaser.Keyboard.W:
                case Phaser.Gamepad.XBOX360_DPAD_UP:
                    this.move(Phaser.UP);
                    break;

                // DOWN
                case Phaser.Keyboard.DOWN:
                case Phaser.Keyboard.S:
                case Phaser.Gamepad.XBOX360_DPAD_DOWN:
                    this.move(Phaser.DOWN);
                    break;

                // LEFT
                case Phaser.Keyboard.LEFT:
                case Phaser.Keyboard.A:
                case Phaser.Gamepad.XBOX360_DPAD_LEFT:
                    this.move(Phaser.LEFT);
                    break;

                // RIGHT
                case Phaser.Keyboard.RIGHT:
                case Phaser.Keyboard.D:
                case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
                    this.move(Phaser.RIGHT);
                    break;

                // AXIS UP/DOWN
                case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
                    this.move(value > 0 ? Phaser.DOWN : Phaser.UP);
                    break;

                // AXIS LEFT/RIGHT
                case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
                    this.move(value > 0 ? Phaser.RIGHT : Phaser.LEFT);
                    break;
            }
        }

        private _onInputUp(key: number, value: number, event: any) {
        }

        updateValues() {
            var wasEmpty = this.empty;

            for(var i in this.items) {
                var sprite = <InventoryItemSprite>(this.items[i]),
                    item = sprite.item,
                    name, val, ico;

                if (!item) continue;

                name = item.name;
                val = (<Lttp.Game>this.game).player.inventory[name];

                // set the texture and visibility
                if (val || (val === 0 && (name === 'armor' || name === 'crystal'))) {
                    //some items have other sprites that should be enabled as well
                    if (name === 'flippers') {
                        this.items['txtSwim'].visible = true;
                    }
                    else if (name === 'boot') {
                        this.items['txtRun'].visible = true;
                    }

                    //run icon function if there is one
                    if (typeof item.icon === 'function') {
                        ico = item.icon(this.game);
                    } else {
                        ico = item.icon.replace('%d', val);
                    }

                    //enable item and set texture
                    sprite.setFrame(this.frames.getFrameByName(ico));
                    sprite.visible = true;

                    if (item.grid) {
                        this.empty = false;
                    }
                } else {
                    sprite.visible = false;
                }
            }

            // always show lift power
            this.items['txtLiftNum'].visible = true;
            this.items['txtLiftNum'].setFrame(this.frames.getFrameByName(
                this.items['txtLiftNum'].item.icon.replace('%d', (<Lttp.Game>this.game).player.inventory.gloves + 1)
            ));

            // first item added
            if(wasEmpty && !this.empty) {
                //setup to scan right to the first item and select it
                // this.selected.x = -1;
                // this.selected.y = 0;
                // this.onMove('right', { down: true });
                // this.onMove('right', { down: false });

                //make sure it is equipted
                //TODO: hud updates??
                // this.game.player.equipted = this.grid[this.selected.x][this.selected.y][0].item.name;
                // lttp.play.hud.updateValues(link);
            }

            this._moveSelector();
        }

        open(cb?: Function) {
            if (this.isSliding) return;

            this.isSliding = true;
            this.visible = true;
            this.openSound.play();

            this.game.add.tween(this)
                .to({ y: 0 }, Data.Constants.PLAYER_INVENTORY_DROP_TIME)
                .start()
                .onComplete.addOnce(function () {
                    this.isSliding = false;
                    if (cb) cb();
                }, this);
        }

        close(cb: Function) {
            if(this.isSliding) return;

            this.isSliding = true;

            this.game.add.tween(this)
                .to({ y: -Data.Constants.GAME_HEIGHT }, Data.Constants.PLAYER_INVENTORY_DROP_TIME)
                .start()
                .onComplete.addOnce(function () {
                    this.visible = false;
                    this.isSliding = false;
                    if (cb) cb();
                }, this);
        }

        move(dir: number) {
            if(this.empty) return;

            var next;

            switch(dir) {
                case Phaser.UP:
                    next = this._findNext(0, -1); break;
                case Phaser.DOWN:
                    next = this._findNext(0, 1); break;
                case Phaser.LEFT:
                    next = this._findNext(-1, 0); break;
                case Phaser.RIGHT:
                    next = this._findNext(1, 0); break;
            }

            if(next) {
                this.selected = this.grid[next.x][next.y][0];

                this._moveSelector();
            }
        }

        private _setup() {
            //add background
            this.game.add.sprite(0, 0, 'sprite_gui', 'inventory.png', this);

            //add item sprites
            for(var i in Data.ItemDescriptors) {
                var item = Data.ItemDescriptors[i],
                    sprite = <InventoryItemSprite>(this.game.add.sprite(item.position[0], item.position[1], 'sprite_gui', item.icon.replace('%d', 1), this));

                sprite.item = item;

                if(item.grid) {
                    this._addToGrid(sprite, item.grid);
                }

                this.items[item.name] = sprite;
            }

            this.selector = this.game.add.sprite(0, 0, 'sprite_gui', 'selector.png', this);
            this.selector.visible = false;

            this.activeItem = this.game.add.sprite(200, 25, 'sprite_gui', 'items/lantern.png', this);
            this.activeItem.visible = false;

            this.activeText = new Fonts.ReturnOfGanon(game, 175, 55);
            // this.activeText.scale.x = this.activeText.scale.y = 0.3;
            this.activeText.visible = false;
            this.add(this.activeText);
        }

        private _addToGrid(sprite: InventoryItemSprite, pos: number[]) {
            if (!this.grid[pos[0]]) {
                this.grid[pos[0]] = [];
            }

            if (!this.grid[pos[0]][pos[1]]) {
                this.grid[pos[0]][pos[1]] = [];
            }

            this.grid[pos[0]][pos[1]].push(sprite);
        }

        private _moveSelector() {
            var sprite = this.selected;

            this.selector.position.x = sprite.position.x - 5;
            this.selector.position.y = sprite.position.y - 5;

            this.activeItem.setFrame(sprite._frame);
            this.activeText.text = sprite.item.name;

            if(sprite.visible) {
                this.selector.visible = true;
                this.activeItem.visible = true;
                this.activeText.visible = true;
            }
        }

        private _findNext(stepX: number, stepY: number) {
            var pos = this._temp.set(this.selected.item.grid[0], this.selected.item.grid[1]),
                found = false,
                maxX = this.grid.length - 1,
                maxY = this.grid[0].length - 1,
                val, i;

            while(!found) {
                pos.x += stepX;
                pos.y += stepY;

                this._wrapGrid(pos, maxX, maxY);

                val = this.grid[pos.x][pos.y];
                for(i = val.length - 1; i > -1; --i) {
                    found = found || val[i].visible;
                }
            }

            return pos;
        }

        private _wrapGrid(pos: Phaser.Point, maxX: number, maxY: number) {
            //wrap X
            if(pos.x < 0) {
                pos.y--;
                pos.x = maxX;
                //left of first slot, goto last
                if(pos.y < 0) {
                    pos.y = maxY;
                }
            } else if(pos.x > maxX) {
                pos.y++;
                pos.x = 0;
                //right of last slot, goto first
                if(pos.y > maxY) {
                    pos.y = 0;
                }
            }

            //wrap Y
            if(pos.y < 0) {
                pos.x--;
                pos.y = maxY;
                //up off first slot, goto last
                if(pos.x < 0) {
                    pos.x = maxX;
                }
            } else if(pos.y > maxY) {
                pos.x++;
                pos.y = 0;
                //down off last slot, goto first
                if(pos.x > maxX) {
                    pos.x = 0;
                }
            }
        }

    }
}
