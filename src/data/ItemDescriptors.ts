import Game from '../Game';

export type IconCallback = (game: Game) => string;

export interface IParticleDescriptor {
    path: string;
    ext: string;
    type: string;
    num: number;
    framerate: number;
    loop: boolean;
    spacing: number;
    hitArea: Phaser.Rectangle;
}

export interface IItemDescriptor {
    name: string;
    icon: (string | IconCallback);
    position: number[];
    grid?: number[];
    cost?: number;
    particle?: IParticleDescriptor;
}

export default const ItemDescriptors = {
    [key: string]: IItemDescriptor;

    //Special items
    sword:        IItemDescriptor = { name: 'sword',        icon: 'items/sword%d.png',        position: [180, 160] },
    shield:       IItemDescriptor = { name: 'shield',       icon: 'items/shield%d.png',       position: [200, 160] },
    armor:        IItemDescriptor = { name: 'armor',        icon: 'items/armor%d.png',        position: [220, 160] },
    boot:         IItemDescriptor = { name: 'boot',         icon: 'items/boot.png',           position: [32, 190] },
    gloves:       IItemDescriptor = { name: 'gloves',       icon: 'items/gloves%d.png',       position: [64, 190] },
    flippers:     IItemDescriptor = { name: 'flippers',     icon: 'items/flippers.png',       position: [96, 190] },
    pearl:        IItemDescriptor = { name: 'pearl',        icon: 'items/pearl.png',          position: [128, 190] },
    heart:        IItemDescriptor = { name: 'heart',        icon: 'items/heart%d.png',        position: [200, 190] },
    txtLiftNum:   IItemDescriptor = { name: 'txtLiftNum',   icon: 'text/%d.png',              position: [67, 161] },
    txtRun:       IItemDescriptor = { name: 'txtRun',       icon: 'text/run.png',             position: [81, 176] },
    txtSwim:      IItemDescriptor = { name: 'txtSwim',      icon: 'text/swim.png',            position: [121, 176] },

    //equiptable items
    boomerang:    IItemDescriptor = { name: 'boomerang',    icon: 'items/boomerang%d.png',    position: [56, 32],      grid: [1, 0] },
    hookshot:     IItemDescriptor = { name: 'hookshot',     icon: 'items/hookshot.png',       position: [80, 32],      grid: [2, 0] },
    bombs:        IItemDescriptor = { name: 'bombs',        icon: 'items/bomb.png',           position: [104, 32],     grid: [3, 0] },
    mushroom:     IItemDescriptor = { name: 'mushroom',     icon: 'items/mushroom.png',       position: [128, 32],     grid: [4, 0] },
    powder:       IItemDescriptor = { name: 'powder',       icon: 'items/magic_powder.png',   position: [128, 32],     grid: [4, 0] },
    firerod:      IItemDescriptor = { name: 'firerod',      icon: 'items/firerod.png',        position: [32, 56],      grid: [0, 1] },
    icerod:       IItemDescriptor = { name: 'icerod',       icon: 'items/icerod.png',         position: [56, 56],      grid: [1, 1] },
    bombos:       IItemDescriptor = { name: 'bombos',       icon: 'items/bombos.png',         position: [80, 56],      grid: [2, 1] },
    ether:        IItemDescriptor = { name: 'ether',        icon: 'items/ether.png',          position: [104, 56],     grid: [3, 1] },
    quake:        IItemDescriptor = { name: 'quake',        icon: 'items/quake.png',          position: [128, 56],     grid: [4, 1] },
    hammer:       IItemDescriptor = { name: 'hammer',       icon: 'items/hammer.png',         position: [56, 80],      grid: [1, 2] },
    shovel:       IItemDescriptor = { name: 'shovel',       icon: 'items/shovel.png',         position: [80, 80],      grid: [2, 2] },
    flute:        IItemDescriptor = { name: 'flute',        icon: 'items/flute.png',          position: [80, 80],      grid: [2, 2] },
    net:          IItemDescriptor = { name: 'net',          icon: 'items/net.png',            position: [104, 80],     grid: [3, 2] },
    book:         IItemDescriptor = { name: 'book',         icon: 'items/book_of_mudora.png', position: [128, 80],     grid: [4, 2] },
    bottle:       IItemDescriptor = { name: 'bottle',       icon: 'items/bottle_empty.png',   position: [32, 104],     grid: [0, 3] },
    somaria:      IItemDescriptor = { name: 'somaria',      icon: 'items/cane_of_somaria.png',position: [56, 104],     grid: [1, 3] },
    byrna:        IItemDescriptor = { name: 'byrna',        icon: 'items/cane_of_byrna.png',  position: [80, 104],     grid: [2, 3] },
    cape:         IItemDescriptor = { name: 'cape',         icon: 'items/magic_cape.png',     position: [104, 104],    grid: [3, 3] },
    mirror:       IItemDescriptor = { name: 'mirror',       icon: 'items/magic_mirror.png',   position: [128, 104],    grid: [4, 3] },

    bow: IItemDescriptor = {
        name: 'bow',
        icon: function (game) {
            if (game.player.inventory.silver_arrows && game.player.inventory.arrows)
                return 'items/bow_and_silver_arrow.png';
            else if (game.player.inventory.arrows)
                return 'items/bow_and_arrow.png'
            else
                return 'items/bow.png';
        },
        position: [32, 32],
        grid: [0, 0]
    };

    lantern: IItemDescriptor = {
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
            framerate: 9,
            loop: false,
            spacing: 2,
            hitArea: new Phaser.Rectangle(0, 8, 8, 8)
        }
    };
}
