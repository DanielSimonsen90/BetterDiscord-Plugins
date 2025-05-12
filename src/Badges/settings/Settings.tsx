import { createSettings } from "@dium/settings";

export const Settings = createSettings({
	movePremiumBadge: true,
	useDiscordCustomBadges: true,
	useClientCustomBadges: true,
})

export const titles: Record<keyof typeof Settings.current, string> = {
	movePremiumBadge: `Move nitro badges next to booster badges again`,
	useDiscordCustomBadges: `Use custom-given Discord badges`,
	useClientCustomBadges: `Use your own custom badges`,
}