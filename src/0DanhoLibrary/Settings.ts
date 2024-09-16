import { createSettings } from "@dium/settings";

export const Settings = createSettings({
  prettyRoles: true
});

export const titles: Record<keyof typeof Settings.current, string> = {
  prettyRoles: `Remove role circle, add more color to the roles`
};