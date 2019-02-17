import { GuiItem } from './GuiItem';

export class LifeMeter extends GuiItem<number>
{
    max: number;

    dash1: Phaser.GameObjects.Sprite;
    dash2: Phaser.GameObjects.Sprite;
    life: Phaser.GameObjects.Sprite;

    hearts: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene, x: number, y: number, value: number = 0)
    {
        super(scene, x, y, 'life', value);

        this.dash1 = scene.add.sprite(18, 0, 'sprite_gui', 'hud/life-dash.png');
        this.dash2 = scene.add.sprite(56, 0, 'sprite_gui', 'hud/life-dash.png');
        this.life = scene.add.sprite(36, -2, 'sprite_gui', 'text/life.png');

        this.add([
            this.dash1,
            this.dash2,
            this.life,
        ]);

        this.hearts = scene.add.group({
            defaultKey: 'sprite_gui',
        });

        this.setValue(value);
    }

    setValue(val: number)
    {
        super.setValue(val);

        const childs = this.hearts.getChildren();
        for (let i = 0; i < childs.length; ++i)
        {
            this.hearts.killAndHide(childs[i]);
        }

        let x = 0;
        let y = 7;
        const size = 8;
        const perRow = 10;
        let done = 0;

        for (let hp = val; hp > 0; --hp)
        {
            let off = 0;
            let frame: string = '';

            // handle partial heart
            if (hp < 1)
            {
                frame = 'hud/heart-half.png';
                off = 2;
            }
            else
            {
                frame = 'hud/heart-full.png';
            }

            this.enableHeartSprite(done, frame, x, y + off);

            if ((x / size) >= (perRow - 1))
            {
                x = 0;
                y += size;
            }
            else
            {
                x += size;
            }

            done++;
        }

        for (done; done < this.max; ++done)
        {
            this.enableHeartSprite(done, 'hud/heart-empty.png', x, y);

            if ((x / size) >= (perRow - 1))
            {
                x = 0;
                y += size;
            }
            else
            {
                x += size;
            }
        }

        return this;
    }

    enableHeartSprite(idx: number, frame: string, x: number, y: number): Phaser.GameObjects.Sprite
    {
        const sprite: Phaser.GameObjects.Sprite = this.hearts.get(x, y);

        this.add(sprite);

        sprite.setFrame(frame);
        sprite.visible = true;

        return sprite;
    }
}
