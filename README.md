## The Legend of Zelda: A Link to the Past (WebGL Edition)

This is a recreation of [Nintendo's The Legend of Zelda: A Link to the Past](http://www.nintendo.com/games/detail/5oMtHuB3aOHoawfC6brZ6myQYnE4flQ_).
This is _not_ a port of the game, this is _not_ code conversion, this is _not_ the ROM running in an emulator. This is
a complete, written from scratch, recreation of one of my favorite classic games using WebGL in the browser. While I
will try my hardest to preserve the spirit of the game, and to come as close to the original as I can; expect slight
differences in gameplay, mechanics, and graphics.

This project is in no way endorsed by [Nintendo](http://www.nintendo.com/). Most images, logos, characters, dialog,
plot, and other assets taken from the original Link to the Past are copyrights of Nintendo; I claim no ownership of
any of the assets taken from the original game.

This game is built with [Phaser](http://phaser.io).

### Running the Game

The current state of the game is highly in flux, but you can always run the current state of master by installing
[Node.js](http://nodejs.org), and running the following:

```shell
cd lttp-phaser
npm install && npm start
```

Then point your browser to [http://localhost:8000](http://localhost:8000). If you wish to use a gamepad you will need
to be running Chrome 24+ or a [special build of Firefox](http://people.mozilla.com/~tmielczarek/mouselock+gamepad/).

### Resources

Below is a list of resources I used for game content. This including sprites, sounds, technical data, walkthroughs, mob
information, and misc details of the game:

* [Return of Ganon Font](http://www.zone38.net/font/#ganon) - For dialog and other text
* [The Spriter's Resource](http://www.spriters-resource.com/snes/zeldalinkpast/index.html) - Used a couple sprites from here
* [LTTP Maps](http://ian-albert.com/games/legend_of_zelda_a_link_to_the_past_maps/) - maps of all the dungeons
* [SNES Maps](http://vgmaps.com/Atlas/SuperNES/index.htm#LegendOfZeldaALinkToThePast) - maps of all the dungeons
* [Zelda Wiki](http://www.zeldawiki.org/The_Legend_of_Zelda:_A_Link_to_the_Past) - Great source of information on game content and mechanics
* [Zelda Elements](http://www.zeldaelements.net/games/c/a_link_to_the_past/) - Another good wiki-like source
* [nes-snes-sprites.com](http://www.nes-snes-sprites.com/LegendofZeldaTheALinktothePast.html) - Used for some character sprites

### Roadmap

Below is the current TODO list for the project:

* Enemies (generic npc loading from tmx)
* Dialog
* Cutscenes
* First Dungeon (palace)

### License and Legal

This code-base is released under the [MIT License](http://opensource.org/licenses/MIT).

All dependencies are released under their own respective licenses.

Most images, logos, characters, dialog, plot, and other assets taken from the original The Legend of Zelda: A Link to the Past
are copyrights of [Nintendo](http://www.nintendo.com/); I claim no ownership of any of the assets taken from the original game.
