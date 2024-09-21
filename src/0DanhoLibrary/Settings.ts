import { createSettings } from "@dium/settings";

export const DEFAULT_DISCORD_ROLE_COLOR = `153, 170, 181`;

export const Settings = createSettings({
  prettyRoles: true,
  defaultRoleColor: DEFAULT_DISCORD_ROLE_COLOR,
  groupRoles: true,

  memberListTabBar: true,
  countMembers: true,
  countActivities: true,
  defaultTab: `members`,
});

export const PluginState = createSettings({
  activeTab: `members`,
});

export const titles: Record<keyof typeof Settings.current, string> = {
  prettyRoles: `Remove role circle, add more color to the roles`,
  defaultRoleColor: `Default role color`,
  groupRoles: `Widen roles that include "roles" in their name to make them stand out as a group`,

  memberListTabBar: `Create a tab bar for the Channel Members list`,
  countMembers: `Display members count in the "Members" tab`,
  countActivities: `Display activities count in the "Activities" tab`,
  defaultTab: `Default tab for the Channel Members list`,
};