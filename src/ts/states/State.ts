module Lttp.States {
    export interface GamepadAxisState {
        axis: number; //the axis index
        value: number; //the value of the axis
    }

    export class State extends Phaser.State {

        onInputDown: Phaser.Signal;
        onInputUp: Phaser.Signal;

        constructor() {
            super();

            // create signals
            this.onInputDown = new Phaser.Signal();
            this.onInputUp = new Phaser.Signal();
        }

        create() {
            // add callbacks for keyboard/gamepad data
            this.input.keyboard.addCallbacks(this, this.onKeyboardDown, this.onKeyboardUp);
            this.input.gamepad.addCallbacks(this, {
                onDown: this.onGamepadDown,
                onUp: this.onGamepadUp,
                onAxis: this.onGamepadAxis
            });

            // start the static game timer
            Game.timer = this.time.create(false);
            Game.timer.start();
        }

        shutdown() {
            this.onInputDown.removeAll();
            this.onInputUp.removeAll();
            this.sound.stopAll();
        }

        onKeyboardDown(event) {
            this.onInputDown.dispatch(event.keyCode, 1, event);
        }

        onKeyboardUp(event) {
            this.onInputUp.dispatch(event.keyCode, 1, event);
        }

        onGamepadDown(button: number, value: number, padIndex: number) {
            this.onInputDown.dispatch(button, value, event);
        }

        onGamepadUp(button: number, value: number, padIndex: number) {
            this.onInputUp.dispatch(button, value, event);
        }

        onGamepadAxis(axisState: GamepadAxisState, padIndex: number) {
            // if we pass the threshold send a "down" signal
            if (axisState.value > Data.Constants.INPUT_GAMEPAD_AXIS_THRESHOLD ||
                axisState.value < -Data.Constants.INPUT_GAMEPAD_AXIS_THRESHOLD
            ) {
                this.onInputDown.dispatch(axisState.axis, axisState.value, null);
            }
            // otherwise send an "up" signal
            else {
                this.onInputUp.dispatch(axisState.axis, axisState.value, null);
            }
        }

        addTilemap(key: string, scale: number = 1, group?: Phaser.Group) {
            var levelData: TiledMapData = <TiledMapData>(this.cache.getTilemapData('tilemap_' + key).data),
                level: Phaser.Tilemap = this.add.tilemap('tilemap_' + key, levelData.tilewidth, levelData.tileheight, levelData.width, levelData.height),
                layer: Phaser.TilemapLayer = null,
                tilesetData = null,
                layerData = null,
                i = 0, il = 0;

            // add each fo the tileset images
            for (i = 0, il = levelData.tilesets.length; i < il; ++i) {
                tilesetData = levelData.tilesets[i];

                level.addTilesetImage(tilesetData.name, tilesetData.name, tilesetData.tilewidth, tilesetData.tileheight, tilesetData.margin, tilesetData.spacing, tilesetData.firstgid);
            }

            // create each of the level's tilemap layers
            for (i = 0, il = levelData.layers.length; i < il; ++i) {
                layerData = levelData.layers[i];

                if (layerData.type !== 'tilelayer') {
                    continue;
                }

                layer = level.createLayer(
                    layerData.name,
                    Phaser.Math.clamp(layerData.width * levelData.tilewidth * (1 / scale), 0, Data.Constants.GAME_WIDTH * Data.Constants.GAME_SCALE),
                    Phaser.Math.clamp(layerData.height * levelData.tileheight * (1 / scale), 0, Data.Constants.GAME_WIDTH * Data.Constants.GAME_SCALE),
                    group
                );
                layer.visible = layerData.visible;
                layer.alpha = layerData.opacity;
                layer.position.set(layerData.x, layerData.y);
                layer.scale.set(scale);
                layer.resizeWorld();
            }

            return level;
        }

    }

    class TiledMapData {
        width: number;
        height: number;

        tilewidth: number;
        tileheight: number;

        version: number;

        orientation: string; //TODO: make enum

        layers: TiledLayerData[];
        tilesets: TiledTilesetData[];

        properties: { [key: string]: string }
    }

    class TiledLayerData {
        data: number[];

        width: number;
        height: number;

        x: number;
        y: number;

        name: string;

        type: string; //TODO: make enum

        opacity: number;
        visible: boolean;

        properties: { [key: string]: string }
    }

    class TiledTilesetData {
        firstgid: number;

        name: string;

        image: string;
        imagewidth: number;
        imageheight: number;

        margin: number;
        spacing: number;

        tilewidth: number;
        tileheight: number;

        properties: { [key: string]: string }
    }
}
