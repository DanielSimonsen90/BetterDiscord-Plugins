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
    iconUrl: 'https://i.imgur.com/f5MDiAd.png',
    userTags: [USER_TAGS.DANHO],
    position: {
      before: BadgeTypes.ACTIVE_DEVELOPER,
      default: 0
    },
    size: '14px'
  } as CustomBadgeData,
});