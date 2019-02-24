export interface IKeymap
{
    keyboard: IKeys;
    gamepad: IKeys;
}

export interface IKeys
{
    up: number;
    down: number;
    left: number;
    right: number;

    use: number;
    useItem: number;
    attack: number;

    menuSave: number;
    menuMap: number;
    menuInv: number;
}

export const keymap: IKeymap = {
    keyboard: {
        up:         Phaser.Input.Keyboard.KeyCodes.W,
        down:       Phaser.Input.Keyboard.KeyCodes.S,
        left:       Phaser.Input.Keyboard.KeyCodes.A,
        right:      Phaser.Input.Keyboard.KeyCodes.D,

        use:        Phaser.Input.Keyboard.KeyCodes.E,
        useItem:    Phaser.Input.Keyboard.KeyCodes.V,
        attack:     Phaser.Input.Keyboard.KeyCodes.SPACE,

        menuSave:   Phaser.Input.Keyboard.KeyCodes.B,
        menuMap:    Phaser.Input.Keyboard.KeyCodes.M,
        menuInv:    Phaser.Input.Keyboard.KeyCodes.I,
    },
    gamepad: {
        up:         Phaser.Input.Gamepad.Configs.XBOX_360.DPAD_UP,
        down:       Phaser.Input.Gamepad.Configs.XBOX_360.DPAD_DOWN,
        left:       Phaser.Input.Gamepad.Configs.XBOX_360.DPAD_LEFT,
        right:      Phaser.Input.Gamepad.Configs.XBOX_360.DPAD_RIGHT,

        use:        Phaser.Input.Gamepad.Configs.XBOX_360.A,
        useItem:    Phaser.Input.Gamepad.Configs.XBOX_360.Y,
        attack:     Phaser.Input.Gamepad.Configs.XBOX_360.B,

        menuSave:   Phaser.Input.Gamepad.Configs.XBOX_360.BACK,
        menuMap:    Phaser.Input.Gamepad.Configs.XBOX_360.X,
        menuInv:    Phaser.Input.Gamepad.Configs.XBOX_360.START,
    },
};
