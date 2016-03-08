module Lttp.math {

    var coneVec = new Phaser.Point(0, 0);

    export function isInViewCone(viewer: Entities.Entity, obj: Entities.Entity, coneSize: number) {
        coneVec.set(
            obj.x - viewer.x,
            obj.y - viewer.y
        );

        coneVec.normalize();

        //check if 'e' is withing a conic area in the direction we face
        switch(viewer.facing) {
            case Phaser.UP:
                return (coneVec.y < 0 && coneVec.x > -coneSize && coneVec.x < coneSize);
            case Phaser.DOWN:
                return (coneVec.y > 0 && coneVec.x > -coneSize && coneVec.x < coneSize);
            case Phaser.LEFT:
                return (coneVec.x < 0 && coneVec.y > -coneSize && coneVec.y < coneSize);
            case Phaser.RIGHT:
                return (coneVec.x > 0 && coneVec.y > -coneSize && coneVec.y < coneSize);
        }
    }
}
