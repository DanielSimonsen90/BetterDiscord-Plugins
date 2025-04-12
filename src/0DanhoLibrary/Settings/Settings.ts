import { createSettings } from "@dium/settings";

export const DiscordEnhancements = {
  discordEnhancements: true,

  showUserTimezone: true,
  hideTimezoneIcon: false,
  hideTimezoneTimestamp: false,
}

export const Settings = createSettings({
  ...DiscordEnhancements,
});

export const DiscordEnhancementsTitles: Record<keyof typeof DiscordEnhancements, string> = {
  discordEnhancements: `Discord enhancements`,

  showUserTimezone: `Show user's timezone in the user popout/profile`,
  hideTimezoneIcon: `Hide the timezone icon`,
  hideTimezoneTimestamp: `Hide the timezone timestamp`,
};

export const titles: Record<keyof typeof Settings.current, string> = {
  ...DiscordEnhancementsTitles,
};