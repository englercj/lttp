module Lttp.States {
    export class MainMenu extends Phaser.State {

        sounds: { [index: string]: Phaser.Sound; };

        create() {
            this.sounds = {
                intro: this.add.audio('music_title', Data.Constants.AUDIO_MUSIC_VOLUME),
                sword: this.add.audio('effect_sword1', Data.Constants.AUDIO_EFFECT_VOLUME),
                ding: this.add.audio('effect_menu_select', Data.Constants.AUDIO_EFFECT_VOLUME)
            };
        }

    }
}
