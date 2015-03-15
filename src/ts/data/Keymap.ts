module Lttp.Data {

    export interface Keymap {

        keyboard: Keys;
        gamepad: Keys;

    }

    export interface Keys {

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

}
