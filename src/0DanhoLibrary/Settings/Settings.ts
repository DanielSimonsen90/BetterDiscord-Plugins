import { createSettings } from "@dium/settings";

export const DiscordEnhancements = {
  discordEnhancements: true,

  autoCancelFriendRequests: true,
  folderNames: new Array<string>(),

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

  betterQuickSwitcher: true,

  expandActivityStatus: true,

  hideChannelUntilActivity: true,
  keepChannelVisibleAfterActivityTimeoutMin: 5,

  directAndGroupTabs: true,
  defaultDirectAndGroupTab: 'direct',
}

export const DanhoEnhancements = {
  danhoEnhancements: true,

  badges: true,
  movePremiumBadge: true,
  useClientCustomBadges: true,

  wakeUp: true,

  addToDungeon: true,

  lockChannels: true,
  lockPassword: 'hello',
  lockUnlockForMinutes: 5,
  initialLockState: true,
}

export const Settings = createSettings({
  ...DiscordEnhancements,
  ...DanhoEnhancements,
});

export const DiscordEnhancementsTitles: Record<keyof typeof DiscordEnhancements, string> = {
  discordEnhancements: `Discord enhancements`,

  autoCancelFriendRequests: `Auto cancel friend requests on bigger servers`,
  folderNames: `Folder names that should block all incoming friend requests`,

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

  betterQuickSwitcher: `Better quickswitcher prioritizing friends and top guilds`,

  expandActivityStatus: `Expand activity status to show more information i.e. what a user is listening to`,

  hideChannelUntilActivity: `Hide channels from your channel list until they have activity`,
  keepChannelVisibleAfterActivityTimeoutMin: `Keep recently active hidden channel visible for x minutes`,

  directAndGroupTabs: `Add a tab bar to distinguish between direct messages and group chats`,
  defaultDirectAndGroupTab: `Default tab to open`,
};

export const DanhoEnhancementsTitles: Record<keyof typeof DanhoEnhancements, string> = {
  danhoEnhancements: `Danho enhancements`,

  badges: `User badge modifications`,
  movePremiumBadge: `Move nitro badges next to booster badges again`,
  useClientCustomBadges: `Use your own custom badges`,

  wakeUp: `Reminds you that you're hiding. Why are you hiding?`,

  addToDungeon: `"Add to / Remove from Dungeon" context menu on users in the Deadly Ninja server`,

  lockChannels: `Lock channels with a password`,
  lockPassword: `Password for locking channels`,
  lockUnlockForMinutes: `Minutes to lock channels for`,
  initialLockState: `Initial lock state for channels`,
}

export const titles: Record<keyof typeof Settings.current, string> = {
  ...DiscordEnhancementsTitles,
  ...DanhoEnhancementsTitles,
};