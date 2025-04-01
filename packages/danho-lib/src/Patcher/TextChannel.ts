import Finder from "@danho-lib/dium/api/finder";
import { Channel, Guild, Snowflake } from "@discord/types";
export type TextChannel = JSX.BD.FC<{
  canBeNewChannel: boolean;
  channel: Channel;
  disableManageChannels: undefined;
  guild: Guild;
  isFavoriteCategory: boolean;
  muted: boolean;
  position: number;
  selected: boolean;
  subtitle: null;
  withGuildIcon: undefined;
}, {
  ackMessageId: null | Snowflake;
  canBeNewChannel: boolean;
  canManageChannel: boolean;
  canReorderChannel: boolean;
  canShowThreadPreviewForUser: boolean;
  channel: Channel;
  channelInfo: null;
  disableManageChannels: undefined;
  embeddedApps: [];
  enableActivities: boolean;
  guild: Guild;
  hasActiveThreads: boolean;
  hasChannelInfo: boolean;
  hasMoreActiveThreads: boolean;
  isFavoriteCategory: boolean;
  isFavoriteSuggestion: boolean;
  isLowImportanceMention: boolean;
  isNewchannel: boolean;
  isSubscriptionGated: boolean;
  muted: boolean;
  needSubscriptionToAccess: boolean;
  position: number;
  resolvedUnreadSetting: number;
  selected: boolean;
  subtitle: null;
  unread: boolean;
  withGuildIcon: undefined;
}>

export const TextChannel: Record<'Z', TextChannel> = Finder.findBySourceStrings("channel", "muted", "selected", "unread", { defaultExport: false });
export default TextChannel;