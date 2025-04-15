import { createSettings } from "@dium/settings";

export const Settings = createSettings({
	keepChannelVisibleAfterActivityTimeoutMin: 5,
})

export const titles: Record<keyof typeof Settings.current, string> = {
	keepChannelVisibleAfterActivityTimeoutMin: `Keep recently active hidden channel visible for x minutes`,
}