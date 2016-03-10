// I want to manage the camera bounds manually, remove all the code that will mess with it.
Phaser.Camera.prototype.setBoundsToWorld = function () { /* do nothing */ };
Phaser.World.prototype.setBounds = function (x: number, y: number, width: number, height: number) {
    this._definedSize = true;
    this._width = width;
    this._height = height;

    this.bounds.setTo(x, y, width, height);

    this.x = x;
    this.y = y;

    this.game.physics.setBoundsToWorld();
};
