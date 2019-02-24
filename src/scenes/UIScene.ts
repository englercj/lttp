import { Player } from '../entities/Player';
import { Hud } from '../gui/Hud';
import { Dialog } from '../gui/Dialog';
import { Entity } from '../entities/Entity';
import { LevelScene } from './LevelScene';
import { keymap } from '../data/Keymap';

export interface IUISceneData
{
    player: Player;
}

export class UIScene extends Phaser.Scene
{
    static KEY = 'UIScene';

    player: Player = null;

    dialog: Dialog = null;
    hud: Hud = null;

    constructor()
    {
        super(UIScene.KEY);
    }

    init(data: IUISceneData)
    {
        this.player = data.player;
    }

    create()
    {
        this.dialog = new Dialog(this, 34, 146, true, false);
        this.dialog.setScrollFactor(0);
        this.add.existing(this.dialog);
        this.add.existing(this.hud);

        this.hud = new Hud(this, 0, 0);
        this.dialog.setScrollFactor(0);

        this.player.on('readSign', this._handleReadSign, this);
        this.player.on('inventoryChange', this._handleInventoryChange, this);

        this.hud.updateValues(this.player);

        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._handleKeyboardDown, this);
        this.input.gamepad.on(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._handleGamepadButton, this);

        this.events.once('shutdown', this._handleShutdown, this);
    }

    private _handleShutdown()
    {
        this.player.off('inventoryChange', this._handleInventoryChange, this);

        this.input.keyboard.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._handleKeyboardDown, this);
        this.input.gamepad.off(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._handleGamepadButton, this);
    }

    private _handleKeyboardDown(event: KeyboardEvent)
    {
        const key = event.keyCode;

        if (key === keymap.keyboard.use && this.dialog.visible)
        {
            this._handleDialogPress();
        }
    }

    private _handleGamepadButton(index: number, value: number, active: boolean)
    {
        if (index === keymap.gamepad.use && this.dialog.visible)
        {
            this._handleDialogPress();
        }
    }

    private _handleDialogPress()
    {
        if (this.dialog.typing || this.dialog.queue.length)
        {
            this.dialog.advance();
        }
        else
        {
            this.dialog.hide();
            this.scene.resume(LevelScene.KEY);
        }
    }

    private _handleInventoryChange()
    {
        this.hud.updateValues(this.player);
    }

    private _handleReadSign(sign: Entity)
    {
        this.scene.pause(LevelScene.KEY);
        this.dialog.show(sign.properties.text);
    }
}
