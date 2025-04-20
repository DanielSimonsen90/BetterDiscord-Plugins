import { createSettings } from "@dium/settings";

export const Settings = createSettings({
	hideContentInventory: false,
	pushYouToTop: false,
})

export const titles: Record<keyof typeof Settings.current, string> = {
	hideContentInventory: 'Prevent member activties from rendering',
	pushYouToTop: 'Push your profile to the top of the channel members list',
}