import { ITilemap, IRectangleObject, IObjectgroup } from 'gl-tiled';
import { MapOverlay } from '../effects/MapOverlay';
import { keymap } from '../data/Keymap';
import { ASSET_TILEMAP_PACKS_KEY, EFFECT_MAP_TRANSITION_TIME, EFFECT_ZONE_TRANSITION_TIME, COLORS, EFFECT_ZONE_TRANSITION_SPACE, AUDIO_MUSIC_VOLUME } from '../data/Constants';
import { BaseLttpScene } from '../scenes/BaseLttpScene';
import { TiledMap } from '../tiledmap/TiledMap';
import { Save } from '../utility/Save';
import { Player } from '../entities/Player';
import { IAssetPack } from '../utility/IAssetPack';
import { getTiledProperty, getTiledPropertyValue } from '../tiledmap/property_utils';

export interface ILevelSceneData
{
    key: string;
}

export class LevelScene extends BaseLttpScene
{
    static KEY = 'LevelScene';

    // key for the level data
    levelKey: string = '';

    // the reference to the tiled map
    tiledmap: TiledMap = null;

    // layer and zone tracking
    activeZone: IRectangleObject = null;
    oldZone: IRectangleObject = null;

    oldLayer: IObjectgroup = null;
    oldLayerOverlay: Phaser.GameObjects.Container = null;

    activeLayer: IObjectgroup = null;
    activeLayerOverlay: Phaser.GameObjects.Container = null;

    // ambient music
    music: Phaser.Sound.BaseSound = null;

    // misc sprites used for map effects
    overlay: MapOverlay = null;

    // flag whether the zone load
    private _firstZone: boolean = true;

    // the data loaded for this level in its pack
    private _packData: IAssetPack = null;
    private _levelData: ITilemap = null;

