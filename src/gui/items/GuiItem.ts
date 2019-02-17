export class GuiItem<T> extends Phaser.GameObjects.Container
{
    constructor(scene: Phaser.Scene, x: number, y: number, name: string, public value: T)
    {
        super(scene, x, y);

        this.name = name;
    }

    setValue(val: T): this
    {
        this.value = val;

        return this;
    }
}
