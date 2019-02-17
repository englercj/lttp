import { COLORS, EFFECT_OVERLAY_SCROLL_FACTOR } from '../data/Constants';

export class MapOverlay extends Phaser.GameObjects.Container
{
    private _darkenerTexture: Phaser.Textures.CanvasTexture;
    private _darkener: Phaser.GameObjects.Image;
    private _animator: Phaser.GameObjects.TileSprite;

    private _activeEffect: string;

    private _rainFrame = 0;
    private _rainFrameTime = 18;
    private _rainTimer: Phaser.Time.TimerEvent = null;
    private _rainFrames = [
        'rain/rain1.png',
        'rain/rain2.png',
        'rain/rain3.png',
        'rain/rain4.png',
    ];

    private _cachedCameraPos: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene)
    {
        super(scene, null);

        this.setScrollFactor(0);

        const camera = scene.cameras.main;

        const canvas = document.createElement('canvas');
        canvas.width = camera.width;
        canvas.height = camera.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = `rgba(${COLORS.BLACK[0]}, ${COLORS.BLACK[1]}, ${COLORS.BLACK[2]}, ${COLORS.BLACK[3]})`;
        ctx.fillRect(0, 0, camera.width, camera.height);

        this._darkenerTexture = scene.game.textures.addCanvas('map_overlay_darkener', canvas);

        this._darkener = scene.add.image(0, 0, 'map_overlay_darkener');
        this._darkener.alpha = 0.5;
        this._darkener.name = 'darkener';
        this.add(this._darkener);

        this._animator = scene.add.tileSprite(0, 0, camera.width, camera.height, 'sprite_overlays');
        this._animator.alpha = 0.8;
        this._animator.name = 'animator';
        this._animator.setFrame('rain/rain1.png');
        this.add(this._animator);

        this._cachedCameraPos = new Phaser.Math.Vector2(camera.x, camera.y);
    }

    activate(anim: string)
    {
        this.visible = true;

        this._activeEffect = anim;

        switch (anim)
        {
            case 'rain':
                this._nextRainFrame();
                // this._animator.anims.play('rain');
                this._animator.visible = true;
                this._darkener.visible = true;
        }
    }

    deactivate()
    {
        this._rainTimer.remove(false);
        // this._animator.anims.stop();
        this._animator.visible = false;
        this._darkener.visible = false;

        this.visible = false;
    }

    update()
    {
        if (this.scene.cameras.main.x !== this._cachedCameraPos.x)
        {
            const diff = this.scene.cameras.main.x - this._cachedCameraPos.x;

            this._cachedCameraPos.x = this.scene.cameras.main.x;

            this._animator.tilePositionX -= diff * EFFECT_OVERLAY_SCROLL_FACTOR;
        }

        if (this.scene.cameras.main.y !== this._cachedCameraPos.y)
        {
            const diff = this.scene.cameras.main.y - this._cachedCameraPos.y;

            this._cachedCameraPos.y = this.scene.cameras.main.y;

            this._animator.tilePositionY -= diff * EFFECT_OVERLAY_SCROLL_FACTOR;
        }
    }

    private _nextRainFrame()
    {
        const frame = this._rainFrames[this._rainFrame];
        this._animator.setFrame(frame);

        this._rainTimer = this.scene.time.delayedCall(this._rainFrameTime, this._nextRainFrame, [], this);
        this._rainFrame = (this._rainFrame + 1) % this._rainFrames.length;
    }
}
