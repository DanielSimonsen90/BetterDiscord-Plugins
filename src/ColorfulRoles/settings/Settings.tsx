import { createSettings } from "@dium/settings";
import { DEFAULT_DISCORD_ROLE_COLOR } from "../utils/constants";

export const Settings = createSettings({
	defaultRoleColor: DEFAULT_DISCORD_ROLE_COLOR,
	groupRoles: false,
})

export const titles: Record<keyof typeof Settings.current, string> = {
	defaultRoleColor: `Default role color`,
	groupRoles: `Widen roles that include "roles" in their name to make them stand out as a group`,
}