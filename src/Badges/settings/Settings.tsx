import { createSettings } from "@dium/settings";

export const Settings = createSettings({
	movePremiumBadge: true,
	useClientCustomBadges: true,
})

export const titles: Record<keyof typeof Settings.current, string> = {
	movePremiumBadge: `Move nitro badges next to booster badges again`,
	useClientCustomBadges: `Use your own custom badges`,
}