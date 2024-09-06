# BetterDiscord Plugins
## Forked from [Zerthox/BetterDiscord-Plugins](https://github.com/Zerthox/BetterDiscord-Plugins)

### [DanhoDiscordV2](/dist/bd/DanhoDiscordV2.plugin.js) <sub><sup>`v.0.0.1` *(Updated: 20/05/2022)*</sup></sub>
General small Discord changes to my liking. So far only includes:
* BetterRoles
  - Hiding roleCircle from the DOM
  - Color role background with slight opacity

**Features to implement**
> * Role Groups to group roles in a container using REGEX on the role's name
> * MoreDiscordPages to add more Discord pages to the Guild list
> - Add support for custom components?

### [DanhoCustomBadges](/dist/bd/DanhoCustomBadges.plugin.js) <sub><sup>`v.0.0.2` *(Updated: 27/05/2022)*</sup></sub>
Add your own custom badges to your or other people's profile.

> **Features to implement**
> * File upload in settings so it's not only reliant on urls
> * Badge context menu to edit badge directly in the app
> * Badge references, so you can add the same badge to multiple users instead of creating the same badge over and over
>
> * Verified server owners get a "Verified" badge
> * Partner/Verified badges clicked redirects to server invite
>
> * Settings Collapse containers
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
