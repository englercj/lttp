export class BaseLttpScene extends Phaser.Scene
{
    private _loadingBar: Phaser.GameObjects.Graphics;
    private _progressBar: Phaser.GameObjects.Graphics;

    /**
     *
     * @param config Scene specific configuration settings.
     */
    constructor(config: string | Phaser.Scenes.Settings.Config)
    {
        super(config);
    }

    preload(): void
    {
        // set the background and create loading bar
        this.cameras.main.setBackgroundColor(0x98d687);
        this._createLoadingbar();

        // update loading bar on progress events
        this.load.on('progress', (value: number) =>
        {
            this._progressBar.clear();
            this._progressBar.fillStyle(0xfff6d3, 1);
            this._progressBar.fillRect(
                this.cameras.main.width / 4,
                this.cameras.main.height / 2 - 16,
                (this.cameras.main.width / 2) * value,
                16
            );
        });

        // delete bar graphics, when loading complete
        this.load.on('complete', () =>
        {
            this._progressBar.destroy();
            this._loadingBar.destroy();
        });
    }

    private _createLoadingbar(): void
    {
        this._loadingBar = this.add.graphics();
        this._loadingBar.fillStyle(0x5dae47, 1);
        this._loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this._progressBar = this.add.graphics();
    }
}
