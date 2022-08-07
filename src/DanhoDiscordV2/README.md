### [DanhoDiscordV2](/dist/bd/DanhoDiscordV2.plugin.js) <sub><sup>`v.0.1.0` *(Updated: 20/05/2022)*</sup></sub>
General small Discord changes to my liking. So far only includes:
* BetterRoles
  - Color role background with slight opacity
* NoMoreLightmode
  - Areas that are broken and automatically goes to theme-light, are fixed to show selected theme (which obviously is theme-dark)
* EditBioElsewhere
  - Edit your bio in other places like UserPopout or UserProfileModal

**Features to implement**
> * Role Groups to group roles in a container using REGEX on the role's name
> * MoreDiscordPages to add more Discord pages to the Guild list
> - Add support for custom components?

> **Bugs**
>  * NoMoreLightmode
>   * Sometimes doesn't patch CreateGuildModal, therefore not replacing Discord's light-theme bug
> * EditBioElsewhere
>   * Doesn't actually update bio yet
>   * Doesn't parse custom emojis