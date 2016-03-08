export interface IKeymap {
    keyboard: Keys;
    gamepad: Keys;
}

export interface IKeys {
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
