import Entity from './entities/Entity';

const coneVec = new Phaser.Point(0, 0);

export default {
    isInViewCone(viewer: Entity, obj: Entity, coneSize: number) {
        coneVec.set(
            // size offset compensates for anchor (0, 1) that tiled objects have
            (obj.x + (obj.width / 2)) - viewer.x,
            (obj.y - (obj.height / 2)) - viewer.y
        );

        coneVec.normalize();

        // check if 'e' is withing a conic area in the direction we face
        switch (viewer.facing) {
            case Phaser.UP:
                return (coneVec.y < 0 && coneVec.x > -coneSize && coneVec.x < coneSize);
            case Phaser.DOWN:
                return (coneVec.y > 0 && coneVec.x > -coneSize && coneVec.x < coneSize);
            case Phaser.LEFT:
                return (coneVec.x < 0 && coneVec.y > -coneSize && coneVec.y < coneSize);
            case Phaser.RIGHT:
                return (coneVec.x > 0 && coneVec.y > -coneSize && coneVec.y < coneSize);
        }
    },
}
