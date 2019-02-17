import { IDictionary } from '../utility/IDictionary';

export class Font extends Phaser.GameObjects.BitmapText
{
    static cachedFonts: IDictionary<boolean> = {};

    monospace: number;

    constructor(scene: Phaser.Scene, font: string, x: number = 0, y: number = 0, text: string = '', monospace: number = 0, size: number = 32)
    {
        super(scene, x, y, font, text, size);
        this.monospace = monospace;
    }
}
