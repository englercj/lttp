import * as Class from 'phaser/src/utils/Class';
import { GLTilemap, ITilemap } from 'gl-tiled';

export class TiledMap extends Phaser.GameObjects.GameObject
    implements
    Phaser.GameObjects.Components.Alpha,
    Phaser.GameObjects.Components.Transform,
    Phaser.GameObjects.Components.Visible
{
    private _tilemap: GLTilemap;
    private _mapData: ITilemap;
    private _lastSize: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene, x: number, y: number, mapData: ITilemap)
    {
        super(scene, 'TiledMap');

        this._tilemap = null;
        this._mapData = mapData;
        this._lastSize = new Phaser.Math.Vector2(0, 0);

        scene.sys.events.on('update', this.onUpdate, this);

        this.setPosition(x, y);
    }

    renderWebGL(
        renderer: Phaser.Renderer.WebGL.WebGLRenderer,
        src: TiledMap,
        interpolationPercentage: number,
        camera: Phaser.Cameras.Scene2D.Camera,
        parentMatrix: Phaser.GameObjects.Components.TransformMatrix)
    {
        if (!src.visible)
            return;

        if (!src._tilemap)
        {
            src._tilemap = new GLTilemap(renderer.gl, src._mapData);
        }

        if (src._lastSize.x !== camera.width || src._lastSize.y !== camera.height)
        {
            src._tilemap.resizeViewport(camera.width, camera.height);
            src._lastSize.x = camera.width;
            src._lastSize.y = camera.height;
        }

        for (let i = 0; i < this._tilemap.layers.length; ++i)
        {
            this._tilemap.layers[i].alpha = this.alpha;
        }

        this._tilemap.tileScale = this.scaleX;
        this._tilemap.draw(this.x, this.y);
    }

    /**
     *
     * @param {number} time - The time value from the most recent Game step. Typically a high-resolution timer value, or Date.now().
     * @param {number} delta - The delta value since the last frame. This is smoothed to avoid delta spikes by the TimeStep class.
     */
    onUpdate(time: number, delta: number)
    {
        if (!this.visible)
            return;

        if (this._tilemap)
        {
            this._tilemap.update(delta);
        }
    }

    // Alpha interface
    clearAlpha: () => this;
    setAlpha: (topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number) => this;
    alpha: number;
    alphaTopLeft: number;
    alphaTopRight: number;
    alphaBottomLeft: number;
    alphaBottomRight: number;

    // Pipeline interface
    defaultPipeline: Phaser.Renderer.WebGL.WebGLPipeline;
    pipeline: Phaser.Renderer.WebGL.WebGLPipeline;
    initPipeline: (pipelineName?: string) => boolean;
    setPipeline: (pipelineName: string) => this;
    resetPipeline: () => boolean;
    getPipelineName: () => string;

    // Transform interface
    x: number;
    y: number;
    z: number;
    w: number;
    scaleX: number;
    scaleY: number;
    angle: integer;
    rotation: number;
    setPosition: (x?: number, y?: number, z?: number, w?: number) => this;
    setRandomPosition: (x?: number, y?: number, width?: number, height?: number) => this;
    setRotation: (radians?: number) => this;
    setAngle: (degrees?: number) => this;
    setScale: (x: number, y?: number) => this;
    setX: (value?: number) => this;
    setY: (value?: number) => this;
    setZ: (value?: number) => this;
    setW: (value?: number) => this;
    getLocalTransformMatrix: (tempMatrix?: Phaser.GameObjects.Components.TransformMatrix) => Phaser.GameObjects.Components.TransformMatrix;
    getWorldTransformMatrix: (tempMatrix?: Phaser.GameObjects.Components.TransformMatrix, parentMatrix?: Phaser.GameObjects.Components.TransformMatrix) => Phaser.GameObjects.Components.TransformMatrix;

    // Visible interface
    visible: boolean;
    setVisible: (value: boolean) => this;
}

Class.mixin(TiledMap, [
    (Phaser.GameObjects.Components as any).Alpha,
    (Phaser.GameObjects.Components as any).Transform,
    (Phaser.GameObjects.Components as any).Visible,
]);
