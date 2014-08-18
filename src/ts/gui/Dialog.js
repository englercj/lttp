define([
    'vendor/gf',
    'game/data/constants',
    'game/fonts/ReturnOfGanon'
], function(gf, C, ReturnOfGanonFont) {
    var Dialog = function() {
        gf.Container.call(this);

        var audioSettings = { volume: C.MUSIC_VOLUME };
        this.sounds = {
            open: lttp.play.audio.add('effect_pause_close', audioSettings),
        };

        this.scale.x = this.scale.y = C.SCALE;
        this.position.x = 102;
        this.position.y = 438;
        this.visible = false;

        this.text = '';
        this.range = [0, 1]; //start pos, length

        this.fastSpeed = 15;
        this.typeSpeed = 60;
        this.speed = this.typeSpeed;

        this.speedCooldown = 250;

        this.firstOpen = true;

        this.padding = 5;

        this._setup();
    };

    gf.inherit(Dialog, gf.Container, {
        setText: function(text) {
            this.text = text;

            //insert a space with a newline every 30 characters
            var i = 30;
            while(this.text[i]) {
                var sp = this._getPreviousSpace(this.text, i);
                this.text = [this.text.slice(0, sp), '\n', this.text.slice(sp + 1)].join('');
                i += 30;
            }

            this.font.text = '';
        },
        _getPreviousSpace: function(str, i) {
            var found = false,
                sub = 0;

            do {
                if(str[i - sub] === ' ')
                    return i-sub;

                sub++;
            } while(i+sub < str.length || i-sub > 0);
        },
        show: function(cb) {
            this.firstOpen = true;
            this.visible = true;
            this.sounds.open.play();

            this.range[0] = 0;
            this.range[1] = 1;

            var self = this;
            this._type(function() {
                setTimeout(function() {
                    self.doneCb = cb;
                }, self.speedCooldown);
            });
        },
        hide: function() {
            this.visible = false;
        },
        onAdvance: function(status) {
            //skip first one
            if(this.firstOpen) {
                this.firstOpen = false;
                return;
            }

            //done typing
            if(this.doneCb) {
                this.doneCb();
                this.doneCb = null;
            }
            //speed up typing
            else {
                this.speed = this.fastSpeed;

                var self = this;
                setTimeout(function() {
                    self.speed = self.typeSpeed;
                }, this.speedCooldown);
            }
        },
        _type: function(cb) {
            this.font.text = this.text.substr(this.range[0], this.range[1]);

            this.range[1]++;

            //TODO: Messages longer than 1 box should bump up the text

            if(this.range[1] > this.text.length) {
                if(cb) cb();
            } else {
                setTimeout(this._type.bind(this, cb), this.speed);
            }
        },
        _setup: function() {
            //add background
            this.addChild(new gf.Sprite(lttp.game.cache.getTextures('sprite_gui')['dialog.png']));

            //add font
            this.font = new ReturnOfGanonFont();
            this.font.scale.x = this.font.scale.y = 0.5;
            this.font.position.x = 8;
            this.font.position.y = 8;
            this.addChild(this.font);
        }
    });

    return Dialog;
});