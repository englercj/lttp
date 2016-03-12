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

### Building and running the game

When the project gets more stable I will host a playable version on GitHub Pages, but for now you need to build manually.

This project uses [node](https://nodejs.org/) for building and [git-lfs](https://git-lfs.github.com/) for managing
binary files in the project. You will need to install both to work on this project.

After you have the dependencies above installed, clone this repository. If you already cloned this repository before
installing git-lfs you can get the binary files by using `git lfs pull` to update your local binary files.

Once you have the repostiory cloned, you can install dependencies and run the development server:

```
npm install && npm start
```

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

Below is a non-exhaustive TODO list for the project:

- Signage
- Lifting items
- Fix drops
- Add handling for gamepad axis sticks
- Implement ERASE/COPY menu options in main menu
- NPCs (generic npc loading from tmx)
- Implement better level loading and manifest
- Finish up ROG Font characters
- Bosses and boss mechanics
- First Dungeon (palace)
- Intro dialog

### License and Legal

This code-base is released under the [MIT License](http://opensource.org/licenses/MIT).

All dependencies are released under their own respective licenses.

Most images, logos, characters, dialog, plot, and other assets taken from the original The Legend of Zelda: A Link to the Past
are copyrights of [Nintendo](http://www.nintendo.com/); I claim no ownership of any of the assets taken from the original game.
