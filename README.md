# BetterDiscord Plugins
## Forked from [Zerthox/BetterDiscord-Plugins](https://github.com/Zerthox/BetterDiscord-Plugins)

### [0DanhoLibrary](/dist/bd/0DanhoLibrary.plugin.js) <sub><sup>`v.1.6.0` *(Updated: 20/05/2022)*</sup></sub>
General Discord changes and improvements including:
* [PrettyRoles]: Make roles look better
* [Badges]: Move Nitro badge back to after boost badge + add Plugin Developer badge
* [Pronouns.page links]: Make pronouns.page links clickable
* [SortForumPostsByAuthor]: Sort forum posts by author
* [ExpandBiosAgain]: Nobody liked the compressed bios, so I expanded them again
* [WakeUp]: Sometimes you forget that you're hiding, so here's a reminder

#### Bugs
* [OrderForumPostsByAuthor]
  - Breaks longer post preview messages
  - Possibly also breaks original "Sort by" options - *Not tested*

**Removed**
* ActivityTab: Replace Guild Members aside with Tabbar of members and activities - *Removed due to mass component updates, making patches glitchy*

### [WordsPerMinute](/dist/bd/WordsPerMinute.plugin.js) <sub><sup>`v.1.0.3` *(Updated: 06/09/2024)*</sup></sub>
While typing, it shows the words per minute you are typing. Saves the highest WPM that can be viewed in settings.

### [BetterEmojiManagement - BETA](/dist/bd/BetterEmojiManagement.plugin.js) <sub><sup>`v.1.0.1` *(Updated: 10/09/2024)*</sup></sub>
Have better emoji management control.

* [FavorFavoriteEmojis]: Push your favorite emojis to the top of search results
* [BannedEmojis]: Ban "bad" emojis from the emoji picker

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
## Developer notes
DevilBro has been so kind to make an enitre list of [Discord Modules](https://github.com/mwittrien/BetterDiscordAddons/blob/b6d959f98ce429d97c68c58fba29392bd25ff6f5/Library/_res/0BDFDB.data.json#L394)