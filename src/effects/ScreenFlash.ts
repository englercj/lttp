/**
 * @callback CameraFlashCallback
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
 * @param {number} progress - The progress of the effect. A value between 0 and 1.
 */
type TCameraFlashCallback = (camera: Phaser.Cameras.Scene2D.Camera, progress: number) => void;

/**
 * @classdesc
 * A Camera Flash effect.
 *
 * This effect will flash the camera viewport to the given color, over the duration specified.
 *
 * Only the camera viewport is flashed. None of the objects it is displaying are impacted, i.e. their colors do
 * not change.
 *
 * The effect will dispatch several events on the Camera itself and you can also specify an `onUpdate` callback,
 * which is invoked each frame for the duration of the effect, if required.
 *
 * @class Flash
 * @memberof Phaser.Cameras.Scene2D.Effects
 * @constructor
 * @since 3.5.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera this effect is acting upon.
 */
export class ScreenFlash
{
    /**
     * The Camera this effect belongs to.
     */
    camera: Phaser.Cameras.Scene2D.Camera;

    /**
     * Is this effect actively running?
     */
    isRunning = false;

    /**
     * The duration of the effect, in milliseconds.
     */
    duration = 0;

    /**
     * If this effect is running this holds the current percentage of the progress, a value between 0 and 1.
     */
    progress = 0;

    /**
     * The color the camera will use for the fade effect, in the format [R, G, B].
     * Each component value is between 0 and 255.
     */
    private color = [255, 255, 255];

    /**
     * The value of the alpha channel used during the fade effect.
     * A value between 0 and 1.
     */
    private alpha = 0;

    /**
     * The starting value of the alpha channel used during the fade effect.
     * A value between 0 and 1.
     */
    private startAlpha = 0;

    /**
     * Effect elapsed timer.
     */
    private _elapsed = 0;

    /**
     * This callback is invoked every frame for the duration of the effect.
     */
    private _onUpdate: TCameraFlashCallback = null;

    /**
     * This callback is invoked every frame for the duration of the effect.
     */
    private _onUpdateScope: any = null;

    constructor(camera: Phaser.Cameras.Scene2D.Camera)
    {
        this.camera = camera;
    }

    /**
     * This event is fired when the flash effect begins to run on a camera.
     *
     * @event CameraFlashStartEvent
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
     * @param {Phaser.Cameras.Scene2D.Effects.Flash} effect - A reference to the effect instance.
     * @param {integer} duration - The duration of the effect.
     * @param {integer[]} color - The color values.
     * @param {integer} alpha - The alpha value.
     */

    /**
     * This event is fired when the flash effect completes.
     *
     * @event CameraFlashCompleteEvent
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
     * @param {Phaser.Cameras.Scene2D.Effects.Flash} effect - A reference to the effect instance.
     */

    /**
     * Flashes the Camera to or from the given color over the duration specified.
     *
     * @fires CameraFlashStartEvent
     * @fires CameraFlashCompleteEvent
     *
     * @param duration The duration of the effect in milliseconds.
     * @param color The amount to fade the colorl towards. Each channel value is between 0 and 255.
     * @param alpha The alpha value to start the fade color at. Between 0 and 1.
     * @param force Force the effect to start immediately, even if already running.
     * @param callback This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The Camera on which the effect was started.
     */
    start(
        duration: number = 250,
        color: number[] = [255, 255, 255],
        alpha: number = 1,
        force: boolean = false,
        callback: TCameraFlashCallback = null,
        context: any = this.camera.scene)
    {
        if (!force && this.isRunning)
        {
            return this.camera;
        }

        this.isRunning = true;
        this.duration = duration;
        this.progress = 0;

        this.color[0] = color[0];
        this.color[1] = color[1];
        this.color[2] = color[2];
        this.alpha = alpha;
        this.startAlpha = alpha;

        this._elapsed = 0;

        this._onUpdate = callback;
        this._onUpdateScope = context;

        this.camera.emit('cameraflashstart', this.camera, this, duration, color, alpha);

        return this.camera;
    }

    /**
     * The main update loop for this effect. Called automatically by the Camera.
     *
     * @param time The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param delta The delta time, in ms, elapsed since the last frame.
     */
    update(time: number, delta: number)
    {
        if (!this.isRunning)
        {
            return;
        }

        this._elapsed += delta;

        this.progress = Phaser.Math.Clamp(this._elapsed / this.duration, 0, this.startAlpha);

        if (this._onUpdate)
        {
            this._onUpdate.call(this._onUpdateScope, this.camera, this.progress);
        }

        if (this._elapsed < this.duration)
        {
            this.alpha = this.startAlpha - this.progress;
        }
        else
        {
            this.effectComplete();
        }
    }

    /**
     * Called internally by the Canvas Renderer.
     *
     * @param ctx The Canvas context to render to.
     *
     * @return {boolean} `true` if the effect drew to the renderer, otherwise `false`.
     */
    postRenderCanvas(ctx: CanvasRenderingContext2D)
    {
        if (!this.isRunning)
        {
            return false;
        }

        const camera: any = this.camera;

        ctx.fillStyle = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',' + this.alpha + ')';
        ctx.fillRect(camera._cx, camera._cy, camera._cw, camera._ch);

        return true;
    }

    /**
     * Called internally by the WebGL Renderer.
     *
     * @param pipeline The WebGL Pipeline to render to.
     * @param getTintFunction A function that will return the gl safe tint colors.
     *
     * @return {boolean} `true` if the effect drew to the renderer, otherwise `false`.
     */
    postRenderWebGL(
        pipeline: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
        getTintFunction: (r: number, g: number, b: number, a: number) => number)
    {
        if (!this.isRunning)
        {
            return false;
        }

        const camera: any = this.camera;
        const red = this.color[0] / 255;
        const green = this.color[1] / 255;
        const blue = this.color[2] / 255;

        pipeline.drawFillRect(
            camera._cx, camera._cy, camera._cw, camera._ch,
            getTintFunction(red, green, blue, 1),
            this.alpha
        );

        return true;
    }

    /**
     * Called internally when the effect completes.
     */
    effectComplete()
    {
        this._onUpdate = null;
        this._onUpdateScope = null;

        this.isRunning = false;

        this.camera.emit('cameraflashcomplete', this.camera, this);
    }

    /**
     * Resets this camera effect.
     * If it was previously running, it stops instantly without calling its onComplete callback or emitting an event.
     */
    reset()
    {
        this.isRunning = false;

        this._onUpdate = null;
        this._onUpdateScope = null;
    }

    /**
     * Destroys this effect, releasing it from the Camera.
     */
    destroy()
    {
        this.reset();

        this.camera = null;
    }
}
