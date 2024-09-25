import { createSettings } from "@dium/settings";
import { CustomBadgeData, CustomBadgeProps } from "./features/badges/components/CustomBadge";
import { USER_TAGS } from "./constants";
import { BadgeTypes } from "@discord/components";

export const DEFAULT_DISCORD_ROLE_COLOR = `153, 170, 181`;

export const Settings = createSettings({
  prettyRoles: true,
  defaultRoleColor: DEFAULT_DISCORD_ROLE_COLOR,
  groupRoles: true,

  badges: true,
  movePremiumBadge: true,
});

export const titles: Record<keyof typeof Settings.current, string> = {
  prettyRoles: `Remove role circle, add more color to the roles`,
  defaultRoleColor: `Default role color`,
  groupRoles: `Widen roles that include "roles" in their name to make them stand out as a group`,

  badges: `User badge modifications`,
  movePremiumBadge: `Move the Nitro badge before the Server Boosting badge again`,
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
    size: '16px'
  } as CustomBadgeData,
});