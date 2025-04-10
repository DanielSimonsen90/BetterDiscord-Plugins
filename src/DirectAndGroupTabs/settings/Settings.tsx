import { createSettings } from "@dium/settings";

export const Settings = createSettings({
	defaultDirectAndGroupTab: 'direct',
})

export const titles: Record<keyof typeof Settings.current, string> = {
	defaultDirectAndGroupTab: `Default tab to open`,
}