import { createSettings } from "@dium/settings";

export const DiscordEnhancements = {
  discordEnhancements: true,

  joinVoiceWithCamera: true,

  showGuildMembersInHeader: true,

  allowForumSortByAuthor: true,

  showUserTimezone: true,
  hideTimezoneIcon: false,
  hideTimezoneTimestamp: false,

  showUserBirthdate: true,
  hideBirthdateIcon: false,
  hideBirthdateTimestamp: false,
  birthdateTimestampStyle: 'd',
  showBirthdayCalendar: true,
  showBirthdayOnNameTag: true,

  expandActivityStatus: true,

  hideChannelUntilActivity: true,
  keepChannelVisibleAfterActivityTimeoutMin: 5,
}

export const Settings = createSettings({
  ...DiscordEnhancements,
});

export const DiscordEnhancementsTitles: Record<keyof typeof DiscordEnhancements, string> = {
  discordEnhancements: `Discord enhancements`,

  joinVoiceWithCamera: `Join voice channels with camera on`,

  showGuildMembersInHeader: `Show guild members in the header`,

  allowForumSortByAuthor: `Allow sorting forum posts by author`,

  showUserTimezone: `Show user's timezone in the user popout/profile`,
  hideTimezoneIcon: `Hide the timezone icon`,
  hideTimezoneTimestamp: `Hide the timezone timestamp`,

  showUserBirthdate: `Show user's birthdate in the user popout/profile`,
  hideBirthdateIcon: `Hide the birthdate icon`,
  hideBirthdateTimestamp: `Hide the birthdate timestamp`,
  birthdateTimestampStyle: `Birthdate timestamp style`,
  showBirthdayCalendar: `Show birthday calendar in global navigation`,
  showBirthdayOnNameTag: `Show birthday on name tag`,

  expandActivityStatus: `Expand activity status to show more information i.e. what a user is listening to`,

  hideChannelUntilActivity: `Hide channels from your channel list until they have activity`,
  keepChannelVisibleAfterActivityTimeoutMin: `Keep recently active hidden channel visible for x minutes`,
};

export const titles: Record<keyof typeof Settings.current, string> = {
  ...DiscordEnhancementsTitles,
};