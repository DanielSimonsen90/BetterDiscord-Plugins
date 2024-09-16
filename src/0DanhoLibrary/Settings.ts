import { createSettings } from "@dium/settings";

export const DEFAULT_DISCORD_ROLE_COLOR = `153, 170, 181`;

export const Settings = createSettings({
  prettyRoles: true,
  defaultRoleColor: DEFAULT_DISCORD_ROLE_COLOR
});

export const titles: Record<keyof typeof Settings.current, string> = {
  prettyRoles: `Remove role circle, add more color to the roles`,
  defaultRoleColor: `Default role color`
};