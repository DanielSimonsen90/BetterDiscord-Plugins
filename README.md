# BetterDiscord Plugins
## Forked from [Zerthox/BetterDiscord-Plugins](https://github.com/Zerthox/BetterDiscord-Plugins)

### [0DanhoLibrary](/dist/bd/0DanhoLibrary.plugin.js) <sub><sup>`v.1.0.0` *(Updated: 20/05/2022)*</sup></sub>
Library for my BetterDiscord plugins.

### [WordsPerMinute](/dist/bd/WordsPerMinute.plugin.js) <sub><sup>`v.1.0.0` *(Updated: 06/09/2024)*</sup></sub>
While typing, it shows the words per minute you are typing. Saves the highest WPM that can be viewed in settings.

### [BetterEmojiManagement - BETA](/dist/bd/BetterEmojiManagement.plugin.js) <sub><sup>`v.0.0.1` *(Updated: 10/09/2024)*</sup></sub>
Have better emoji management control.

* [FavorFavoriteEmojis]: Push your favorite emojis to the top of search results
* [BannedEmojis]: Ban "bad" emojis from the emoji picker
  - TODO: Fix context menu patching issue

**Note**: Beta version may crash your client due to EmojiStoreContext functionality not being fully implemented.
<br>

---

<br>

## Building from source
```sh
# install dependencies
npm install

# build all plugins
npm run build

# build specific plugins
npm run build -- BetterFolders BetterVolume

# build plugin to BetterDiscord folder & watch for changes
npm run dev -- BetterFolders
```
