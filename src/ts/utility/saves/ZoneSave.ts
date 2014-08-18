module Lttp.Utility {
    export class ZoneSave extends Save {

        constructor(public slot: number, public zone: Zone, public map: string) {
            super('zone_' + slot + '_' + map + '_' + zone.name);

            //go through each object in the zone and copy the 'loot' property
            this.data.objects = [];

            for(var i = 0, il = zone.objects.length; i < il; ++i) {
                this.data.objects.push({
                    properties: {
                        loot: zone.objects[i].properties.loot
                    }
                });
            }

            this.zone = zone;
        }

        // load() {
        //     //loop through each object (in both 'objects' and 'children') and set loaded values
        //     var objs = super.load(),
        //         zone = this.zone;

        //     if (objs) {
        //         for(var i = 0; i < objs.objects.length; ++i) {
        //             var objZone = zone.objects[i],
        //                 objLoad = objs.objects[i],
        //                 objType = objZone.properties.type || objZone.properties.tileprops.type,
        //                 ci = zone.objects.length - 1 - i,
        //                 child = zone.children[ci];

        //             if(objZone) {
        //                 objZone.properties.loot = objLoad.properties.loot;
        //                 child.properties.loot = objLoad.properties.loot;

        //                 if(!objZone.properties.loot && objType === 'chest') {
        //                     child.setTexture(lttp.game.cache.getTextures('sprite_worlditems')['dungeon/chest_open.png']);
        //                 }
        //             } else {
        //                 console.warn('Mismatch on objects array length! Delete key: ' + this.key);
        //             }
        //         }
        //     }

        //     return objs;
        // }

    }
}
