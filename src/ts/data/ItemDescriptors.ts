module Lttp.Data {
    export interface ParticleDescriptor {
        path: string;
        ext: string;
        type: string;
        num: number;
        speed: number;
        loop: boolean;
        spacing: number;
        hitArea: Phaser.Rectangle;
    }

    export interface ItemDescriptor {
        name: string;
        icon: any;
        position: number[];
        grid?: number[];
        cost?: number;
        particle?: ParticleDescriptor;
    }

    export class ItemDescriptors {
        //Special items
        public static sword:        ItemDescriptor = { name: 'sword',        icon: 'items/sword%d.png',        position: [180, 160] };
        public static shield:       ItemDescriptor = { name: 'shield',       icon: 'items/shield%d.png',       position: [200, 160] };
        public static armor:        ItemDescriptor = { name: 'armor',        icon: 'items/armor%d.png',        position: [220, 160] };
        public static boot:         ItemDescriptor = { name: 'boot',         icon: 'items/boot.png',           position: [32, 190] };
        public static gloves:       ItemDescriptor = { name: 'gloves',       icon: 'items/gloves%d.png',       position: [64, 190] };
        public static flippers:     ItemDescriptor = { name: 'flippers',     icon: 'items/flippers.png',       position: [96, 190] };
        public static pearl:        ItemDescriptor = { name: 'pearl',        icon: 'items/pearl.png',          position: [128, 190] };
        public static heart:        ItemDescriptor = { name: 'heart',        icon: 'items/heart%d.png',        position: [200, 190] };
        public static txtLiftNum:   ItemDescriptor = { name: 'txtLiftNum',   icon: 'text/%d.png',              position: [67, 161] };
        public static txtRun:       ItemDescriptor = { name: 'txtRun',       icon: 'text/run.png',             position: [81, 176] };
        public static txtSwim:      ItemDescriptor = { name: 'txtSwim',      icon: 'text/swim.png',            position: [121, 176] };

        //equiptable items
        public static boomerang:    ItemDescriptor = { name: 'boomerang',    icon: 'items/boomerang%d.png',    position: [56, 32],      grid: [1, 0] };
        public static hookshot:     ItemDescriptor = { name: 'hookshot',     icon: 'items/hookshot.png',       position: [80, 32],      grid: [2, 0] };
        public static bombs:        ItemDescriptor = { name: 'bombs',        icon: 'items/bomb.png',           position: [104, 32],     grid: [3, 0] };
        public static mushroom:     ItemDescriptor = { name: 'mushroom',     icon: 'items/mushroom.png',       position: [128, 32],     grid: [4, 0] };
        public static powder:       ItemDescriptor = { name: 'powder',       icon: 'items/magic_powder.png',   position: [128, 32],     grid: [4, 0] };
        public static firerod:      ItemDescriptor = { name: 'firerod',      icon: 'items/firerod.png',        position: [32, 56],      grid: [0, 1] };
        public static icerod:       ItemDescriptor = { name: 'icerod',       icon: 'items/icerod.png',         position: [56, 56],      grid: [1, 1] };
        public static bombos:       ItemDescriptor = { name: 'bombos',       icon: 'items/bombos.png',         position: [80, 56],      grid: [2, 1] };
        public static ether:        ItemDescriptor = { name: 'ether',        icon: 'items/ether.png',          position: [104, 56],     grid: [3, 1] };
        public static quake:        ItemDescriptor = { name: 'quake',        icon: 'items/quake.png',          position: [128, 56],     grid: [4, 1] };
        public static hammer:       ItemDescriptor = { name: 'hammer',       icon: 'items/hammer.png',         position: [56, 80],      grid: [1, 2] };
        public static shovel:       ItemDescriptor = { name: 'shovel',       icon: 'items/shovel.png',         position: [80, 80],      grid: [2, 2] };
        public static flute:        ItemDescriptor = { name: 'flute',        icon: 'items/flute.png',          position: [80, 80],      grid: [2, 2] };
        public static net:          ItemDescriptor = { name: 'net',          icon: 'items/net.png',            position: [104, 80],     grid: [3, 2] };
        public static book:         ItemDescriptor = { name: 'book',         icon: 'items/book_of_mudora.png', position: [128, 80],     grid: [4, 2] };
        public static bottle:       ItemDescriptor = { name: 'bottle',       icon: 'items/bottle_empty.png',   position: [32, 104],     grid: [0, 3] };
        public static somaria:      ItemDescriptor = { name: 'somaria',      icon: 'items/cane_of_somaria.png',position: [56, 104],     grid: [1, 3] };
        public static byrna:        ItemDescriptor = { name: 'byrna',        icon: 'items/cane_of_byrna.png',  position: [80, 104],     grid: [2, 3] };
        public static cape:         ItemDescriptor = { name: 'cape',         icon: 'items/magic_cape.png',     position: [104, 104],    grid: [3, 3] };
        public static mirror:       ItemDescriptor = { name: 'mirror',       icon: 'items/magic_mirror.png',   position: [128, 104],    grid: [4, 3] };

        public static bow: ItemDescriptor = {
            name: 'bow',
            icon: function(link) {
                if(link.inventory.silver_arrows && link.inventory.arrows)
                    return 'items/bow_and_silver_arrow.png';
                else if(link.inventory.arrows)
                    return 'items/bow_and_arrow.png'
                else
                    return 'items/bow.png';
            },
            position: [32, 32],
            grid: [0, 0]
        };

        public static lantern: ItemDescriptor = {
            name: 'lantern',
            icon: 'items/lantern.png',
            position: [32, 80],
            grid: [0, 2],
            cost: 0.5,
            particle: {
                path: 'fire/fire',
                ext: '.png',
                type: 'fire',
                num: 3,
                speed: 0.15,
                loop: false,
                spacing: 2,
                hitArea: new Phaser.Rectangle(0, 8, 8, 8)
            }
        };
    }
}
