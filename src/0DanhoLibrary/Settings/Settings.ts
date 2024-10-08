import { createSettings } from "@dium/settings";
import { BadgeTypes } from "@discord/components";

import { CustomBadgeData } from "../features/badges/CustomBadge";
import { DEFAULT_DISCORD_ROLE_COLOR, USER_TAGS } from "../constants";

export const Settings = createSettings({
  prettyRoles: true,
  defaultRoleColor: DEFAULT_DISCORD_ROLE_COLOR,
  groupRoles: true,

  badges: true,
  movePremiumBadge: true,
  useClientCustomBadges: true,

  pronounsPageLinks: true,
  allowForumSortByAuthor: true,
  expandBioAgain: true,
  
  wakeUp: true,
  isHidingOnPurpose: false,
});

export const titles: Record<keyof typeof Settings.current, string> = {
  prettyRoles: `Remove role circle, add more color to the roles`,
  defaultRoleColor: `Default role color`,
  groupRoles: `Widen roles that include "roles" in their name to make them stand out as a group`,

  badges: `User badge modifications`,
  movePremiumBadge: `Move the Nitro badge before the Server Boosting badge again`,
  useClientCustomBadges: `Use your own custom badges`,

  pronounsPageLinks: `Turn pronouns.page links into clickable links`,
  allowForumSortByAuthor: `Allow sorting forum posts by author`,
  expandBioAgain: `Expand the bio section again by default`,
  
  wakeUp: `Reminds you that you're hiding. Why are you hiding?`,
  isHidingOnPurpose: `User confirmed that they're hiding on purpose`
};

export const Badges = createSettings({
  developer: {
    name: 'Plugin Developer',
    iconUrl: 'https://media.discordapp.net/attachments/1005212649212100720/1288452741307433060/PinguDev.png?ex=66f53c9f&is=66f3eb1f&hm=f89e366a09bf6e9a50374e204b680beaca65de941c9f0cc8177f8f4021ec87c7&=&format=webp&quality=lossless&width=18&height=18',
    userTags: [USER_TAGS.DANHO],
    position: {
      before: BadgeTypes.ACTIVE_DEVELOPER,
      default: 0
    },
    size: '14px'
  } as CustomBadgeData,
});