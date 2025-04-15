import { createSettings } from "@dium/settings";

export const Settings = createSettings({
	isHidingOnPurpose: false,
})

export const titles: Record<keyof typeof Settings.current, string> = {
	isHidingOnPurpose: `You confirmed that you're "hiding on purpose", meaning the notice will not be shown until you chance your status from "invisible" to something else.`,
}