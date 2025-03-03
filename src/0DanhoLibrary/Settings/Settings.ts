import { createSettings } from "@dium/settings";
import { DEFAULT_DISCORD_ROLE_COLOR } from "../constants";

export const StyleChanges = {
  styleChanges: true,

  movePremiumBadge: true,

  prettyRoles: true,
  defaultRoleColor: DEFAULT_DISCORD_ROLE_COLOR,
  groupRoles: true,

  pronounsPageLinks: true,
  expandBioAgain: true,
  nonObnoxiousProfileEffects: true,
}

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
}

export const DanhoEnhancements = {
  danhoEnhancements: true,

  badges: true,
  useClientCustomBadges: true,

  wakeUp: true,
  isHidingOnPurpose: false,

  addToDungeon: true,

  lockChannels: true,
  lockPassword: 'hello',
  lockUnlockForMinutes: 5,
  initialLockState: true,
}

export const Settings = createSettings({
  ...StyleChanges,
  ...DiscordEnhancements,
  ...DanhoEnhancements,
});

export const StyleChangesTitles: Record<keyof typeof StyleChanges, string> = {
  styleChanges: `Style changes`,

  movePremiumBadge: `Move the Nitro badge before the Server Boosting badge again`,

  prettyRoles: `Remove role circle, add more color to the roles`,
  defaultRoleColor: `Default role color`,
  groupRoles: `Widen roles that include "roles" in their name to make them stand out as a group`,

  pronounsPageLinks: `Turn pronouns.page links into clickable links`,
  expandBioAgain: `Expand the bio section again by default`,
  nonObnoxiousProfileEffects: `Lower the opacity of profile effects (on hover) so they aren't as obnoxious`,
};

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
};

export const DanhoEnhancementsTitles: Record<keyof typeof DanhoEnhancements, string> = {
  danhoEnhancements: `Danho enhancements`,

  badges: `User badge modifications`,
  useClientCustomBadges: `Use your own custom badges`,

  wakeUp: `Reminds you that you're hiding. Why are you hiding?`,
  isHidingOnPurpose: `User confirmed that they're hiding on purpose`,

  addToDungeon: `"Add to / Remove from Dungeon" context menu on users in the Deadly Ninja server`,

  lockChannels: `Lock channels with a password`,
  lockPassword: `Password for locking channels`,
  lockUnlockForMinutes: `Minutes to lock channels for`,
  initialLockState: `Initial lock state for channels`,
}

export const titles: Record<keyof typeof Settings.current, string> = {
  ...StyleChangesTitles,
  ...DiscordEnhancementsTitles,
  ...DanhoEnhancementsTitles,
};