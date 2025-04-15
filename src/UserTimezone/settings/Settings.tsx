import { createSettings } from "@dium/settings";

export const Settings = createSettings({
	hideTimezoneIcon: false,
	hideTimezoneTimestamp: false,
})

export const titles: Record<keyof typeof Settings.current, string> = {
	hideTimezoneIcon: `Hide the timezone icon`,
	hideTimezoneTimestamp: `Hide the timezone timestamp`,
}