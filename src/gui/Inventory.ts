import { ReturnOfGanonFont } from '../fonts/ReturnOfGanonFont';
import { itemDescriptors, IItemDescriptor } from '../data/ItemDescriptors';
import { AUDIO_EFFECT_VOLUME, GAME_HEIGHT, PLAYER_INVENTORY_DROP_TIME } from '../data/Constants';
import { IDictionary } from '../utility/IDictionary';
import { Player } from '../entities/Player';
import { hasOwnKey } from '../utility/hasKey';

class InventoryItemSprite extends Phaser.GameObjects.Sprite
{
    item: IItemDescriptor;
    _frame: Phaser.Textures.Frame;
}

export class Inventory extends Phaser.GameObjects.Container
{
    private openSound: Phaser.Sound.BaseSound;

    private empty: boolean;

    private grid: InventoryItemSprite[][][];

    private items: IDictionary<InventoryItemSprite>;

    private selected: InventoryItemSprite;
    private selector: Phaser.GameObjects.Sprite;

    private activeItem: Phaser.GameObjects.Sprite;
    private activeText: ReturnOfGanonFont;

    private isSliding: boolean;

    private _temp: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene)
    {
        super(scene);

        this.openSound = scene.sound.add('effect_pause_close', { volume: AUDIO_EFFECT_VOLUME });

        this.grid = [];
        this.empty = false;
        this.isSliding = false;

        this.y = -GAME_HEIGHT;
        this.visible = false;

        this._temp = new Phaser.Math.Vector2();

        this._setup();
    }

    updateValues()
    {
        const wasEmpty = this.empty;
        const player: Player = this.scene.registry.get('player');

        for (let i in this.items)
        {
            if (!hasOwnKey(this.items, i))
                continue;

            const sprite = this.items[i];
            const item = sprite.item;

            if (!item)
                continue;

            const name: string = item.name;

            if (!hasOwnKey(player.inventory, name))
                continue;

            const val: number = player.inventory[name];
            let ico: string;

            // set the texture and visibility
            if (val || (val === 0 && (name === 'armor' || name === 'crystals')))
            {
                // some items have other sprites that should be enabled as well
                if (name === 'flippers')
                {
                    this.items['txtSwim'].visible = true;
                }
                else if (name === 'boot')
                {
                    this.items['txtRun'].visible = true;
                }

                // run icon function if there is one
                if (typeof item.icon === 'function')
                {
                    ico = item.icon(player.inventory);
                }
                else
                {
                    ico = item.icon.replace('%d', val.toString());
                }

                // enable item and set texture
                sprite.setFrame(ico);
                sprite.visible = true;

                if (item.grid)
                    this.empty = false;
            }
            else
            {
                sprite.visible = false;
            }
        }

        // always show lift power
        this.items['txtLiftNum'].visible = true;
        this.items['txtLiftNum'].setFrame(
            (this.items['txtLiftNum'].item.icon as string).replace('%d', (player.inventory.gloves + 1).toString())
        );

        // first item added
        if (wasEmpty && !this.empty)
        {
            // setup to scan right to the first item and select it
            // this.selected.x = -1;
            // this.selected.y = 0;
            // this.onMove('right', { down: true });
            // this.onMove('right', { down: false });

            // make sure it is equipted
            // TODO: hud updates??
            // this.game.player.equipted = this.grid[this.selected.x][this.selected.y][0].item.name;
            // lttp.play.hud.updateValues(link);
        }

        this._moveSelector();
    }

    open(cb?: Function)
    {
        if (this.isSliding)
            return;

        this.isSliding = true;
        this.visible = true;
        this.openSound.play();

        this.scene.tweens.add({
            targets: this,
            duration: PLAYER_INVENTORY_DROP_TIME,
            y: 0,
            onComplete: () =>
            {
                this.isSliding = false;
                if (cb)
                    cb();
            },
        });

        // TODO: Does capture help here?
        this.scene.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._onKeyboardDown, this);
        this.scene.input.gamepad.on(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._onGamepadDown, this);
    }

    close(cb?: Function)
    {
        if (this.isSliding)
            return;

        this.isSliding = true;

        this.scene.tweens.add({
            targets: this,
            duration: PLAYER_INVENTORY_DROP_TIME,
            y: -GAME_HEIGHT,
            onComplete: () =>
            {
                this.visible = false;
                this.isSliding = false;
                if (cb)
                    cb();
            },
        });

        this.scene.input.keyboard.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._onKeyboardDown, this);
        this.scene.input.gamepad.off(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._onGamepadDown, this);
    }

    destroy(fromScene?: boolean)
    {
        this.scene.input.keyboard.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._onKeyboardDown, this);
        this.scene.input.gamepad.off(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._onGamepadDown, this);

        super.destroy(fromScene);
    }

    moveSelection(dir: number)
    {
        if (this.empty)
            return;

        let next: Phaser.Math.Vector2;

        switch (dir)
        {
            case Phaser.UP: next = this._findNext(0, -1); break;
            case Phaser.DOWN: next = this._findNext(0, 1); break;
            case Phaser.LEFT: next = this._findNext(-1, 0); break;
            case Phaser.RIGHT: next = this._findNext(1, 0); break;
        }

        if (next)
        {
            this.selected = this.grid[next.x][next.y][0];

            this._moveSelector();
        }
    }

    private _setup()
    {
        // add background
        this.add(this.scene.add.sprite(0, 0, 'sprite_gui', 'inventory.png'));

        // add item sprites
        for (let i in itemDescriptors)
        {
            if (!itemDescriptors.hasOwnProperty(i))
                continue;

            const item = itemDescriptors[i];
            const ico = typeof item.icon === 'function' ? item.icon(this.scene.registry.get('player')) : item.icon;

            ico.replace('%d', '1');

            let sprite = new InventoryItemSprite(this.scene, item.position[0], item.position[1], 'sprite_gui', ico);
            sprite.item = item;
            this.add(sprite);

            if (item.grid)
                this._addToGrid(sprite, item.grid);

            this.items[item.name] = sprite;
        }

        this.selector = this.scene.add.sprite(0, 0, 'sprite_gui', 'selector.png');
        this.selector.visible = false;
        this.add(this.selector);

        this.activeItem = this.scene.add.sprite(200, 25, 'sprite_gui', 'items/lantern.png');
        this.activeItem.visible = false;
        this.add(this.activeItem);

        this.activeText = new ReturnOfGanonFont(this.scene, 175, 55);
        this.activeText.visible = false;
        this.add(this.activeText);
    }

    private _addToGrid(sprite: InventoryItemSprite, pos: number[])
    {
        if (!this.grid[pos[0]])
            this.grid[pos[0]] = [];

        if (!this.grid[pos[0]][pos[1]])
            this.grid[pos[0]][pos[1]] = [];

        this.grid[pos[0]][pos[1]].push(sprite);
    }

    private _moveSelector()
    {
        const sprite = this.selected;

        this.selector.x = sprite.x - 5;
        this.selector.y = sprite.y - 5;

        this.activeItem.setFrame(sprite._frame.name);
        this.activeText.text = sprite.item.name;

        if (sprite.visible)
        {
            this.selector.visible = true;
            this.activeItem.visible = true;
            this.activeText.visible = true;
        }
    }

    private _findNext(stepX: number, stepY: number)
    {
        const pos = this._temp.set(this.selected.item.grid[0], this.selected.item.grid[1]);
        const maxX = this.grid.length - 1;
        const maxY = this.grid[0].length - 1;
        let found = false;

        while (!found)
        {
            pos.x += stepX;
            pos.y += stepY;

            this._wrapGrid(pos, maxX, maxY);

            const val = this.grid[pos.x][pos.y];
            for (let i = val.length - 1; i > -1; --i)
            {
                found = found || val[i].visible;
            }
        }

        return pos;
    }

    private _wrapGrid(pos: Phaser.Math.Vector2, maxX: number, maxY: number)
    {
        // wrap X
        if (pos.x < 0)
        {
            pos.y--;
            pos.x = maxX;
            // left of first slot, goto last
            if (pos.y < 0)
            {
                pos.y = maxY;
            }
        }
        else if (pos.x > maxX)
        {
            pos.y++;
            pos.x = 0;
            // right of last slot, goto first
            if (pos.y > maxY)
            {
                pos.y = 0;
            }
        }

        // wrap Y
        if (pos.y < 0)
        {
            pos.x--;
            pos.y = maxY;
            // up off first slot, goto last
            if (pos.x < 0)
            {
                pos.x = maxX;
            }
        }
        else if (pos.y > maxY)
        {
            pos.x++;
            pos.y = 0;
            // down off last slot, goto first
            if (pos.x > maxX)
            {
                pos.x = 0;
            }
        }
    }

    private _onGamepadDown(index: number, value: number, button: Phaser.Input.Gamepad.Button)
    {
        switch (index)
        {
            case Phaser.Input.Gamepad.Configs.XBOX_360.UP:
                this.moveSelection(Phaser.UP);
                break;

            case Phaser.Input.Gamepad.Configs.XBOX_360.DOWN:
                this.moveSelection(Phaser.DOWN);
                break;

            case Phaser.Input.Gamepad.Configs.XBOX_360.LEFT:
                this.moveSelection(Phaser.LEFT);
                break;

            case Phaser.Input.Gamepad.Configs.XBOX_360.RIGHT:
                this.moveSelection(Phaser.RIGHT);
                break;
        }
    }

    private _onKeyboardDown(event: KeyboardEvent)
    {
        switch (event.keyCode)
        {
            case Phaser.Input.Keyboard.KeyCodes.UP:
            case Phaser.Input.Keyboard.KeyCodes.W:
                this.moveSelection(Phaser.UP);
                break;

            case Phaser.Input.Keyboard.KeyCodes.DOWN:
            case Phaser.Input.Keyboard.KeyCodes.S:
                this.moveSelection(Phaser.DOWN);
                break;

            case Phaser.Input.Keyboard.KeyCodes.LEFT:
            case Phaser.Input.Keyboard.KeyCodes.A:
                this.moveSelection(Phaser.LEFT);
                break;

            case Phaser.Input.Keyboard.KeyCodes.RIGHT:
            case Phaser.Input.Keyboard.KeyCodes.D:
                this.moveSelection(Phaser.RIGHT);
                break;

            // // AXIS UP/DOWN
            // case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
            //     this.move(value > 0 ? Phaser.DOWN : Phaser.UP);
            //     break;

            // // AXIS LEFT/RIGHT
            // case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
            //     this.move(value > 0 ? Phaser.RIGHT : Phaser.LEFT);
            //     break;
        }
    }
}
