import { GLTilemap, IAssetCache, ITilemap, IObjectgroup, IPolygonObject, IPolylineObject, ITileObject, IEllipseObject, IPointObject, IRectangleObject, ITextObject, GLTileset, IProperty, IObjectBase, ILayer } from 'gl-tiled';
import { IAssetData } from '../utility/IAssetPack';
import { IDictionary } from '../utility/IDictionary';
import { getTiledProperty, getTiledPropertyValue } from './property_utils';

export class TiledMap extends Phaser.GameObjects.GameObject
    implements
    Phaser.GameObjects.Components.Alpha,
    Phaser.GameObjects.Components.Size,
    Phaser.GameObjects.Components.Transform,
    Phaser.GameObjects.Components.Visible
{
    fullscreen = true;

    private readonly containers: IDictionary<Phaser.GameObjects.Container> = {};
    private readonly bodies: IDictionary<MatterJS.Body[]> = {};

    private _assetData: IAssetData[];
    private _tilemap: GLTilemap;
    private _lastSize = new Phaser.Math.Vector2(-1, -1);
    private _lastAlpha = -1;

    constructor(scene: Phaser.Scene, x: number, y: number, mapData: ITilemap, assetData: IAssetData[])
    {
        super(scene, 'TiledMap');

        const assets = assetData.reduce<IAssetCache>((prev, curr) =>
        {
            const sourceImg = this.scene.textures.get(curr.key).getSourceImage();

            if (!(sourceImg instanceof Phaser.GameObjects.RenderTexture))
            {
                prev[curr.originalUrl] = sourceImg;
            }

            return prev;
        }, {});

        this._assetData = assetData;
        this._tilemap = new GLTilemap(mapData, { assetCache: assets });

        this._createObjectContainers(mapData.layers);

        scene.events.on(Phaser.Scenes.Events.UPDATE, this.onUpdate, this);

        this.setPosition(x, y);
    }

    get desc() { return this._tilemap.desc; }

    getContainer(...name: string[]): Phaser.GameObjects.Container
    {
        const key = name.join('/');
        return this.containers[key];
    }

    getBodies(...name: string[]): MatterJS.Body[]
    {
        const key = name.join('/');
        return this.bodies[key] || [];
    }

    getObjectgroup(...name: string[]): IObjectgroup | null
    {
        const group = this._tilemap.findLayerDesc(...name);

        if (group && group.type === 'objectgroup')
            return group;

        return null;
    }

    createLayer(...name: string[]): boolean
    {
        const layerDesc = this._tilemap.findLayerDesc(...name);

        if (!layerDesc)
            return false;

        if (layerDesc.type === 'objectgroup')
        {
            this._createObjectgroup(name, layerDesc);
        }
        else
        {
            this._tilemap.createLayerFromDesc(layerDesc);
        }

        return true;
    }

    destroyLayer(...name: string[]): boolean
    {
        const layerDesc = this._tilemap.findLayerDesc(...name);

        if (!layerDesc)
            return false;

        if (layerDesc.type === 'objectgroup')
        {
            this._destroyObjectgroup(name);
        }
        else
        {
            this._tilemap.destroyLayerFromDesc(layerDesc);
        }

        return true;
    }

    destroy(fromScene?: boolean)
    {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.onUpdate, this);
        super.destroy(fromScene);
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

        // Reinitialize if we get a new context.
        if (src._tilemap.gl !== renderer.gl)
        {
            src._tilemap.glInitialize(renderer.gl);
        }

        // resize to fit specified viewport.
        if (src.fullscreen)
        {
            if (src._lastSize.x !== camera.width || src._lastSize.y !== camera.height)
            {
                src._tilemap.resizeViewport(camera.width, camera.height);
                src._lastSize.x = camera.width;
                src._lastSize.y = camera.height;
            }
        }
        else
        {
            if (src._lastSize.x !== this.displayWidth || src._lastSize.y !== this.displayHeight)
            {
                src._tilemap.resizeViewport(this.displayWidth, this.displayHeight);
                src._lastSize.x = this.displayWidth;
                src._lastSize.y = this.displayHeight;
            }
        }

        // Set alpha if it has changed
        if (this._lastAlpha !== this.alpha)
        {
            for (let i = 0; i < this._tilemap.layers.length; ++i)
            {
                this._tilemap.layers[i].alpha = this.alpha;
            }

            this._lastAlpha = this.alpha;
        }

        // Draw at our position
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

    private _createObjectContainers(layers: ILayer[], parent?: Phaser.GameObjects.Container)
    {
        for (let i = 0; i < layers.length; ++i)
        {
            const layer = layers[i];

            if (layer.type === 'group' || layer.type === 'objectgroup')
            {
                const name = (parent ? `${parent.name}/` : '') + layer.name;
                const container = this.scene.add.container(layer.x, layer.y);

                container.name = name;

                this.containers[name] = container;

                if (parent)
                    parent.add(container);

                if (layer.type === 'group')
                {
                    this._createObjectContainers(layer.layers, container);
                }
            }
        }
    }

    private _destroyObjectgroup(name: string[]): void
    {
        const key = name.join('/');

        const container = this.containers[key];

        if (container)
            container.removeAll(true);

        const bodies = this.bodies[key];

        if (bodies)
        {
            for (let i = 0; i < bodies.length; ++i)
            {
                this.scene.matter.world.remove(bodies[i], true);
            }

            bodies.length = 0;
        }
    }

    private _createObjectgroup(name: string[], layerDesc: IObjectgroup): void
    {
        const key = name.join('/');

        if (!this.bodies[key])
            this.bodies[key] = [];

        const container = this.containers[key];
        const bodies = this.bodies[key];

        for (let i = 0; i < layerDesc.objects.length; ++i)
        {
            const object = layerDesc.objects[i];

            if ((object as any).gid)
            {
                container.add(this._createTileObject(object as ITileObject));
            }
            else if ((object as any).text)
            {
                container.add(this._createTextObject(object as ITextObject));
            }
            else
            {
                if ((object as any).ellipse)
                {
                    bodies.push(this._createEllipseObject(object as IEllipseObject));
                }
                else if ((object as any).point)
                {
                    bodies.push(this._createPointObject(object as IPointObject));
                }
                else if ((object as any).polygon)
                {
                    bodies.push(this._createPolygonObject(object as IPolygonObject));
                }
                else if ((object as any).polyline)
                {
                    bodies.push(this._createPolylineObject(object as IPolylineObject));
                }
                else
                {
                    bodies.push(this._createRectangleObject(object as IRectangleObject));
                }

                (bodies[bodies.length - 1] as any).tiledObject = object;
            }
        }
    }

    private _getTextureKey(tileset: GLTileset, imgIndex: number): string
    {
        for (let i = 0; i < this._assetData.length; ++i)
        {
            const data = this._assetData[i];

            if (data.subtype === 'tileset' && data.name === tileset.desc.name)
            {
                if (imgIndex !== 0)
                    throw new Error('Multi-image tilesets not supported yet.');

                return data.key;
            }
        }

        return '';
    }

    private _getMatterOptions(object: IObjectBase): any
    {
        const isSensor = getTiledPropertyValue('sensor', object.properties);
        const isStatic = getTiledPropertyValue('static', object.properties);

        return { isSensor, isStatic };
    }

    private _createTileObject(object: ITileObject): Phaser.GameObjects.Image
    {
        for (let i = 0; i < this._tilemap.tilesets.length; ++i)
        {
            const tileset = this._tilemap.tilesets[i];
            const tileprops = tileset.getTileProperties(object.gid);

            if (tileprops)
            {
                const txKey = this._getTextureKey(tileset, tileprops.imgIndex);
                const frameKey = `tile_object_${object.gid}`;
                const tx = this.scene.textures.get(txKey);
                const frames: any = tx.frames; // bad TS def

                if (!frames[frameKey])
                {
                    frames[frameKey] = new Phaser.Textures.Frame(
                        tx,
                        frameKey,
                        0,
                        tileprops.coords.x,
                        tileprops.coords.y,
                        tileset.desc.tilewidth,
                        tileset.desc.tileheight);
                }

                const collides = getTiledPropertyValue('collides', object.properties);

                if (collides)
                {
                    return this.scene.matter.add.image(
                        object.x,
                        object.y,
                        txKey,
                        frameKey,
                        this._getMatterOptions(object));
                }

                return this.scene.add.image(
                    object.x,
                    object.y,
                    txKey,
                    frameKey);
            }
        }
    }

    private _createEllipseObject(object: IEllipseObject): MatterJS.Body
    {
        if (object.width === object.height)
        {
            return this.scene.matter.add.circle(
                object.x,
                object.y,
                object.width,
                this._getMatterOptions(object),
                undefined);
        }
        else
        {
            // TODO: Ellipse objects.
            return this.scene.matter.add.circle(
                object.x,
                object.y,
                object.width,
                this._getMatterOptions(object),
                undefined);
        }
    }

    private _createPointObject(object: IPointObject): MatterJS.Body
    {
        // TODO: Point objects
        return this.scene.matter.add.circle(
            object.x,
            object.y,
            1,
            this._getMatterOptions(object),
            undefined);
    }

    private _createPolygonObject(object: IPolygonObject): MatterJS.Body
    {
        return this.scene.matter.add.fromVertices(
            object.x,
            object.y,
            object.polygon,
            this._getMatterOptions(object),
            undefined,
            undefined,
            undefined);
    }

    private _createPolylineObject(object: IPolylineObject): MatterJS.Body
    {
        return this.scene.matter.add.fromVertices(
            object.x,
            object.y,
            object.polyline,
            this._getMatterOptions(object),
            undefined,
            undefined,
            undefined);
    }

    private _createTextObject(object: ITextObject): Phaser.GameObjects.Text
    {
        const text = this.scene.add.text(
            object.x,
            object.y,
            object.text.text);

        text.setFontSize(object.text.pixelsize || 16);
        text.setFontFamily(object.text.fontfamily || 'sans-serif');
        text.setFontStyle(
            (object.text.bold ? 'bold ' : '')
            + (object.text.italic ? 'italic ' : ''));
        text.setColor(object.text.color || '#000000');
        text.setWordWrapWidth(object.width);
        text.updateText();

        return text;
    }

    private _createRectangleObject(object: IRectangleObject): MatterJS.Body
    {
        return this.scene.matter.add.rectangle(
            object.x,
            object.y,
            object.width,
            object.height,
            this._getMatterOptions(object));
    }

    // Alpha interface
    clearAlpha: () => this;
    setAlpha: (topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number) => this;
    alpha: number;
    alphaTopLeft: number;
    alphaTopRight: number;
    alphaBottomLeft: number;
    alphaBottomRight: number;

    // Size interface
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
    setSizeToFrame: (frame: Phaser.Textures.Frame) => this;
    setSize: (width: number, height: number) => this;
    setDisplaySize: (width: number, height: number) => this;

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

Phaser.Class.mixin(TiledMap, [
    (Phaser.GameObjects.Components as any).Alpha,
    (Phaser.GameObjects.Components as any).Size,
    (Phaser.GameObjects.Components as any).Transform,
    (Phaser.GameObjects.Components as any).Visible,
]);