    private _cameraBounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);

    constructor()
    {
        super(LevelScene.KEY);
    }

    init(data: ILevelSceneData)
    {
        this.levelKey = data.key;
    }

    preload()
    {
        super.preload();

        // should've been loaded by BootScene
        this._packData = this.cache.json.get(ASSET_TILEMAP_PACKS_KEY);

        this.load.pack({
            key: ASSET_TILEMAP_PACKS_KEY,
            url: this._packData,
            dataKey: this.levelKey,
        });
    }

    create()
    {
        this._levelData = this.cache.json.get(this.levelKey);
        this._firstZone = true;

        this.tiledmap = new TiledMap(this, 0, 0, this._levelData, this._packData[this.levelKey]);

        // TODO: Object layers and collision
        this.tiledmap.createLayer('collisions');
        this.tiledmap.createLayer('exits');
        this.tiledmap.createLayer('zones');

        // setup the player for a new level
        const loadedSave: Save = this.registry.get('loadedSave');
        const player: Player = this.registry.get('player');
        const exit = loadedSave.lastUsedExit;
        const locXProp = getTiledProperty('locX', exit.properties);
        const locYProp = getTiledProperty('locY', exit.properties);
        player.setPosition(
            locXProp && locXProp.type === 'int' ? locXProp.value : 0,
            locYProp && locYProp.type === 'int' ? locYProp.value : 0);

        // Add the player to the right layer on the map
        this.add.existing(player);
        this.tiledmap.getContainer('player').add(player);
        player.setup(this);

        // Create the map overlay
        this.overlay = new MapOverlay(this);
        this.add.existing(this.overlay);

        // setup camera to follow the player
        this.cameras.main.startFollow(player);

        // setup handlers for system events
        this.physics.world.on(Phaser.Physics.Matter.Events.COLLISION_START, this.onCollisionStart, this);
        this.physics.world.on(Phaser.Physics.Matter.Events.COLLISION_END, this.onCollisionEnd, this);

        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._handleKeyboard, this);
        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, this._handleKeyboard, this);
        this.input.gamepad.on(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._handleGamepadButton, this);

        this.events.once('shutdown', this.shutdown, this);
    }

    shutdown()
    {
        // lose reference to player in camera
        this.cameras.main.stopFollow();

        const player: Player = this.registry.get('player');
        player.removeAllListeners('readSign');
        player.removeAllListeners('inventoryChange');

        // remove the listeners for system events
        this.physics.world.off(Phaser.Physics.Matter.Events.COLLISION_START, this.onCollisionStart, this);
        this.physics.world.off(Phaser.Physics.Matter.Events.COLLISION_END, this.onCollisionEnd, this);

        this.input.keyboard.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this._handleKeyboard, this);
        this.input.gamepad.off(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this._handleGamepadButton, this);
    }

    onCollisionStart(event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: MatterJS.Body, bodyB: MatterJS.Body)
    {
        this._checkContact(true, event, bodyA, bodyB);
    }

    onCollisionEnd(event: Phaser.Physics.Matter.Events.CollisionEndEvent, bodyA: MatterJS.Body, bodyB: MatterJS.Body)
    {
        this._checkContact(false, event, bodyA, bodyB);
    }

    private _handleGamepadAxis(index: number, value: number, active: boolean)
    {
        // TODO: stick handling
        // switch(index) {
        //     // AXIS UP/DOWN
        //     case Phaser.Input.Gamepad.Configs.XBOX_360.STICK_LEFT_Y:
        //         player.lookUp(value > 0 ? active : false);
        //         player.duck(value < 0 ? active : false);
        //         GarageServerIO.addInput({ name: 'lookUp', active: value > 0 ? active : false, value: value });
        //         GarageServerIO.addInput({ name: 'duck', active: value < 0 ? active : false, value: value });
        //         break;

        //     // AXIS LEFT/RIGHT
        //     case Phaser.Input.Gamepad.Configs.XBOX_360.STICK_LEFT_X:
        //         player.move(Phaser.RIGHT, value, value > 0 ? active : false);
        //         player.move(Phaser.LEFT, -value, value < 0 ? active : false);
        //         GarageServerIO.addInput({ name: 'forward', active: value > 0 ? active : false, value: value });
        //         GarageServerIO.addInput({ name: 'backward', active: value < 0 ? active : false, value: -value });
        //         break;
        // }
    }

    private _handleKeyboard(event: KeyboardEvent)
    {
        // TODO: Does this get hit when paused?

        const key = event.keyCode;
        const active = event.type === 'keydown';

        const player: Player = this.registry.get('player');

        switch (key)
        {
            case keymap.keyboard.use:
                player.use(active);
                break;

            case keymap.keyboard.useItem:
                player.useItem(active);
                break;

            case keymap.keyboard.attack:
                player.attack(active);
                break;

            case keymap.keyboard.up:
                player.move(Phaser.UP, 1, active);
                break;

            case keymap.keyboard.down:
                player.move(Phaser.DOWN, 1, active);
                break;

            case keymap.keyboard.left:
                player.move(Phaser.LEFT, 1, active);
                break;

            case keymap.keyboard.right:
                player.move(Phaser.RIGHT, 1, active);
                break;
        }
    }

    private _handleGamepadButton(index: number, value: number, active: boolean)
    {
        const player: Player = this.registry.get('player');

        switch (index)
        {
            case keymap.gamepad.up:
                player.move(Phaser.UP, value, active);
                break;

            case keymap.gamepad.down:
                player.move(Phaser.DOWN, value, active);
                break;

            case keymap.gamepad.left:
                player.move(Phaser.LEFT, value, active);
                break;

            case keymap.gamepad.right:
                player.move(Phaser.RIGHT, value, active);
                break;
        }
    }

    private _checkContact(begin: boolean, event: Phaser.Physics.Matter.Events.CollisionStartEvent | Phaser.Physics.Matter.Events.CollisionEndEvent, bodyA: MatterJS.Body, bodyB: MatterJS.Body)
    {
        if (!bodyA.gameObject || !bodyB.gameObject)
            return;

        const player = this.registry.get('player');

        if (bodyA.gameObject !== player && bodyB.gameObject !== player)
            return;

        const playerIsA = bodyA.gameObject === player;
        const playerBody = playerIsA ? bodyA : bodyB;
        const objBody = playerIsA ? bodyB : bodyA;

        // Note: the tiledObject property is added by gl-tiled
        const obj = objBody.gameObject || (objBody as any).tiledObject;

        if (!obj)
            return;

        if (begin)
        {
            const normal = new Phaser.Math.Vector2(event.pairs[0].collision.normal);

            // colliding with a new zone
            if (obj.type === 'zone')
            {
                return this._zone(obj, normal);
            }
            // collide with an exit
            else if (obj.type === 'exit')
            {
                return this._exit(obj, normal);
            }
        }

        if (begin)
        {
            player.onBeginContact(obj, objBody, playerBody);
        }
        else
        {
            player.onEndContact(obj, objBody, playerBody);
        }
    }

    private _exit(exit: IRectangleObject, vec: Phaser.Math.Vector2)
    {
        const animation = getTiledPropertyValue('animation', exit.properties);

        if (!animation)
        {
            this._mapTransition(exit, vec);
        }
        else
        {
            const player: Player = this.registry.get('player');
            player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
            {
                this._mapTransition(exit, vec);
                player.unlock();
            });

            player.lock();
            player.anims.play(animation.toString());

            return;
        }
    }

    private _mapTransition(exit: IRectangleObject, vec: Phaser.Math.Vector2)
    {
        const transition = getTiledPropertyValue('transition', exit.properties);

        switch (transition)
        {
            case 'none':
                this._gotoLevel(exit, vec);
                break;

            case 'close':
                // make this work again...
                // this.camera.close('ellipse', animTime, this.link.position, function() {
                //     self._dogotoMap(exit, vec);
                // });
                /* falls through, for now */

            case 'fade':
                /* falls through */
            default:
                this.cameras.main.fade(EFFECT_MAP_TRANSITION_TIME, 0, 0, 0, false, () =>
                {
                    this._gotoLevel(exit, vec);
                });
                break;
        }
    }

    private _gotoLevel(exit: IRectangleObject, vec: Phaser.Math.Vector2)
    {
        const loadedSave: Save = this.registry.get('loadedSave');
        if (loadedSave)
        {
            loadedSave.lastUsedExit = exit;
            loadedSave.save(this.registry.get('player'));
        }

        this.scene.restart({ key: `level_${exit.name}` });
    }

    private _zone(zone: IRectangleObject, vec: Phaser.Math.Vector2)
    {
        if (zone === this.activeZone)
            return;

        // save old actives
        this.oldZone = this.activeZone;
        this.oldLayer = this.activeLayer;
        this.oldLayerOverlay = this.activeLayerOverlay;

        // assign new actives
        this.activeZone = zone;
        this.activeLayer = this.tiledmap.getObjectgroup(zone.name);
        this.activeLayerOverlay = this.tiledmap.getContainer(zone.name + '_overlay');

        // spawn layer objects
        this.tiledmap.createLayer(zone.name);

        this._setupOverlay();

        this._setupZone(vec);
    }

    private _setupOverlay()
    {
        this.overlay.deactivate();

        if (this.oldLayerOverlay)
            this.tiledmap.destroyLayer(this.oldLayerOverlay.name);

        // show overlay for layer or map
        if (this.activeLayerOverlay)
        {
            this.tiledmap.createLayer(this.activeLayerOverlay.name);
        }
        else
        {
            const overlayProp = getTiledProperty('overlay', this.tiledmap.desc.properties);

            if (overlayProp && overlayProp.type === 'string')
                this.overlay.activate(overlayProp.value);
        }
    }

    private _setupZone(vec: Phaser.Math.Vector2)
    {
        this.cameras.main.stopFollow();
        this.cameras.main.removeBounds();

        if (!this._firstZone)
            this._zoneTransition(vec);
        else
            this._zoneReady();
    }

    private _zoneTransition(vec: Phaser.Math.Vector2)
    {
        const vel = vec.x ? vec.x : vec.y;
        const cameraEnd = new Phaser.Math.Vector2();
        const player = this.registry.get('player');

        player.lock();

        const transition = getTiledPropertyValue('transition', this.activeZone.properties);

        switch (transition)
        {
            case 'fade':
                this.cameras.main.fade(EFFECT_ZONE_TRANSITION_TIME, COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2], false, () =>
                {
                    // pan camera
                    this.cameras.main.x += this.cameras.main.width * vec.x;
                    this.cameras.main.y += this.cameras.main.height * vec.y;

                    this._transitionPlayer(!!vec.x, vel);

                    // zone ready
                    this._zoneReady();
                });
                break;

            case 'none':
                // pan camera
                this.cameras.main.x += this.cameras.main.width * vec.x;
                this.cameras.main.y += this.cameras.main.height * vec.y;

                this._transitionPlayer(!!vec.x, vel);

                // zone ready
                this._zoneReady();
                break;

            case 'slide':
                /* falls through */
            default:
                if (vec.x)
                    cameraEnd.x = this.cameras.main.x + this.cameras.main.width * vel;
                else
                    cameraEnd.y = this.cameras.main.y + this.cameras.main.height * vel;

                this.tweens.add({
                    targets: this.cameras.main,
                    duration: EFFECT_ZONE_TRANSITION_TIME,
                    x: cameraEnd.x,
                    y: cameraEnd.y,
                    onComplete: () => this._zoneReady(),
                });

                this._transitionPlayer(!!vec.x, vel, true);
                break;
        }
    }

    private _transitionPlayer(horizontal: boolean, vector: number, ease: boolean = true)
    {
        const player = this.registry.get('player');

        if (ease)
        {
            const playerEnd = new Phaser.Math.Vector2(player.body.x, player.body.y);

            playerEnd[horizontal ? 'x' : 'y'] += EFFECT_ZONE_TRANSITION_SPACE * vector;

            this.tweens.add({
                targets: player.body,
                x: playerEnd.x,
                y: playerEnd.y,
            });
        }
        else
        {
            if (horizontal)
                player.body.x += EFFECT_ZONE_TRANSITION_SPACE * vector;
            else
                player.body.y += EFFECT_ZONE_TRANSITION_SPACE * vector;
        }
    }

    private _zoneReady()
    {
        if (this.oldLayer)
        {
            const loadedSave: Save = this.registry.get('loadedSave');
            if (loadedSave)
            {
                loadedSave.updateZoneData(this.levelKey, this.oldLayer);
                loadedSave.save();
            }

            this.tiledmap.destroyLayer(this.oldLayer.name);
        }

        const zone = this.activeZone;

        this._firstZone = false;

        this._cameraBounds.setTo(zone.x, zone.y, zone.width, zone.height);
        this.cameras.main.setBounds(zone.x, zone.y, zone.width, zone.height);

        const player = this.registry.get('player');
        this.cameras.main.startFollow(player);

        // play zone music, or the map music if there is no zone music
        const musicProp = getTiledProperty('music', zone.properties) || getTiledProperty('music', this.tiledmap.desc.properties);
        this._setupMusic(musicProp && musicProp.type === 'string' ? musicProp.value : '');

        player.unlock();
    }

    private _setupMusic(key?: string)
    {
        // no key or already playing
        if (!key || (this.music && this.music.key === key))
            return;

        // destroy current music object
        if (this.music)
            this.music.destroy();

        this.music = this.sound.add(key, { volume: AUDIO_MUSIC_VOLUME, loop: true });
        this.music.play();
    }
}
