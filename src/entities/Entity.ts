import { Level } from '../levels/Level';
import { EEntityType, DIRECTION_STRING_MAP, DIRECTION_VECTOR_MAP, DEBUG } from '../data/Constants';

export type TMatterShapeType = 'rectangle'|'circle'|'trapezoid'|'polygon'|'fromVertices'|'fromVerts'|'fromPhysicsEditor';

export interface IMatterShape
{
    type?: TMatterShapeType;
    x?: number;
    y?: number;
    width?: number;
    height?: number;

    // circle:
    radius?: number;
    maxSides?: number;

    // trapezoid
    slope?: number;
}

export interface IMatterOptions
{
    shape: IMatterShape | TMatterShapeType;
}

export class Entity extends Phaser.Physics.Matter.Sprite
{
    // is this sprite able to move?
    locked = false;

    // maximum health of this entity
    maxHealth = 3;

    // current health of this entity
    health = 3;

    // moveSpeed the entity moves at
    moveSpeed = 80;

    // current direction of movement
    movement = new Phaser.Math.Vector2();

    // the amount of damage this entity deals normally
    attackDamage = 1;

    // state of movement of this entity
    moving = [0, 0, 0, 0, 0];

    // the direction the entity is facing
    facing = Phaser.DOWN;

    // a few dirty flags
    moveDirty = false;
    textureDirty = false;

    // type of this entity
    entityType = EEntityType.Neutral;

    properties: any;

    constructor(
        scene: Phaser.Scene,
        texture: string,
        frame?: string | number,
        options = {})
    {
        super(scene.matter.world, 0, 0, texture, frame);

        // TODO: collision groups
        // if (this.body) {
        //     this.body.collides(game.collisionGroups.ground);
        // }
    }

    heal(amount: number): this
    {
        this.health = Phaser.Math.Clamp(this.health + amount, 0, this.maxHealth);

        return this;
    }

    lock(): this
    {
        this.setStatic(true);

        this.locked = true;

        return this;
    }

    unlock(): this
    {
        this.setStatic(false);
        this.setVelocity(this.movement.x, this.movement.y);

        this.locked = false;
        this.textureDirty = true;

        return this;
    }

    setup(): this
    {
        this.scene.physics.add.existing(this, false);

        this.setFixedRotation();

        return this;
    }

    getFacingString(): string
    {
        return DIRECTION_STRING_MAP[this.facing];
    }

    getFacingVector(): Phaser.Math.Vector2
    {
        return DIRECTION_VECTOR_MAP[this.facing];
    }

    evalFacingDirection(): number
    {
        if (this.moving[Phaser.UP])
        {
            this.facing = Phaser.UP;
        }
        else if (this.moving[Phaser.DOWN])
        {
            this.facing = Phaser.DOWN;
        }
        else if (this.moving[Phaser.LEFT])
        {
            this.facing = Phaser.LEFT;
        }
        else if (this.moving[Phaser.RIGHT])
        {
            this.facing = Phaser.RIGHT;
        }

        return this.facing;
    }
}
